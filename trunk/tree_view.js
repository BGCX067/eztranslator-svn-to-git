var treeView = {
  rowCount : prefManager.getDicArray().length,
  
  getCellText : function(row, column){
    var arr = prefManager.getDicArray();
    return arr[row][column.id];  
  },
  
  getCellValue : function(row, column){
    return (prefManager.getCurrentIndex() == row);
  },
  
  setCellText : function(row, column, value){
    var arr = prefManager.getDicArray();
    arr[row][column.id] = value;
    prefManager.setDicArray(arr);
  },
  
  setCellValue : function(row, column, value){
    prefManager.setCurrentIndex(row);
  },
  
  setTree: function(treebox){ this.treebox = treebox; },
  isContainer: function(row){ return false; },
  isSeparator: function(row){ return false; },
  isSorted: function(){ return false; },
  isEditable : function(){ return true; },
  getLevel: function(row){ return 0; },
  getImageSrc: function(row,col){ return null; },
  getRowProperties: function(row,props){},
  getCellProperties: function(row,col,props){},
  getColumnProperties: function(colid,col,props){},
  setView : function(){ getElement('anpd-tree').view = this; }
}

window.addEventListener('load', function(){ treeView.setView(); }, false);

