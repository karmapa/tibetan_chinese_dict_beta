var inputfile = "./json_not_done/gugu.json";
var source = "gugu";
var writeFileName = "gugu_dict.json";


var fs = require("fs");
var json = fs.readFileSync(inputfile,"utf8");
var fetchDetails = function(arr) {
	var term = [];
	var tdef = [];
	var dict_arr = [];
	for(var i = 0; i < arr.length; i++) {
		var str = JSON.stringify(arr[i]);
		str.replace(/"title":"(.*?)"/g,function(a, title) {
			term = title;
		});
		str.replace(/"def":"(.*?)"/g,function(a, def) {
			tdef = def;
		});
		dict_arr.push([term, tdef]);
	}
//	console.log(dict_arr);
	return dict_arr;

}

var build_cdef_obj=function(arr){
// cdef_obj = {page:"", entry:"", tdefinition:"", cdefinition:{cdef:"", abbreviations:[], synonyms:[], note:""}}
	var newjson = [];
	for (i = 0;i < arr.length;i++){
		var cdef_obj = {}, cdef = {}, abrr_arr = [], syn_arr = [];
		cdef_obj["page"] = ""; cdef_obj["entry"] = arr[i][0]; cdef_obj["tdefinition"] = arr[i][1];
		cdef["cdef"] = "";
		abrr_arr.push(""); abrr_arr.push(""); abrr_arr.push("");
		syn_arr.push(""); syn_arr.push(""); syn_arr.push("");
		cdef["abbreviations"] = abrr_arr;
		cdef["synonyms"] = syn_arr;
		cdef["note"]=source;
		cdef_obj["cdefinition"] = cdef; newjson.push(cdef_obj);
	}
	return newjson;
};

var build_tdef_obj = function(json){
// tdef_obj = {page:"", entry:"", tdefinition:{tdef:"",cdefinitions:[{cdef:"", abbreviations:[], synonyms:[], note:""}, {cdef:"", abbreviations:[!=="增"], synonyms:[], note:""}]}}
	var newjson = []; tdef_obj={}, tdef={}, cdefinitions=[];
	for (i=0;i<json.length;i++){
		if ( !tdef_obj["page"]) tdef_obj["page"]=json[i].page; 
		if ( !tdef_obj["entry"]) tdef_obj["entry"]=json[i].entry;
		if ( !tdef["tdef"]) tdef["tdef"]=json[i].tdefinition; 
		cdefinitions.push(json[i].cdefinition);
		if ((json[i+1] && json[i+1].entry !== "") || (json[i+1] && json[i+1].tdefinition !== "") || (json[i+1] && json[i+1].cdefinition.abbreviations.indexOf("增") !== -1) || !json[i+1] ){
			tdef["cdefinitions"] = cdefinitions; tdef_obj["tdefinition"]=tdef; newjson.push(tdef_obj); cdefinitions=[]; tdef={}; tdef_obj={};
		}
	}
	return newjson;
}

var build_entry_obj =function(json){
	var newjson=[]; entry_obj={}; tdefinitions=[];
	for(i=0;i<json.length;i++){
		if ( !entry_obj["page"]) entry_obj["page"]=json[i].page; 
		if ( !entry_obj["entry"]) entry_obj["entry"]=json[i].entry;
		tdefinitions.push(json[i].tdefinition);
		if ((json[i+1] && json[i+1].entry !== "") || !json[i+1]){
			entry_obj["tdefinitions"]=tdefinitions; newjson.push(entry_obj); tdefinitions = []; entry_obj={};
		}
	}
	return newjson;
}


var  dict_arr = fetchDetails(JSON.parse(json));
//console.log(dict_arr);
var out1 = build_cdef_obj(dict_arr);
var out2 = build_tdef_obj(out1);
var output = build_entry_obj(out2);
fs.writeFileSync(writeFileName, JSON.stringify(output, "", " "), "utf8");