const URL = /^http:\/\/.+\/[^\*]*\*[^\*]*$/;
var ANPD = window.opener.ANPD || window.opener.opener.ANPD;
var prefManager = new ANPD.PrefManager('extensions.easytranslator.');

/**********************
 * Event Handlers     *
 **********************/ 
function onPrefpaneLoad(){
  getElement('enable').doCommand();
  getElement('tooltip').doCommand();
  getElement('anpd-moveup').disabled = getElement('anpd-movedown').disabled = true;
  disableDelete(true);
}

function onAdd(){
  var prefwindow = getElement('preferences');
  prefwindow.openSubDialog('chrome://easyTranslator/content/options_add.xul');
}

function onDelete(event){
 	var selectedIndex = treeView.selection.currentIndex;
  if (selectedIndex < 0)    // Tree isn't focused
    return;
  prefManager.removeAt(selectedIndex);
  var mainIndex = prefManager.getCurrentIndex();
  if (selectedIndex <= mainIndex)
    prefManager.setCurrentIndex(mainIndex - 1);
  treeView.treebox.rowCountChanged(selectedIndex, -1);
  treeView.rowCount--;
  if (treeView.rowCount == 0)
    disableDelete(true);
}

function onMoveUp(){
  var index = treeView.selection.currentIndex;
  if (index < 0)    // Tree isn't focused
    return;   
  prefManager.swap(index, index - 1);
  treeView.selection.select(index - 1);
  current = prefManager.getCurrentIndex();
  if (current == index) prefManager.setCurrentIndex(current - 1);
  else if (current == index - 1) prefManager.setCurrentIndex(current + 1);
}

function onMoveDown(){
  var index = treeView.selection.currentIndex;
  if (index < 0)    // Tree isn't focused
    return;   
  prefManager.swap(index, index + 1);
  treeView.selection.select(index + 1);
  current = prefManager.getCurrentIndex();
  if (current == index) prefManager.setCurrentIndex(current + 1);
  else if (current == index + 1) prefManager.setCurrentIndex(current - 1);
}

function onSelect(){
  disableDelete(false);
  var index = treeView.selection.currentIndex;
  getElement('anpd-moveup').disabled = (index == 0);
  getElement('anpd-movedown').disabled = (index == treeView.rowCount - 1)
}
	
function onEnable(event){
  getElement('enbr').setAttribute('disabled', !event.target.checked);
}

function onTooltip(event){
  getElement('maxentries-label').disabled = !event.target.checked;
  getElement('maxentries-textbox').disabled = !event.target.checked;
}
  
function onGetDictionaries(){
  window.opener.gBrowser.selectedTab = window.opener.gBrowser.addTab(ANPD.et.HOMEURL);
  return true;
}  

/**********************
 * Misc Methods       *
 **********************/ 
function disableDelete(val){
  var del = getElement('delete');
  del.disabled = val;
  var img = (val)? 'chrome://easyTranslator/skin/delete_disabled.png' : 
                   'chrome://easyTranslator/skin/delete.png';
  del.image = img;
}
  
function getElement(element){
  return document.getElementById(element);
}