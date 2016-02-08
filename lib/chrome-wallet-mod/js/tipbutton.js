//var address = $(".companion-tip-address").text();

var iconpathicon = chrome.extension.getURL('pockets-48.png');
var iconpathblue = chrome.extension.getURL('images/paywithpockets-blue.png');
var iconpathyellow = chrome.extension.getURL('images/paywithpockets-yellow.png');
var iconpathgreen = chrome.extension.getURL('images/paywithpockets-green.png');
var tipsplash = chrome.extension.getURL('tipsplash.html');

//$('.pockets-url').html(tipsplash);
//$('.pockets-image').html(iconpathblue);
//$('.pockets-image-blue').html(iconpathblue);
//$('.pockets-image-yellow').html(iconpathyellow);
//$('.pockets-image-green').html(iconpathgreen);
//$('.pockets-image-icon').html(iconpathicon);
//
//$('.pockets-payment-button').each(function(i, obj) {
//    
//    var buttoncolor = $(this).attr("data-color");
//
//    if (buttoncolor == "yellow") {
//        var iconcolor = "yellow";
//        var iconwidth = 160;
//        iconpath = chrome.extension.getURL('images/paywithpockets-'+iconcolor+'.png');
//    } else if (buttoncolor == "green") {
//        var iconcolor = "green";
//        var iconwidth = 160;
//        iconpath = chrome.extension.getURL('images/paywithpockets-'+iconcolor+'.png');
//    } else if (buttoncolor == "icon") {
//        var iconcolor = "icon";
//        var iconwidth = 24;
//        iconpath = chrome.extension.getURL('pockets-48.png');    
//    } else {
//        var iconcolor = "blue";
//        var iconwidth = 160;
//        iconpath = chrome.extension.getURL('images/paywithpockets-'+iconcolor+'.png');
//    } 
//    
//    var address = $(this).attr("data-address");
//    var label = $(this).attr("data-label");
////    var isxcp = $(this).attr("data-isxcp");
//    var tokens = $(this).attr("data-tokens");
//    var amount = $(this).attr("data-amount");
//    
//    var labelurl = encodeURIComponent(label).replace(/[!'()*]/g, escape);
//    var tokensurl = encodeURIComponent(tokens);
//    
//    var tipbutton = "<div style='display: inline-block; padding: 5px;'><a href='"+tipsplash+"?address="+address+"&label="+labelurl+"&tokens="+tokensurl+"&amount="+amount+"' target='_blank'><img src='"+iconpath+"' width='"+iconwidth+"'></a></div>";
//    
//    //"&isxcp="+isxcp+
//
//    $(this).html(tipbutton);
//    
//});




