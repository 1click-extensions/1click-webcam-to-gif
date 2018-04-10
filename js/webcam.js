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
localstream = null;
captureButton = document.getElementById('capture');
player = document.getElementById('vid');

document.getElementById('title').innerText = chrome.i18n.getMessage("seconds_title")
document.getElementById('proccesing').innerText = chrome.i18n.getMessage("recording")

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
        console.log("background error : " + e);
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
        chrome.downloads.download({
          url: url 
        });
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