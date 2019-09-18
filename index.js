const express = require('express');
const app = express();
app.listen(3000);
const {
  writeFileSync
} = require('fs')
const ics = require('ics')
const nodemailer = require('nodemailer');

app.use('/public', express.static('public'))

var Crawler = require("crawler");
const BASE_URL = 'https://www.amazon.com';
const midAPI = require('./middleware/index')


// Queue just one URL, with default callback

app.get('/', midAPI , async (req, response) => {
  const array3 = [];
  const dem = 0;
 for (let index = 0; index < req.data.length; index++) {
 
    var c =  new Crawler({
      maxConnections: 10,
      // This will be called for each crawled page
      callback: function  (error, res, done) {
        if (error) {
          console.log(error);
        } else {
          var $ = res.$;
          // $ is Cheerio by default
          //a lean implementation of core jQuery designed specifically for the server
          let rank = $("#SalesRank");
         
          array3.push('123');
          
          console.log(rank);
            
          
        }
  
        done();
        
      }
    });
    await c.queue(req.data[index]);
    
  
  }
 
  

})


app.get('/s', (req,res) => {
  var c =  new Crawler({
    maxConnections: 10,
    // This will be called for each crawled page
    callback: function  (error, res, done) {
      if (error) {
        console.log(error);
      } else {
        var $ = res.$;
        // $ is Cheerio by default
        //a lean implementation of core jQuery designed specifically for the server
        let rank = $(".imgTagWrapper");
       
       
        console.log(rank);
        console.log(rank.attribs);
          
        
      }

      done();
      
    }
  });
   c.queue('https://www.amazon.com/Kids-UCLA-Mascot-T-shirt-kids/dp/B07PNS5MSV/ref=sr_1_4?keywords=Shirt&m=ATVPDKIKX0DER&qid=1568764253&refinements=p_6%3AATVPDKIKX0DER&rnid=2661622011&s=apparel&sr=1-4');
  
})