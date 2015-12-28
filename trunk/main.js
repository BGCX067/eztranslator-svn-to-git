if (!ANPD)
  var ANPD = {};

ANPD.et = {};

(function (){
/**********************
 * Private Variables  *
 **********************/ 
  var HOMEURL = 'http://eztrns.appspot.com/dictionaries';
  var WORD = /^[^\s:\/\-@]+$/;
  var DBVERSION = 1;
  var et = ANPD.et;
  var tooltip = new ANPD.Tooltip();
  var prefManager = new ANPD.PrefManager('extensions.easytranslator.');

/**********************
 * Private Methods    *
 **********************/   
  function dump(atext){
      atext = ' ' + atext;
      var csClass = Components.classes['@mozilla.org/consoleservice;1'];
      var cs = csClass.getService(Components.interfaces.nsIConsoleService);
      cs.logStringMessage(atext);
  }
  
  function getElement(element){
    return document.getElementById('antonpod-et-' + element);
  }
  
  function word(txt){
    return (txt.search(WORD) >= 0)
  }
  
  function registerCSS(){
		var sss = Components.classes["@mozilla.org/content/style-sheet-service;1"]
                        .getService(Components.interfaces.nsIStyleSheetService);
		var ios = Components.classes["@mozilla.org/network/io-service;1"]
                        .getService(Components.interfaces.nsIIOService);
		var uri = ios.newURI("chrome://easyTranslator/skin/tooltip.css", null, null);
		sss.loadAndRegisterSheet(uri, sss.USER_SHEET);
  }
  
  function hideContextItems(){
    getElement('translate').hidden = true;
    getElement('choose').hidden = true;
    getElement('sep').hidden = true;
  }
  
  function translate(url){
			var txt = getBrowserSelection();
      txt = encodeURIComponent(txt);
      url = url.replace('*', txt);

      var tab = gBrowser.addTab(url);
      if (!prefManager.getBool('background'))
        gBrowser.selectedTab = tab;
	}

/**********************
 * Public Variables   *
 **********************/  
  et.HOMEURL = HOMEURL;
  et.tooltip = tooltip;
  et.prefManager = prefManager;
  
/**********************
 * Public Methods     *
 **********************/   
  et.translate = translate;

  et.onContextMenuShowing = function (event){
    if (prefManager.getBool('enabled')){   // If context menu integraion enabled
      var translate = getElement('translate');
      var choose = getElement('choose');
      var sep = getElement('sep');
      var txt = getBrowserSelection();
      if (txt){    // If some text was selected
        if (txt.length > 15)
          txt = txt.slice(0, 15) + '...';
        translate.label = 'Translate "' + txt + '" with ' + prefManager.getCurrentName();
        translate.url = prefManager.getCurrentUrl();
      } 
      var toInsert = (txt)? translate : choose;
      if (prefManager.getString('position') == 'top'){
        event.target.insertBefore(sep, event.target.firstElementChild);
        event.target.insertBefore(toInsert, sep);
      }  
      else{
        event.target.appendChild(sep);
        event.target.appendChild(toInsert);  
      }
      translate.hidden = (txt == '');
      choose.hidden = !translate.hidden;
      sep.hidden = false;
    } 
    else{
      hideContextItems();
		}		    
	}
  
  et.onContextMenu = function(event){
    translate(event.target.url);
  }
  
  et.onToolsMenu = function(){
		window.openDialog('chrome://easyTranslator/content/options.xul', '', 'resizable=no');
	}
  
  et.onMouseUp = function(event){
    if (!prefManager.getBool('tooltip') || event.target instanceof XULElement || event.which != 1)
      return;
      
    var txt = getBrowserSelection();
    if (word(txt))
      tooltip.create(event.pageX, event.pageY);
  }
  
  et.onMouseDown = function(event){
    tooltip.remove();
  }
  
  et.onKeyPress = function(event){
    if (event.altKey && event.which == 96){   // Alt + ~
      window.openDialog('chrome://easyTranslator/content/quick.xul', '', 'modal=yes,resizable=no,centerscreen=yes');
    }
  }
  
  et.onSubmenuShowing = function(event){
    event.stopPropagation();      // Prevent the context menu 'popupshowing' event from firing again
    var choose = getElement('submenu');
    var arr = prefManager.getDicArray();
    
    while (choose.hasChildNodes()){   // Delete all entries
      choose.removeChild(choose.firstChild);
    }
    
    if (arr.length > 0){    // If there are dictionaries defined
      for (var i = 0; i < arr.length; i++){
        var item = document.createElement('menuitem');
        item.setAttribute('label', arr[i].name);
        item.setAttribute('value', i);
        item.setAttribute('type', 'radio');
        choose.appendChild(item);
      }
      var index = prefManager.getCurrentIndex();
      choose.childNodes[index].setAttribute('checked', true);
    }
    else{
      var item = document.createElement('menuitem');
      item.setAttribute('label', 'Click to add a dictionary');
      item.addEventListener('click', function() { et.onToolsMenu() }, false); 
      choose.appendChild(item);
    }
  }
  
  et.onSubmenu = function(event){
    prefManager.setCurrentIndex(event.target.value);
  }
  
  et.init = function(){
    var menu = document.getElementById('contentAreaContextMenu');
    menu.addEventListener('popupshowing', ANPD.et.onContextMenuShowing, false);
    window.addEventListener('mouseup', ANPD.et.onMouseUp, false);
    window.addEventListener('mousedown', ANPD.et.onMouseDown, false);
    window.addEventListener('keypress', ANPD.et.onKeyPress, false);
    registerCSS();
    rebuildDatabase();
  }
  
  function rebuildDatabase(){
    var version = prefManager.getInt('databaseversion');
    if (version && version == DBVERSION)
      return;
      
    var position = prefManager.getString('position');
    if (!(position in ['top', 'bottom'])){
      if (position)
        prefManager.setString('position', 'top');
      else
        prefManager.setString('position', 'bottom');
    }
    
    var dics = prefManager.getString('dics').split('#');
    var urls = prefManager.getString('urls').split('#');
    var arr = [];
    for (var i = 0; i < dics.length; i++){
      arr.push( { name : dics[i], url : urls[i] } );
    }
    prefManager.setDicArray(arr);
    prefManager.setInt('databaseversion', DBVERSION);
  }
})();

window.addEventListener('load', ANPD.et.init, false);
