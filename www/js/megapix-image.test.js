

/*
function resizeImage(inputfile, outputcontainer, outputname) {
    document.getElementById(inputfile).onchange = function(e) {
        var file = e.target.files[0]
        var imagename = e.target.value;
        imagename = imagename.split(/(\\|\/)/g).pop();
        var orientation;
        console.log("fil som ska laddas upp:" + inputfile);
        // MegaPixImage constructor accepts File/Blob object.
        var mpImg = new MegaPixImage(file);
        // Render resized image into image element using quality option.
        // Quality option is valid when rendering into image element.
        var resImg = document.getElementById(outputcontainer);
        //get image orientation from EXIF library, then render image to 
        EXIF.getData(file, function() {
            orientation = EXIF.getTag(this, "Orientation");
            mpImg.render(resImg, { maxWidth: 400, maxHeight: 400, quality: 0.5, orientation: orientation, output: outputname, imagename: imagename  });
            console.log("bildvinkel:" + orientation);

        });

        e.target.value = ""; //empty image input field after selecting image
    };

}


window.onload = function() {
    resizeImage('fileinput1','outputImage1','1');
    resizeImage('fileinput2','outputImage2','2');
    resizeImage('fileinput3','outputImage3','3');
    resizeImage('fileinput4','outputImage4','4');
    resizeImage('fileinput5','outputImage5','5');

    
    document.getElementById('fileinput5').onchange = function(e) {
        var file = e.target.files[0]
        var orientation;
        // MegaPixImage constructor accepts File/Blob object.
        var mpImg = new MegaPixImage(file);

        // Render resized image into image element using quality option.
        // Quality option is valid when rendering into image element.
        var resImg = document.getElementById('outputImage5');
        //get image orientation from EXIF library, then render image to 
        EXIF.getData(file, function() {
            orientation = EXIF.getTag(this, "Orientation");
            mpImg.render(resImg, { maxWidth: 500, maxHeight: 500, quality: 0.5, orientation: orientation });
            console.log(orientation);

        });
    }; 
    
  
};

*/
