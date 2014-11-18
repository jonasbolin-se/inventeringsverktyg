var max_width = 400;
var max_height = 400;
var form = document.getElementById('form');

var Liip = Liip || {};
Liip.resizer = (function ($) {
    var mainCanvas;

    var init = function () {
        $("#resize").click(startResize);
    };

    /* 
     * Creates a new image object from the src
     * Uses the deferred pattern
     */
    var createImage = function (src) {
        var deferred = $.Deferred();
        var img = new Image();

        img.onload = function() {
            deferred.resolve(img);
        };
        img.src = src;
        return deferred.promise();
    };

    function inputToURL(inputElement) {
        var file = inputElement.files[0];
        return window.webkitURL.createObjectURL(file);
    }

    /* 
     * Create an Image, when loaded pass it on to the resizer
     */
    var startResize = function () {
        var url = inputToURL(document.getElementById('fileinput'));
        $.when(
            createImage(url)
            ).then(resize, function () {console.log('error')});
    };
    //convert audio file to base64, store in hidden input field.
    $("#convertaudio").click(function(){
      console.log("clicked!");
      var url = inputToURL(document.getElementById('audioinput'));
      console.log(url);
      encodedAudio = window.btoa(url);
      var newinput = document.createElement("input");
      newinput.type = 'hidden';
      newinput.name = 'file';
      newinput.id = 'audiodata';
      newinput.value = encodedAudio; // put result from canvas into new hidden input
      form.appendChild(newinput);
      fileinput = document.getElementById('audioinput')
      fileinput.value = "";

    });



    /*
     * Draw the image object on a new canvas and half the size of the canvas
     * until the darget size has been reached
     * Afterwards put the base64 data into the target image
     */
    var resize = function (image) {
        mainCanvas = document.createElement("canvas");
        console.log(image.height);
        console.log(image.width);
        console.log(image.name);
          var width = image.width;
          var height = image.height;

          // calculate the width and height, constraining the proportions
          if (width > height) {
            if (width > max_width) {
              //height *= max_width / width;
              height = Math.round(height *= max_width / width);
              width = max_width;
            }
          } else {
            if (height > max_height) {
              //width *= max_height / height;
              width = Math.round(width *= max_height / height);
              height = max_height;
            }
          }

        mainCanvas.width = width;
        mainCanvas.height = height;
        var ctx = mainCanvas.getContext("2d");
        ctx.drawImage(image, 0, 0, mainCanvas.width, mainCanvas.height);

        var resized = mainCanvas.toDataURL("image/jpeg",0.2);
        $('#outputImage').attr('src', resized);
        var newinput = document.createElement("input");
        newinput.type = 'hidden';
        newinput.name = 'file';
        newinput.id = 'imagedata';
        newinput.value = resized; // put result from canvas into new hidden input
        form.appendChild(newinput);
        fileinput = document.getElementById('fileinput')
        fileinput.value = "";
        
        $("#imageinfo").html("Image uploaded!");

    };


    return {
        init: init
    };

})(jQuery);

jQuery(function($) {
    Liip.resizer.init();
});