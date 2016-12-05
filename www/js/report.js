var button = document.createElement("div");
button.className = 'mandolapp-report-widget';
var content = document.createTextNode("+");
button.appendChild(content);
document.getElementsByTagName("body")[0].appendChild(button);

document.getElementsByClassName("mandolapp-report-widget")[0].addEventListener('touchstart', reporterStatusUpdate);

function reporterStatusUpdate(){
  if (window.getSelection) {
    selection = window.getSelection();
  } else if (document.selection) {
    selection = document.selection.createRange();
  }

  localStorage.setItem('annotatedText', selection);
}
