var fileChooser = document.createElement("input");
fileChooser.type = 'file';
fileChooser.style.margin = "0 0 0 -3000px";

fileChooser.addEventListener('change', function (evt) {
  var f = evt.target.files[0];
    
    var extension = f.name.split('.').pop().toLowerCase();
    
    
  if(f && extension == "json") {
    var reader = new FileReader();
    reader.onload = function(e) {
        
        
        
      var contents = e.target.result;
        
      var jsonObj = JSON.parse( contents );
        
       chrome.storage.local.set(
                    {
                        'imported_labels': jsonObj
                    }, function () {
                    
                       window.alert("Addresses Imported! You must re-open Tokenly Pockets."); 

         
                    });  
      
    }
    reader.readAsText(f);
  } else {
  
     window.alert("Error! You must import a valid JSON file."); 
  
  }
});

document.body.appendChild(fileChooser);

fileChooser.click();
