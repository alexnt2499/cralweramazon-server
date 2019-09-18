var Crawler = require("crawler");
const BASE_URL = 'https://www.amazon.com';
module.exports = function (req,res,next) {
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
            let arrayList = $(".a-size-base.a-link-normal");
            let array2 = [];
            for (let index = 0; index < arrayList.length; index++) {
              const element = arrayList[index];
              array2.push(BASE_URL + element.attribs.href);
    
    
            }
            req.data = array2;
            next();
          }
    
          done();
          
        }
      });
    
    c.queue('https://www.amazon.com/s?k=pant&i=fashion-novelty&bbn=7147445011&rh=p_6%3AATVPDKIKX0DER&dc&qid=1568619049&rnid=2661622011&ref=sr_nr_p_6_1');
}