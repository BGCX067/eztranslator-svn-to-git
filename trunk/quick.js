function onAccept(){
  var url = window.opener.ANPD.et.prefManager.getCurrentUrl();
  var txt = document.getElementById('antonpod-et-quick-textbox').value;
 
  if (txt && url){
    url = url.replace('*', txt);
    window.opener.gBrowser.selectedTab = window.opener.gBrowser.addTab(url);
  }  
  return true;
}