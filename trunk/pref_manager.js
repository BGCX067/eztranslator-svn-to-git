if (!ANPD)
  var ANPD = {};

ANPD.PrefManager = function(branch){
  // Initializes the preference service
  this.prefManager = Components.classes['@mozilla.org/preferences-service;1']
                               .getService(Components.interfaces.nsIPrefService)
                               .getBranch(branch);
}

/**********************
 * Preference getters *
 **********************/ 
ANPD.PrefManager.prototype.getString = function(name){
  try { return this.prefManager.getCharPref(name); }
  catch(e) { return null; }
}

ANPD.PrefManager.prototype.getInt = function(name){
  try { return this.prefManager.getIntPref(name); }
  catch(e) { return null; }
}

ANPD.PrefManager.prototype.getBool = function(name){
  try { return this.prefManager.getBoolPref(name); }
  catch(e) { return null; }
}

/**********************
 * Preference setters *
 **********************/ 
ANPD.PrefManager.prototype.setString = function(name, val){
  return this.prefManager.setCharPref(name, val);
}

ANPD.PrefManager.prototype.setInt = function(name, val){
  return this.prefManager.setIntPref(name, val);
}

ANPD.PrefManager.prototype.setBool = function(name, val){
  return this.prefManager.setBoolPref(name, val);
}

/**********************
 * Misc               *
 **********************/ 
ANPD.PrefManager.prototype.getDicArray = function(){
  var str = this.getString('dictionaries');
  return JSON.parse(str);
}

ANPD.PrefManager.prototype.setDicArray = function(arr){
  this.setString('dictionaries', JSON.stringify(arr));
}

ANPD.PrefManager.prototype.setDefaults = function(){
  if (confirm('Restore the default settings?')){
    var list = this.prefManager.getChildList('', {});
    for (var p in list){
      try{ this.prefManager.clearUserPref(p); }
      catch(e){}
    }
  }  
}

ANPD.PrefManager.prototype.getCurrentName = function(){  
  var arr = this.getDicArray();
  var index = this.getCurrentIndex();
  if (arr[index])
    return arr[index].name;
  else
    return 'Undefined';
}  

ANPD.PrefManager.prototype.getCurrentUrl = function(){  
  var arr = this.getDicArray();
  var index = this.getCurrentIndex();
  if (arr[index])
    return arr[index].url;
  else
    return ANPD.et.HOMEURL;
}  

ANPD.PrefManager.prototype.getCurrentIndex = function(){  
  return this.getInt('index');
}  

ANPD.PrefManager.prototype.setCurrentIndex = function(index){
  if (index < 0) index = 0;
  this.setInt('index', index);
}  

ANPD.PrefManager.prototype.add = function(name, url){
  var arr = this.getDicArray();
  arr.push({name : name, url : url});
  this.setDicArray(arr);
}

ANPD.PrefManager.prototype.removeAt = function(index){  
  var arr = this.getDicArray(); 
  arr.splice(index, 1);
  this.setDicArray(arr);
}

ANPD.PrefManager.prototype.swap = function(first, second){ 
  var arr = this.getDicArray();
  var temp = arr[first];
  arr[first] = arr[second];
  arr[second] = temp;
  this.setDicArray(arr);
}
