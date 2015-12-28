if (!ANPD)
  var ANPD = {};

ANPD.Tooltip = function(){
  this.TIMEOUT = 1000;
  this.tID = -1;
  this.DEFCOLOR = '#d1f59f';
  this.TEXTCOLOR = '#dbdeeb';
}

ANPD.Tooltip.prototype.create = function(x, y){
  if (content.document.getElementById('et-tooltip'))
    return;

  var tooltip = content.document.createElement('div');
  tooltip.id = 'et-tooltip';
  tooltip.style.left = x + 'px';
  tooltip.style.top = (y + 15) + 'px';
  tooltip.appendChild(this.getList());
  
  tooltip.addEventListener('mousedown', this.onTooltipDown, false);
  tooltip.addEventListener('mouseup',  this.onTooltipUp, false);
  tooltip.addEventListener('mouseover', this.onTooltipOver, false);
  tooltip.addEventListener('mouseout', this.onTooltipOut, false);
  tooltip.addEventListener('DOMMouseScroll', this.onTooltipScroll, false);
  
  
  content.document.body.appendChild(tooltip);
  window.clearTimeout(this.tID);
  this.tID = window.setTimeout(ANPD.et.tooltip.remove, this.TIMEOUT);
}

ANPD.Tooltip.prototype.remove = function(){
  var tooltip = content.document.getElementById('et-tooltip');
  if (tooltip){
    tooltip.removeEventListener('mousedown', this.onTooltipDown, false);
    tooltip.removeEventListener('mouseup', this.onTooltipUp, false);
    tooltip.removeEventListener('mouseover', this.onTooltipOver, false);
    tooltip.removeEventListener('mouseout', this.onTooltipOut, false);
    tooltip.removeEventListener('DOMMouseScroll', this.onTooltipScroll, false);
    tooltip.parentNode.removeChild(tooltip);
  }  
}

ANPD.Tooltip.prototype.getList = function(){
  var prefManager = ANPD.et.prefManager;
  var arr = prefManager.getDicArray();
  var maxentries = prefManager.getInt('maxentries');
  var total = arr.length;
    
  var ul = content.document.createElement('ul');
  ul.id = 'et-tooltip-list';
  
  if (total > 0){
    if (maxentries == 0)
      maxentries = total;
    maxentries = Math.min(maxentries, total);
    var current = prefManager.getCurrentIndex();
    var i = Math.min(current, total - maxentries);
    var last = i + maxentries;

    for (i; i < last; i++){
      var li = this.createLi(i, arr[i].name, arr[i].url)
      if (i == current){
        li.style.color = this.DEFCOLOR;
        li.style.fontWeight = 'bold';
      }  
      ul.appendChild(li);
    } 
  } 
  else{
    var li = this.createLi(-1, 'Click for dictionaries list', ANPD.et.HOMEURL)
    ul.appendChild(li);
  }
  return ul;
}

ANPD.Tooltip.prototype.createLi = function(i, name, url){
  var li = content.document.createElement('li');
  li.id = i;
  li.setAttribute('url', url);
  li.innerHTML = (i + 1) + '. ' + name;
  return li;
}

ANPD.Tooltip.prototype.onTooltipDown = function(event){
  event.stopPropagation();
}

ANPD.Tooltip.prototype.onTooltipUp = function(event){
  event.stopPropagation();
  var url = event.originalTarget.getAttribute('url');
  ANPD.et.tooltip.remove();
  ANPD.et.translate(url);
}

ANPD.Tooltip.prototype.onTooltipOver = function(event){
  window.clearTimeout(ANPD.et.tooltip.tID);
}

ANPD.Tooltip.prototype.onTooltipOut = function(event){
  ANPD.et.tooltip.tID = window.setTimeout(ANPD.et.tooltip.remove, ANPD.et.tooltip.TIMEOUT);
}

ANPD.Tooltip.prototype.onTooltipScroll = function(event){
  event.preventDefault();
  var ET = ANPD.et;
  var prefManager = ET.prefManager;
  var up = (event.detail > 0);
  
  var list = content.document.getElementById('et-tooltip-list');
  var arr = prefManager.getDicArray();
  var firstIndex = parseInt(list.firstElementChild.id);
  var lastIndex = parseInt(list.lastElementChild.id);
  var child = null;
  var index;
  
  if (up & (lastIndex + 1 < arr.length)){
    child = list.removeChild(list.firstElementChild);
    index = lastIndex + 1;
    list.appendChild(child);
  }
  if (!up & firstIndex > 0){
    child = list.removeChild(list.lastElementChild);
    index = firstIndex - 1;
    list.insertBefore(child, list.firstElementChild);
  }
  if(child != null){
    child.id = index;
    child.setAttribute('url', arr[index].url);
    child.innerHTML = (index + 1) + '. ' + arr[index].name;
    var current = prefManager.getCurrentIndex();
    child.style.color = (current == index)? ET.tooltip.DEFCOLOR : ET.tooltip.TEXTCOLOR;
    child.style.fontWeight = (current == index)? 'bold' : '';
  }
}