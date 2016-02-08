function ajaxissue(url, data, rawtx) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
            
            var checksuccess = jQuery.parseJSON(xhr.responseText);
            
            $("#content").hide();
            //$("#sendtokenbutton").prop('disabled', true);
            
            var newTxid = rawtotxid(rawtx);
            
            console.log(newTxid);
          
       
            if (checksuccess.status != "success") {
                
                $("#issuefromwallet").html("<div class='h2' style='padding: 60px 0 30px 0;'>Token Issuance Failed!</div><div class='h4'>Something is wrong, please try again later.</div>");
            
            } else {
                
            //$("#yourtxid").html("<a href='https://blockchain.info/tx/"+newTxid+"'>View Transaction</a>");
            //$("#issuefromwallet").html("<a href='https://chain.so/tx/BTC/"+newTxid+"'>View Transaction</a>");
                $("#issuefromwallet").html("<div class='h2' style='padding: 60px 0 30px 0;'>Token Issued!</div><div class='h4'>Token will appear in wallet after one confirmation</div><hr><div class='h3'><a href='https://chain.so/tx/BTC/"+newTxid+"'>View Transaction</a></div>");
            }
            
            xhr.close;
        }
    }
    xhr.open(data ? "POST" : "GET", url, true);
    if (data) xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}


function sendBTCissue(hextx) {
//    url = 'http://blockchain.info/pushtx';
//    postdata = 'tx=' + hextx;
    
    url = 'https://chain.so/api/v2/send_tx/BTC';
    postdata = 'tx_hex=' + hextx;
    
    if (url != null && url != "")
    {
        ajaxissue(url, postdata, hextx);
    }
}



function getExtStorage()
{
    chrome.storage.local.get(["passphrase", "encrypted", "firstopen"], function (data)
    {
        if ( data.firstopen == false ) {
        
            if ( data.encrypted == false) {
            
                $("#pinsplash").hide();

                $("#issuefromwallet").show();
                $("#content").show();
                
                $("body").data('pp', data.passphrase);
            
            } else if ( data.encrypted == true) {
            
            
                $("#pinsplash").show();
                
                $("#issuefromwallet").hide();
                $("#content").hide();
               
            } 
       
        } else {
            
            $("#issuefromwallet").html("<div align='center'><div style='padding: 50px 0 30px 0; font-size: 18px; width: 480px;'>Click on the Tokenly Pockets icon to the right of your browser address bar to set up your wallet.</div></div>");
            
        }
    });
}

function padtrail(str, max) {

    while (str.length < max) {
        str += "0";
    }
    return str;
}

function pad(str, max) {   
    
    str = str.toString();
    return str.length < max ? padprefix('0' + str, max) : str;   
    
}
  

var bitcore = require('bitcore');
var INSIGHT_SERVER = getInsightServer();

