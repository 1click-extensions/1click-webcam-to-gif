chrome.runtime.setUninstallURL("https://1ce.org");

if (!localStorage.created) {
  chrome.tabs.create({ url: "https://1ce.org" });
  var manifest = chrome.runtime.getManifest();
  localStorage.ver = manifest.version;
  localStorage.created = 1;
}
//console.log(chrome.browserAction.onClicked);
chrome.browserAction.onClicked.addListener(function(tab){
  //console.log('clicke');
  chrome.tabs.create({"url" : chrome.runtime.getURL('pages/capture.html')});  
 });
