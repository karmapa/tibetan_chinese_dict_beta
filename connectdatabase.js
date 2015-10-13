var terms=JSON.parse(localStorage.getItem('terms'));

var saveEdited=function(obj,p){
	db.child(p).set(obj);
	terms[p]=obj;
}

var saveNewEntry=function(obj,p){
	console.log(obj,p);
	var entry={};
	entry[p]=obj;
	db.update(entry);
	terms[p]=obj;
}