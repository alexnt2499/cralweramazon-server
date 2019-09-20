const cutStringRank = (string) => {
    let dem = 0;
    let arrayString = string.split('');
    let newString = '';
    arrayString.forEach((element,index) => {
          if(element === " ")
          {
            dem = dem + 1;;
          }
          if(dem === 5)
          {
            let newString1 = string.substring(string.indexOf("#"),index-2);
            newString = newString1.replace('#',"").replace(/,/g,"");
          }
      });
    return newString;
}

const cutStringDate = (string) => {
  
  let newString = '';
  let lengthString  = 'Date first listed on Amazon:';
  newString = string.substring(string.indexOf('Date first listed on Amazon:')+lengthString.length,string.length).trim()
  return newString;
}

const cutURLpng = (URL_Origin) => {
      let URL_END = URL_Origin.substring(0,URL_Origin.indexOf('png')+3);
        let URL_END2 = URL_END.substring(URL_END.lastIndexOf('7C')+2,URL_END.length);
        let URL_END3 = URL_END.substring(0,URL_END.lastIndexOf('/')+1);

        let URL_Result = URL_END3 + URL_END2;

        return URL_Result;
}


module.exports = {cutStringRank,cutStringDate,cutURLpng};