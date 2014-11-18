$(function() {


        //console.log(url);
        var url = "{{ form_id }}";
        $.get( "/getform/" + url, function( data ) {
            form = data;
            $("#myform").dform(form);
        });
        /*
        var url = window.location.pathname;
        var numberPattern = /\d+/g;
        form_id = url.match(numberPattern);
        console.log(form_id[0]);
        */
        
        $(document).on("click",".image_file > input",function(){
            console.log("file!")
            elmId = $(this).attr('id');
            console.log(elmId);
        });
        

        /*
        $.dform.addType('textarea', function(options) { 
            return $(this).wrap('<div >').attr('data-mini','true').parent(); 
        });
        */

    	$.dform.addType("h2", function(options) {
            // Return a new button element that has all options that
            // don't have a registered subscriber as attributes
            return $("<h2>").dform('attr', options);
        });

    	$.dform.addType('mobile-text', function(options) { 
            return $('<div>').attr('data-role', 'fieldcontain'); 
		});

		$.dform.addType('text', function(options) { 
            return $(this).wrap('<div >').attr('data-mini','true').parent(); 
        });

        $.dform.addType('file', function(options) { 
            return $(this).wrap('<div >').attr('data-mini','true').parent(); 
        }); 

        $.mobile.page("#myform", {transition: "none"});  
        $.mobile.activePage.trigger('create'); 






    });