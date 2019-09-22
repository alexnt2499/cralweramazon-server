var Crawler = require("crawler");
const BASE_URL = 'https://www.amazon.com';
module.exports = function (req,res,next) {
    try {
      const {keyword,page} = req.query;
      let array2 = [];
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
            
           
            console.log(arrayList.length);
            
            if(arrayList.length > 2)
            {
              for (let index = 0; index < arrayList.length-2; index++) {
                const element = arrayList[index];
                
                array2.push(BASE_URL + element.attribs.href);
                
      
              }
            }else {
              for (let index = 0; index < arrayList.length-1; index++) {
                const element = arrayList[index];
                
                array2.push(BASE_URL + element.attribs.href);
                
      
              }
            }

            req.data = array2;
           
            next();
            
          }
    
          done();
          
        }
      });
    
    c.queue(`https://www.amazon.com/s?k=${keyword}&i=fashion&bbn=7141123011&rh=p_6%3AATVPDKIKX0DER&dc&page=${page}`);


    } catch (error) {
      res.json({msg : 'Gửi yêu cầu đến server thất bại vui lòng thử lại',status : 204});
    }
}