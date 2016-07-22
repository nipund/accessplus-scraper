var Nightmare = require('nightmare');
var fs = require("fs");

var ap = Nightmare({
    show: true
  });
    ap
    .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
    .goto('https://accessplus.iastate.edu')
    .cookies.clear()
    .goto('https://accessplus.iastate.edu/frontdoor/login.jsp')
    .wait()
    .insert('#loginid', '') // ISU ID
    .insert('#pinpass', '') // PASSWORD
    .click('input[value="Login"]')
    .wait(500)
    .goto('https://accessplus.iastate.edu/servlet/adp.A_Plus?A_Plus_action=/student.jsp&MenuOption=')
    .wait(500)
    .goto('https://accessplus.iastate.edu/servlet/adp.A_Plus?A_Plus_action=/FA11/FA11.jsp&SYSTEM=FA11&SUBSYS=003&SYSCODE=FA11&MenuOption=27')
    .inject('js', 'jquery-3.1.0.min.js')
    .evaluate(function() {
      var cats = [];
      jQuery("#browse table tr").each(function(i){
        if(i > 1){
          var el = jQuery(this).find("td");
          cats.push({'cat': el[0].innerText.trim(), 'num': parseInt(el[1].innerText.trim())});
        }
      })
      return cats;
    })
    .end()
    .then(function(result) {
      //console.log(result);
      var old_f = fs.readFileSync("cache.json");
      var old = JSON.parse(old_f);
      fs.writeFileSync("cache.json", JSON.stringify(result), function(err) {
        if(err) {
          return console.log(err);
        }
      });
      old.forEach(function(obj, i) {
        if(obj['num'] < result[i]['num']) {
          console.log('New job posted in ' + obj['cat']);
        }
      });
      console.log('Done!');
    });
