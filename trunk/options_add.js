win = window.opener;

function onAddAccept(){	
	var newDic = document.getElementById('add-dic').value;
	var newUrl = document.getElementById('add-url').value;

	if (verifyURL(newUrl)){		
    win.prefManager.add(newDic, newUrl);
    win.treeView.treebox.rowCountChanged(win.treeView.rowCount, 1);
    win.treeView.rowCount++;
    return true;
	}	
  return false;		
}

function verifyURL(url){
  if (url.search(win.URL) < 0){
		errorMessage('Specify a valid url, e.g. http://www.d.com/s?txt=*');
		return false;	
  }
  return true;
}

function errorMessage(txt){
  document.getElementById('error').label = txt;
}