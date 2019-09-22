const express = require('express');
const router = express.Router();
const {
  check,
  validationResult
} = require('express-validator');
const bcrypt = require('bcryptjs');
const USER = require('./../../models/users');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('./../../middleware/auth');
const multer = require('multer');
const mailjet = require('node-mailjet')
  .connect('b49983dc200e0ed41032b4019f3f3059', '7d324639b1b0eb8fa17dd78c85f5059c')
const randowString = require('randomstring');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');

  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
})

const upload = multer({
  storage: storage
});


/*
    @api/users/signUp
    Params : {
      email,
      password,
      firstName,
      lastName
    }
*/
router.get('/signUp',
  [
    check('email', 'Email không được để trống').not().isEmpty(),
    check('password', 'Password không được để trống').not().isEmpty(),
    
    check('name', 'Name không được để trống').not().isEmpty(),
    check('email', 'Email sai định dạng').isEmail(),
    check('password', 'Password phải dài hơn 6 ký tự').isLength({
      min: 6
    })
  ],
  async (req, res) => {



    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
        status : 204
      });
    }

    const {
      email,
      password,
      name
    } = req.query;

    

    try {
      let userCheckExist = await USER.findOne({
        email: email
      });


      if (userCheckExist != null) {
        return res.json({errors :
          [{msg : 'Email đã tồn tại'}],
          status : 204
        });
      }


      var salt = await bcrypt.genSaltSync(10);
      var hashPass = await bcrypt.hashSync(password, salt);

      var userInsert = new USER({
        email,
        password: hashPass,
        name,
        avatar: 'uploads/avatar-default.jpg',
      
      });

      await userInsert.save();




    } catch (error) {
      res.json({
        errors: [{
          msg: 'Server error'
        }],
        status : 204
      });
    }
    let userCheck = await USER.findOne({
      email
    });
    if(userCheck !== null){
    const payload = {
      id: userCheck.id,
      role: userCheck.role
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          status : 200
        });
      }
    )
    }else {
      res.json({errors: [{
        msg: 'Sign up falied'
      }],
      status : 204
    })
    }
    

  })

/*
    @api/users/signIn
    Params : {
      email,
      password
    }
*/

router.get('/signIn', [
  check('email', 'Email không được trống !').not().isEmpty(),
  check('password', 'Password không được trống !').not().isEmpty(),
  check('email', 'Email không đúng định dạng!').isEmail(),
  
], async (req, res) => {
  console.log(req.query);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return res.json({
      errors: errors.array(),
      status : 204
    });
  }

  const {
    email,
    password
  } = req.query;


  try {
    let userCheck = await USER.findOne({
      email
    });
    console.log(userCheck);
    if (userCheck === null) {
      return res.json({
        errors: [{
          msg: 'Sai email hoặc password'
        }],
        status : 204
      });
    }
    if (!bcrypt.compareSync(password, userCheck.password)) {
      return res.json({
        errors: [{
          msg: 'Sai email hoặc password'
        }],
        status : 204
      });

    }


    const payload = {
      id: userCheck.id,
      role: userCheck.role
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      (err, token) => {
        if (err) throw err;
        res.json({
          token : userCheck,
          status : 200
        });
      }
    )

  } catch (error) {
    res.status(422).json({
      errors: [{
        msg: 'Server error'
      }]
    });
  }
})


/*
    @api/users/getAllProfileUser
    Header : {
      x-auth-token
    }

*/
router.get('/getAllProfileUser', async (req, res) => {
  try {
    let userObj = await USER.findById(req.id).select('-password');

    res.json({
      user: userObj
    });
  } catch (error) {
    res.status(501).json({
      errors: [{
        msg: 'Server error'
      }]
    });
  }

})

/*
    @api/users/editAvatar
    file : {
      jpg, png
    }
*/
router.post('/editAvatar', auth, upload.single('avatarUser'), async (req, res) => {

  try {
    let userObj = await USER.findByIdAndUpdate(req.id, {
      avatar: req.file.path
    });

    res.json({
      msg: 'Update avatar successful'
    });
  } catch (error) {
    res.status(501).json({
      msg: 'Server error'
    });
  }

})

