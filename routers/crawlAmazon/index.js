const express = require('express');
const router = express.Router();
const fs = require('fs')
const Crawler = require("crawler");
const midAPI = require("./../../middleware/index");
const randomString = require('randomstring');
const {cutStringRank,cutStringDate,cutURLpng} = require('./../../util/HandleString');
const download = require('image-downloader');
router.get('/getDataInAmazon',midAPI, (req,response) => {
    const array3 = [];
    console.log('hello')
  try {
    for(var i =0;i < req.data.length-1 ; i++)
  {
    var c = new Crawler({
      maxConnections: 1000,
      rateLimit: 2000,
      // This will be called for each crawled page
      callback: function(error, res, done) {
        if (error) {
          console.log(error);
        } else {
         
          var $ = res.$;
          
          let image = $("#imgTagWrapperId");
          let image2 = $("#landingImage");
          let rank = $("#SalesRank").text();
          let date = $("#detailBullets_feature_div").text();
         
          let URL_Origin = '';
          let nameImage = '';
          var sBegin = image.html() ;
          if(sBegin != null && sBegin != undefined)
          {
            console.log(sBegin.indexOf(`data-old-hires=`),sBegin.indexOf(`onload=`));
            URL_Origin =sBegin.substring(sBegin.indexOf(`data-old-hires=`)+16,sBegin.indexOf(`onload=`)-2);
            console.log(URL_Origin);
          }
  
            
            for(var i =0 ; i<image2.length;i++)
            {
              nameImage = image2[i].attribs.alt;
            }
          
          
              Item = {
                name : nameImage,
                image : cutURLpng(URL_Origin),
                rank : cutStringRank(rank),
                date : cutStringDate(date)
              }
          
          
          
         
        if(Item.image !== '')
        {
          array3.push(Item);
        }
        
        
        }
  
        done();
      }
    });
    
    c.queue({
      uri : req.data[i],
      // userAgent : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36 OPR/43.0.2442.991'
    });
  }

  

  c.on('drain',function(){
    setTimeout(() => {
      
      response.json({data : array3,status : 200})
    }, 6000);
    
  });
  } catch (error) {
    console.log(error)
    response.json({msg : 'Robot của Amazon đã chặn request vui lòng thử lại sau ít phút',status : 204});
  }
  
})

router.post('/getDataInAmazonCustom', async (req,response) => {
 
  try {
    const array2 = req.body.array3;
    const array3 = [];
    console.log(array2)
    for(let i =0 ; i < array2.length ; i++)
    {
      let stringNew = await cutURLpng(array2[i]);
      let Item = {
        image : stringNew
      }
      console.log(Item.image);
      array3.push(Item);
    }
    console.log(array3)

    response.json({data : array3,status : 200});

  } catch (error) {
    
  }
 
  
})


router.get("/testAPI", (req, respose) => {
  var Item = {};
    var c = new Crawler({
      maxConnections: 10,
      // This will be called for each crawled page
      callback: function(error, res, done) {
        if (error) {
          console.log(error);
        } else {
          var $ = res.$;
         
       
          // $ is Cheerio by default
          //a lean implementation of core jQuery designed specifically for the server
          let image = $("#imgTagWrapperId");
          let rank = $("#SalesRank").text();
          let date = $("#detailBullets_feature_div").text();
         
          let URL_Origin = '';
          let nameImage = '';
         console.log()
         
          // console.log(image.length);
          // console.log(typeof(image[2].attribs));          
            var sBegin = image.html() ;
  
            console.log(sBegin.indexOf(`data-old-hires=`),sBegin.indexOf(`onload=`));
            URL_Origin =sBegin.substring(sBegin.indexOf(`data-old-hires=`)+16,sBegin.indexOf(`onload=`)-2);
            console.log(URL_Origin)
            for(var i =0 ; i<image.length;i++)
            {
              nameImage = image[0].attribs.alt;
            }
           
           
      
          
          Item = {
            name : nameImage,
            image :cutURLpng(URL_Origin),
            rank : cutStringRank(rank),
            date : cutStringDate(date),
            URL_Origin
          }
          console.log(Item);
         
         
        
  
         
        }
  
        done();
      }
    });
    c.queue('https://www.amazon.com/Womens-Galaxy-Dachshund-Dog-T-Shirt/dp/B07RTRZT27/ref=sr_1_1?keywords=Womens%20Cute%20Galaxy%20Dachshund%20Mom%20Weiner%20Dog%20T-Shirt&qid=1569261617&sr=8-1&fbclid=IwAR0N5bl6hItXFKFjBsP2xaqvY6r8aynGn6IhjjWhHzV0SFdNQwCp4TOE90w');
    
    c.on('drain',function(){
      setTimeout(() => {
        
        respose.json({data : Item})
      }, 100);
      
    });
  });

  
  

router.post('/DowloadImg',(req,res) => {
  
  try {
    const {listData} = req.body;
    console.log(listData);
    
    for(let i =0;i<listData.length;i++)
    {
      download.image({
        url: `${listData[i].image}`,
        dest: `download/ChuaDoiTen/${listData[i].name.replace('|','')}.png`
      })
      .then(({ filename, image }) => {
        console.log('Saved to', filename)  // Saved to /path/to/dest/image.jpg
      })
      .catch((err) => console.error(err))
    }

    res.json({status : 200});

  } catch (error) {
    console.log(error);
    res.json({status : 204});
  }
})

router.post('/DowloadImgGetHand',(req,res) => {
  
  try {
    const {listData} = req.body;
    
  
    for(let i =0;i<listData.length;i++)
    {
      download.image({
        url: `${listData[i].image}`,
        dest: `download/GetTay/${randomString.generate(20)}.png`,

      })
      .then(({ filename, image }) => {
        console.log('Saved to', filename)  // Saved to /path/to/dest/image.jpg
      })
      .catch((err) => console.error(err))
    }

    res.json({status : 200});

  } catch (error) {
    console.log(error);
    res.json({status : 204});
  }
})

router.post('/DowloadImgChangeName',(req,res) => {
  
  try {
    const {listData} = req.body;
    console.log(listData);
    
    for(let i =0;i<listData.length;i++)
    {
      download.image({
        url: `${listData[i].image}`,
        dest: `download/DaDoiTen/${listData[i].name.replace('|','')}.png`
      })
      .then(({ filename, image }) => {
        console.log('Saved to', filename)  // Saved to /path/to/dest/image.jpg
      })
      .catch((err) => console.error(err))
    }

    res.json({status : 200});

  } catch (error) {
    console.log(error);
    res.json({status : 204});
  }
})



module.exports = router;