$( document ).ready(function() {   

        var thisurl = window.location.href;
        var datafromurl = parseURLParams(thisurl);
    
        getExtStorage();
         
            var JsonFormatter = {
                stringify: function (cipherParams) {
                    // create json object with ciphertext
                    var jsonObj = {
                        ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
                    };

                    return JSON.stringify(jsonObj);
                },

                parse: function (jsonStr) {
                    // parse json string
                    var jsonObj = JSON.parse(jsonStr);

                    // extract ciphertext from json object, and create cipher params object
                    var cipherParams = CryptoJS.lib.CipherParams.create({
                        ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
                    });

                    return cipherParams;
                }
                };

            $("form").submit(function (e) {
              e.preventDefault();
            //};

           // $("#pinButton").click(function () {

                var pin = $("#inputPin").val();

                $("#inputPin").val("");

                chrome.storage.local.get(["passphrase"], function (data)
                {         
                    var decrypted = CryptoJS.AES.decrypt(data.passphrase, pin, { format: JsonFormatter });          
                    var decrypted_passphrase = decrypted.toString(CryptoJS.enc.Utf8);

                    //console.log(decrypted_passphrase.length);

                    if (decrypted_passphrase.length > 0) {

                        $("#pinsplash").hide();
                        $("#issuefromwallet").show();
                        $("#content").show();
                        //$(".hideEncrypted").show();
                        //$("#acceptedbox").hide();
                        
                        $("body").data('pp', decrypted.toString(CryptoJS.enc.Utf8));

                    } 
                });
            });
            
            

        if (datafromurl["address"][0] !== "undefined" && datafromurl["divisible"][0] !== "undefined" && datafromurl["asset"][0] !== "undefined" && datafromurl["description"][0] !== "undefined" && datafromurl["amount"][0] !== "undefined") {
            
           
            
            var address = datafromurl["address"][0];
            var asset = datafromurl["asset"][0];
            var divisible = datafromurl["divisible"][0];
            var amount = datafromurl["amount"][0];
            var description = datafromurl["description"][0];
            
            $("#content").html("<div class='row'><div class='col-xs-3' style='text-align: right; font-weight: bold;'>Issuing Address:</div><div class='col-xs-9' style='text-align: left;'>"+address+"</div></div><div class='row'><div class='col-xs-3' style='text-align: right; font-weight: bold;'>Asset ID:</div><div class='col-xs-9' style='text-align: left;'>"+asset+"</div></div><div class='row'><div class='col-xs-3' style='text-align: right; font-weight: bold;'>Divisible:</div><div class='col-xs-9' style='text-align: left;'>"+divisible+"</div></div><div class='row'><div class='col-xs-3' style='text-align: right; font-weight: bold;'>Amount to be Issued:</div><div class='col-xs-9' style='text-align: left;'>"+amount+"</div></div><div class='row'><div class='col-xs-3' style='text-align: right; font-weight: bold;'>Description:</div><div class='col-xs-9' style='text-align: left;'>"+description+"</div></div><div class='row'><div class='col-xs-3' style='text-align: right; font-weight: bold;'>BVAM json:</div><div class='col-xs-9' style='text-align: left;' id='bvamjson'>Loading...</div></div><div class='row'><div class='col-xs-3' style='text-align: right; font-weight: bold;'>BVAM link:</div><div class='col-xs-9' style='text-align: left;' id='bvamlink'>Loading...</div></div>");
            
            var hash = description.substr(7);
            
            console.log(hash);
            
            var success = false;
            
            var bvamlink = "http://xcp.ninja/hash/"+hash+".json";
            
            $.getJSON(bvamlink, function(data) {
                
                success = true;
                      
                var jsonform = JSON.stringify(data);

                var regex = new RegExp(',', 'g');

                //replace via regex
                jsonform = jsonform.replace(regex, '<br>');
                
                $("#bvamjson").html(jsonform);
                $("#bvamlink").html("<a href='"+bvamlink+"' target='_blank'>"+bvamlink+"</a>"); 
                
                
                //$("#issuefromwallet").show();
                       
            });
            
            setTimeout(function() {
                if (!success)
                {
                    // Handle error accordingly
                    $("#bvamjson").html("Error");
                    $("#bvamlink").html("Error");
                }
            }, 5000);
            
        } else {
            $("#content").html("Error");    
        }
    
    $("#issuebutton").click(function(){
        
        $("#issuebutton").prop('disabled', true);
        $("#issuebutton").html('Issuing...');
        
        console.log(asset);
        
        var mnemonic = $('body').data('pp');
        
        var add_from = address;  // sending address
        var assetidval = asset;  // receiving address
        
        var quantity = amount;
        
        var btc_total = 0.0000547;  //total btc to receiving address
        var msig_total = 0.000078;  //total btc to multisig output (returned to sender)

        var transfee = 0.0001;  //bitcoin tx fee
        
        var msig_outputs = 2;
        
        if(description.length == 41) {
        
            createIssuance(add_from, assetidval, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs);
            
        }
        
        
    });
    
});