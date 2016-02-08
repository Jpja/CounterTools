//var address = $(".companion-tip-address").text();

var iconpath = chrome.extension.getURL('pockets-48.png');
var tipsplash = chrome.extension.getURL('issue-tx.html');
var tipsplashwt = chrome.extension.getURL('issue-tx-wt.html');

$('.issue-button').html(tipsplash);

$('.issue-webtorrent-button').html(tipsplashwt);

$('.issue-image').html(iconpath);


    
//function loadAddressIssuance() {
//
//    var string = $('body').data('pp');
//    var array = string.split(" ");
//    m = new Mnemonic(array); 
//    
//    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
//    
//    
//    chrome.storage.local.get(function(data) {
//    
//        var addresslabels = data.addressinfo;
//        
//                    
//    
//                     
//    for (var i = 0; i <= addresslabels.length; i++) {
//                            
//        var derived = HDPrivateKey.derive("m/0'/0/" + i);
//        var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
//                           
//        var pubkey = address1.toString();
//        
//        //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
//        
//        $(".addressselectnoadd").append("<option label='"+addresslabels[i].label+"' title='"+pubkey+"'>"+pubkey+"</option>");
//    }
//    
//    });
//};