const express = require('express');
const router = express.Router();

const Crawler = require("crawler");
const midAPI = require("./../../middleware/index");
const {cutStringRank,cutStringDate,cutURLpng} = require('./../../util/HandleString');

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
          // $ is Cheerio by default
          //a lean implementation of core jQuery designed specifically for the server
          let image = $(".a-dynamic-image");
          let rank = $("#SalesRank").text();
          let date = $("#detailBullets_feature_div").text();
         
          let URL_Origin = '';
          let nameImage = '';
          for(var i =0;i<image.length;i++)
          {
            URL_Origin = image[i].attribs.src;
            nameImage = image[i].attribs.alt;
          }
          
          Item = {
            name : nameImage,
            image : cutURLpng(URL_Origin),
            rank : cutStringRank(rank),
            date : cutStringDate(date)
          }
        console.log(Item)
        array3.push(Item);
        
        }
  
        done();
      }
    });
    c.queue(req.data[i]);
  }

  c.on('drain',function(){
    setTimeout(() => {
      response.json({data : array3})
    }, 4000);
    
  });
  } catch (error) {
    console.log(error)
    response.json({msg : 'Error please try again'});
  }
})


router.get("/testAPI", (req, respose) => {
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
          let image = $(".a-dynamic-image");
          let rank = $("#SalesRank").text();
          let date = $("#detailBullets_feature_div").text();
         
          let URL_Origin = '';
          let nameImage = '';
          for(var i =0;i<image.length;i++)
          {
            URL_Origin = image[i].attribs.src;
            nameImage = image[i].attribs.alt;
          }
          
          Item = {
            name : nameImage,
            image : cutURLpng(URL_Origin),
            rank : cutStringRank(rank),
            date : cutStringDate(date)
          }
          respose.json({data : Item})
        
  
         
        }
  
        done();
      }
    });
    c.queue('https://www.amazon.com/Panda-Happy-Halloween-T-shirt-Pumpkin/dp/B07W952QWQ/ref=sr_1_2?keywords=shirt+halloween&m=ATVPDKIKX0DER&qid=1568997467&refinements=p_6%3AATVPDKIKX0DER&s=apparel&sr=1-2');
    
    
  });



module.exports = router;