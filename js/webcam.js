function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
}

function saveBase64AsFile(base64, fileName) {

  var link = document.createElement("a");

  link.setAttribute("href", base64);
  link.setAttribute("download", fileName);
  link.click();
  setTimeout(checkIfRankNeededAndAndAddRank, 2500);
}


localstream = null;
captureButton = document.getElementById('capture');
player = document.getElementById('vid');
errorDiv = document.getElementById('error');

document.getElementById('title').innerText = chrome.i18n.getMessage("seconds_title")
document.getElementById('proccesing').innerText = chrome.i18n.getMessage("recording")
errorDiv.innerText = chrome.i18n.getMessage("error")
h2 = document.getElementById('h2');
h2.innerText = chrome.i18n.getMessage("h2_title");
captureButton.innerText = chrome.i18n.getMessage("start_now");
if (navigator.webkitGetUserMedia!=null) {

    var options = { 
        video:true, 
        audio:false 
    };  
    navigator.webkitGetUserMedia(options, 
        function(stream) { 
            vid.src = window.webkitURL.createObjectURL(stream);
            localstream = stream;
            vid.play();
            //console.log("streaming");
        }, 
        function(e) { 
          errorDiv.classList.add('visible');
        }); 
} 
 captureButton.addEventListener('click', () => {
    // Draw the video frame to the canvas.
    document.getElementById('proccesing').classList.add('visible');
    gifshot.createGIF({
        numFrames : document.getElementById('seconds').value * 10
    }, function(obj) {
        document.getElementById('proccesing').classList.remove('visible');
      if(!obj.error) {
        //console.log(obj);
        var image = obj.image,
            imgBlob = b64toBlob(image.split(',')[1],'image/gif');
        url = URL.createObjectURL(imgBlob);
        saveBase64AsFile(url ,getfilenameByExtention('gif'));
        // animatedImage = document.createElement('img');
        // animatedImage.src = image;
        // document.body.appendChild(animatedImage);
      }
    });
    // context.drawImage(player, 0, 0, canvas.width, canvas.height);
    // canvas.toBlob(function(blob){
    //         url = URL.createObjectURL(blob);
    //     chrome.downloads.download({
    //       url: url 
    //     });

    // },'image/png');

  });

  function getfilenameByExtention(ext){
    var now = new Date(),
        month = now.getMonth() + 1,
        day = now.getDate(),
        year = now.getFullYear(),
        seconds = now.getSeconds(),
        minutes = now.getMinutes(),
        hour = now.getHours(),
        filename = chrome.runtime.getManifest().name + '--' + [day,month,year].join('-') + '--' +[hour,minutes,seconds].join('-');
        filename = filename.replace(/(\s|\t)+/g,'-').toLocaleLowerCase() + '.' + ext;
    return filename;
  }