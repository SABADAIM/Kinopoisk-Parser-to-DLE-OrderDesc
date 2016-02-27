var kinopoisk = require('kinopoisk-ru');
var dateFormat = require('dateformat');
var request = require('request');
var htmlspecialchars = require('htmlspecialchars');
var mysql      = require('mysql');
var fs = require('fs');
var filekpid = 'kpid.txt';
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'user',
  password : 'pass',
  database : 'db'
});



kinopoisk.login('login', 'password', function(err, loginData){
	var options = {
		loginData: loginData,
		id: false,
		title: true,
		alternativeTitle: true,
		year: true
	};

	function kppars(id) {
	kinopoisk.getById(id, options, function(err, film){
		if(err){
			console.error(err.message);
		}else{
			title = htmlspecialchars(film.title);
			alternativeTitle = htmlspecialchars(film.alternativeTitle);
			year = htmlspecialchars(film.year);
			var now = new Date();
			var time = dateFormat(now, "yyyy-mm-dd HH:MM:ss");
			console.log('Add film to db. KP ID:' + id);
			connection.query("INSERT INTO fm_orderdesc (title,orig_title,descr,category,autor,date,year) VALUES ('"+title+"','"+alternativeTitle+"','','1','','"+time+"','"+year+"')", function(err, rows, fields) {
			  if (err) throw err;
				});
			}
		});
	}
	if (fs.existsSync(filekpid)){
	    var i = parseInt(fs.readFileSync(filekpid));
	    var parse = setInterval(function () {
			i=i+1;
			kppars(i);
				fs.writeFile(filekpid,i,function(err) {
				    if(err) console.log(err);
				});
		}, 1000);
	}else{
		fs.writeFile(filekpid,499,function(err) {
		    if(err) console.log(err);
		});
		console.log('File created. Please restart script')
	}
})