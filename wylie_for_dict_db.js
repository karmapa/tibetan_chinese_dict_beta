var input = "monlam_dict_entotb";

var fs = require("fs");
var wylie = require("./wylie");
var json = fs.readFileSync("./"+input+".json", "utf8");
var arr = [];
var wylieToTb = function (obj) {
	obj.entry = wylie.fromWylie(obj.entry);
	arr.push(obj);
}
JSON.parse(json).map(wylieToTb);
fs.writeFileSync("./"+input+"_wylie.json", JSON.stringify(arr, "", " "), "utf8");
//console.log(wylie.fromWylie("ka ca[亦作]ka cha"));