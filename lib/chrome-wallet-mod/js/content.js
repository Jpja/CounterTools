var urlAndQs = window.document.URL.split("?");
var newurl = "glideraRegister.html";
if( urlAndQs.length >= 2) {
  newurl += "?" + urlAndQs[1];
}
chrome.extension.sendMessage({redirect: newurl});
chrome.extension.onMessage.addListener(function(request, sender) {
  chrome.tabs.update(sender.tab.id, {url: request.redirect});
});