/*
    @api/users/editName
    param : {
      firstName,
      lastName
    }
*/
router.post('/editName', auth,
  [
    check('name','Name is not empty').not().isEmpty()

  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array()
      });
    }

    let {name} = req.body;
    try {
      let userObj = await USER.findByIdAndUpdate(req.id, {
        name
      });
      res.json({
        msg: 'Update your name successful'
      });
    } catch (error) {
      res.json({
        msg: 'Server error'
      });
    }
  })



/*
    @api/users/getTop10User
*/
router.get('/getTop10User', auth, async (req, res) => {
  try {
    let userFind = await USER.find().select('-password').sort({
      'point': -1
    }).limit(10);
    res.json({
      data: userFind
    });
  } catch (error) {
    res.json({
      msg: 'Server error'
    });
  }
})





/*
    @api/users/getDataUser
*/
router.get('/getDataUser', auth, async (req, res) => {
  try {
    res.json(await USER.findById(req.id).select('-password'));
  } catch (error) {
    console.log(error);
    res.json({
      msg: 'Server error'
    });
  }
})

/*
    @api/users/getAllUser
*/
router.get('/getAllUser', async (req, res) => {
 
  try {

    

   
      let AllUser = await USER.find().select('-password');
      res.json({
        listUser: AllUser,
        status : 200
      });
   
    
  } catch (error) {
    console.log(error);
    res.status(501).json({
      msg: 'Server error'
    });
  }
})

router.get('/getNewPassword', [
  check('email', 'Email is not empty').not().isEmpty(),
  check('email', 'Email invalidate').isEmail(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return res.status(205).json({
      errors: errors.array()
    });
  }
  try {
    const {
      email
    } = req.query;
    const getDataUser = await USER.findOne({
      email
    });
    console.log(getDataUser);
    if (getDataUser !== null) {
      let newPassword = randowString.generate(7);
      var salt = await bcrypt.genSaltSync(10);
      var hashPass = await bcrypt.hashSync(newPassword, salt);
      let changePassword = await USER.findByIdAndUpdate(getDataUser._id, {
        password: hashPass
      });
      const request = mailjet
        .post("send", {
          'version': 'v3.1'
        })
        .request({
          "Messages": [{
            "From": {
              "Email": "ntd.codervn@gmail.com",
              "Name": "Duy"
            },
            "To": [{
              "Email": email,
            }],
            "Subject": "sending new password for user id " + getDataUser._id,
            "TextPart": "Please login to the app and change your password for added security, thank you for using our service.",
            "HTMLPart": "New Password : " + newPassword,
            "CustomID": "AppGettingNewPassword"
          }]
        })
      request
        .then((result) => {
         
          res.status(200).json({
            msg: 'Sent new password successfull, please check your mail !'
          });
        })
        .catch((err) => {
         
          res.status(202).json({
            msg: 'Sent Password Failed !'
          });
        })
    } else {
      res.status(201).json({
        msg: 'Email not found !'
      });
    }

  } catch (error) {
    
    res.status(501).json({
      msg: 'Server error'
    });
  }
})

router.post('/changePassword', auth, [
  check('currentPassword', 'Password is not empty').not().isEmpty(),
  check('newPassword', 'Password is not empty').not().isEmpty()
], async (req, res) => {
  try {
    let {newPassword,currentPassword} = req.body;
    let userCheck = await USER.findById(req.id);
    if (!bcrypt.compareSync(currentPassword, userCheck.password)) {
      return res.status(202).json({
        msg: 'Wrong password, please check again'
      });
    }
    var salt = await bcrypt.genSaltSync(10);
    var hashPass = await bcrypt.hashSync(newPassword, salt);
    let updatePassword = await USER.findByIdAndUpdate(req.id,{password : hashPass});

    res.status(200).json({
      msg: 'Change password successful'
    });
  } catch (error) {
    res.status(501).json({
      msg: 'Server error'
    });
  }

})

router.get('/deleteUserById', async (req,res) => {
  try {
    let deleteUser = await USER.findByIdAndDelete(req.query.id);
    res.json({msg : 'Xóa thành công',status:200})
  } catch (error) {
    res.status(501).json({
      msg: 'Server error'
    });
  }
})




module.exports = router;