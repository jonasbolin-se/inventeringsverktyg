// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var service = new Checklist();
    service.initialize().done(function () {
        console.log("Service initialized");
        $(document).on('click', '.camera', this.changePicture);

    });

    /* --------------------------------- Event Registration -------------------------------- */


    /* ---------------------------------- Local Functions ---------------------------------- */
        
    this.changePicture = function(e) {
        alert("click on camera!");
        e.preventDefault();
        var file = e.target.files[0]
        var outputcontainer = "image" + e.target.id;;
        var imagename = e.target.value;
        imagename = imagename.split(/(\\|\/)/g).pop();
        
        if (!navigator.camera) {
            alert("Camera API not supported", "Error");
            return;
        }

        var options =   {   quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
            encodingType: 0     // 0=JPG 1=PNG
        };

        navigator.camera.getPicture( function(imgData) { return imgData; }, function() { alert('Error');}, options);
        //console.log(imageData);


        //var orientation;
        var outputname = e.target.id;
            // // MegaPixImage constructor accepts File/Blob object.
            // var mpImg = new MegaPixImage(file);
            // // Render resized image into image element using quality option.
            // // Quality option is valid when rendering into image element.
            // var resImg = document.getElementById(outputcontainer);
            // //get image orientation from EXIF library, then render image to 
            // EXIF.getData(file, function() {
            //     orientation = EXIF.getTag(this, "Orientation");
            //     mpImg.render(resImg, { maxWidth: 600, maxHeight: 600, quality: 0.9, orientation: orientation, output: outputname, imagename: imagename  });
            //     console.log("bildvinkel:" + orientation);
            // });
        //e.target.value = ""; //empty image input field after selecting image
    }

}());