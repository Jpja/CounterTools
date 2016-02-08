function getNetwork() {
	return bitcore.Networks.livenet;
	//return bitcore.Networks.testnet;
}

function getExchangeRatesList() { 
    
   
    
    chrome.storage.local.get(function(data) {
        
        var btcperusd = parseFloat(data.btcperusd);
        
        //console.log(data);
        
     
        
        $("#ExchangeRate").html("");
        
        var ratedisplay = "<table class='table table-condensed' style='margin-top: 20px;'><thead class='small tokenlistingheader' style='cursor: pointer;'><th>Symbol</th><th>Token</th><th style='text-align:center;'>Market Price per Token</th></thead><tbody>";
        
        ratedisplay += "<tr class='tokenlisting' style='cursor: pointer;' data-token='BTC'><td style='vertical-align:middle'><div style='width: 50px;'><img src='bitcoin_48x48.png' width='36' height='36px'></div></td><td style='vertical-align:middle'>BTC</td><td style='vertical-align:middle; text-align:center;'>1 BTC<br>$"+parseFloat(1/btcperusd).toFixed(2)+"</td></tr>"; 
        
        //<th>Price USD</th>

        $.each(data.assetrates, function(i, item) {

            var assetname = data.assetrates[i]["assetname"];   

            var assetprice = parseFloat(data.assetrates[i]["assetprice"]);

            if (assetprice <= 1) {
                var assetpricedisplay = assetprice.toFixed(6);
            } else {
                var assetpricedisplay = assetprice.toFixed(2);
            }

            var assetbtcprice = (btcperusd * assetprice).toFixed(8);

            var iconname = assetname.toLowerCase();
            
            ratedisplay += "<tr class='tokenlisting' style='cursor: pointer;' data-token='"+assetname+"'><td style='vertical-align:middle'><div style='width: 50px;'><img src='http://counterpartychain.io/content/images/icons/"+iconname+".png' width='36' height='36px'></div></td><td style='vertical-align:middle'>"+assetname+"</td><td style='vertical-align:middle; text-align:center;'>"+assetbtcprice+" BTC<br>$"+assetpricedisplay+"</td></tr>"; 
            
            //<td>$"+assetpricedisplay+"</td>
            

            //var ratedisplay = "<div class='assetratedisplay' align='center'><img src='http://counterpartychain.io/content/images/icons/"+iconname+".png'><div class='lead' style='padding: 20px 0 0 0; font-size: 30px;'>"+assetname+"</div><div style='border: 1px solid #ccc; background-color: #fff; padding: 15px 5px 5px 5px; margin: 5px;'><div style='padding: 5px 0 0 0; font-size: 14px; font-style: italic;' class='lead'>Market Rate per Token</div><div style='padding: 0 0 0 0; font-size: 22px;font-weight: bold; ' class='lead'>$"+assetpricedisplay+"</div><div style='padding: 0 0 0 0; font-size: 22px;font-weight: bold; ' class='lead'>"+assetbtcprice+" BTC</div></div></div>"; 
            
            

        });
        
        ratedisplay += "</tbody></table><div style='padding-bottom: 10px; align='center'>Market Data provided by Coincap.io</div><div style='padding-bottom: 30px;' align='center'>";
        
        chrome.storage.local.get(function(data) {
            
            if(typeof(data["assetrates_updated"]) !== 'undefined') { 
               //already set
              
                var ratesupdated = "Last Updated " + data["assetrates_updated"];
                
            } else {
                
                var ratesupdated = "API ERROR";
                
            }

            ratedisplay += "<span id='assetratesupdated' class='small' style='font-style: italic;'>" + ratesupdated + "</span></div>";

            $("#ExchangeRate").html(ratedisplay);
            
        });
        
         
    
    });
}




function setEncryptedTest() {
    
    chrome.storage.local.set(
                    {
                        'encrypted': true
                    }, function () {
                    
                       getStorage();
                    
                    });
    
}


function setPinBackground() {

                    var randomBackground = Math.floor(Math.random() * 5);
            
                    var bg_link = "url('/pin_bg/"+randomBackground+".png')";
            
                    $("#pinsplash").css("background-image", bg_link);
                    $("#pinsplash").css("background-size", "325px 394px"); 

}
    
    
    
function getStorage()
{
    chrome.storage.local.get(["passphrase", "encrypted", "firstopen"], function (data)
    {
        if ( data.firstopen == false ) {
            
            $(".bg").css("min-height", "200px");
            
            $("#welcomesplash").hide();
            $("#navigation").show();
        
            if ( data.encrypted == false) {
            
                existingPassphrase(data.passphrase);
            
            } else if ( data.encrypted == true) {
            
                $(".hideEncrypted").hide();
                $("#navigation").hide();
            
                $("#pinsplash").show();
                $("#priceBox").hide();
        
            } else {
                
                newPassphrase();
                
            }
       
        } else {
            
            $("#welcomesplash").show();
            $("#navigation").hide();
            
        }
            
    });
}






function copyToClipboard(text){
                var copyDiv = document.createElement('div');
                copyDiv.contentEditable = true;
                document.body.appendChild(copyDiv);
                copyDiv.innerHTML = text;
                copyDiv.unselectable = "off";
                copyDiv.focus();
                document.execCommand('SelectAll');
                document.execCommand("Copy", false, null);
                document.body.removeChild(copyDiv);
            }

//function getBlockHeight(){
//     var source_html = "https://insight.bitpay.com/api/sync";
//       
//    $.getJSON( source_html, function( data ) {
//    
//        var block = data.blockChainHeight;
//        return block;
//        
//    });
//}


function showBTCtransactions(transactions) {
            
            //$("#btcbalance").html("<div style='font-size: 12px;'>You can perform "+transactions.toFixed(0)+" transactions</div><div id='depositBTC' align='center' style='margin: 5px; cursor: pointer; text-decoration: underline; font-size: 11px; color: #999;'>Deposit bitcoin for transaction fees</div>");
    
    
    //#sendtokenbutton
    
    if (transactions == 0) {
              
        $("#btcbalance").html("<div style='font-size: 12px;'>Deposit bitcoin to this address.<span id='txsAvailable' style='display: none;'>"+transactions.toFixed(0)+"</span></div>"); 
        
        $("#sendtokenbutton").prop('disabled', true);
                
    } else {
        
        chrome.storage.local.get(function (data) { 
       
//            $("#btcbalance").html("<div style='font-size: 12px;'>You have enough fuel for <span id='txsAvailable'>"+transactions.toFixed(0)+"</span> transactions");
            
            var realtrans = parseInt(transactions);
       
            $("#btcbalance").html("<div style='font-size: 12px;'>You can perform <span id='txsAvailable'>"+realtrans+"</span> asset transaction(s)");
            
            
        }); 
    
        
        
        
                
    }
        
            //var titletext = data + " satoshis";

            //$("#btcbalbox").prop('title', titletext);       
            $("#btcbalbox").show();
}

function qrdepositDropdown() {
            
            var currentaddr = $("#xcpaddress").html();
            
            $("#btcbalance").html("Deposit bitcoin for fuel<div style='margin: 20px 0 10px 0; font-size: 10px; font-weight: bold;'>"+currentaddr+"</div><div id='btcqr' style='margin: 10px auto 20px auto; height: 100px; width: 100px;'></div></div>");
    
    //<div style='font-weight: bold;'>Cost per transaction is 0.00015470 BTC</div>
                                  
            var qrcode = new QRCode(document.getElementById("btcqr"), {
    			text: currentaddr,
    			width: 100,
    			height: 100,
    			colorDark : "#000000",
    			colorLight : "#ffffff",
    			correctLevel : QRCode.CorrectLevel.H
				});
            
            
            //$("#btcbalbox").prop('title', ""); 
            $("#btcbalbox").show();
}



function getBTCBalance(pubkey) {

    //var source_html = "https://insight.bitpay.com/api/addr/"+pubkey+"/balance";
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+pubkey+"/balance";
    //var source_html = "https://chain.so/api/v2/get_address_balance/BTC/"+pubkey;  
    var source_html = "http://btc.blockr.io/api/v1/address/info/"+pubkey;  //blockr
    
    $("#isbtcloading").html("true");
    
    //$.getJSON( source_html, function( data ) { //insight
    $.getJSON( source_html, function( apidata ) {  //blockr
        
        //var bitcoinparsed = parseFloat(data) / 100000000; //insight
        //var bitcoinparsed = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance)).toFixed(8); //chainso
        var bitcoinparsed = parseFloat(apidata.data.balance); //blockr
             
        $("#isbtcloading").html("false"); 
        $("#btcbalhide").html(bitcoinparsed);
        
        //var transactions = (parseFloat(data) / 15470) ; //insight
        //var transactions = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance))/ 0.0001547; //chainso
        var transactions = (parseFloat(apidata.data.balance) / 0.0001547) ; //blockr
        
        if (transactions < 1) {
            transactions = 0;
        }
        
        showBTCtransactions(transactions);
       
    });
}

function getPrimaryBalanceXCP(pubkey, currenttoken) {
    
//    var source_html = "https://insight.bitpay.com/api/sync";
//       
//    $.getJSON( source_html, function( data ) {
//    
//        var block = data.blockChainHeight;
//              
//    });
    
    
//    chrome.storage.local.get('unconfirmedtx', function (data)
//        {
//            if(isset(data)){
//                $.each(data.tx
//        }, function(){
//        
//        });
    //console.log(pubkey);
    //console.log(currenttoken);
    
    
if (currenttoken == "XCP") {
    
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
    
   var source_html = "http://counterpartychain.io/api/address/"+pubkey;
    
    
    $.getJSON( source_html, function( data ) {  
        //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance); 
        
        var assetbalance = data.xcp_balance;
        
        if (typeof assetbalance === 'undefined') {
            assetbalance = 0;
        }
        
        assetbalance = parseFloat(assetbalance).toString(); 
        
        $("#isdivisible").html("yes");
    
        $("#xcpbalance").html("<div id='currentbalance'>" + assetbalance + "</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 22px; font-weight: bold;'>" + currenttoken + "</div>");
        $('#assetbalhide').html(assetbalance);
        
        getRate(assetbalance, pubkey, currenttoken);
        
        currenttokenpending(currenttoken);
        
    });
    
} else {  
    
    
    var source_html = "https://counterpartychain.io/api/balances/"+pubkey;
    
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
    
    
    $.getJSON( source_html, function( data ) {     
        
        
        $.each(data.data, function(i, item) {
            var assetname = data.data[i].asset;
            
            if(assetname == currenttoken) {
                var assetbalance = data.data[i].amount; 
                
                if(assetbalance.indexOf('.') !== -1)
                {
                    $("#isdivisible").html("yes");
                } else {
                    $("#isdivisible").html("no");
                }
                
                assetbalance = parseFloat(assetbalance).toString(); 
                
                if(assetname.substr(0,1) == "A") {
                    
                
                    $("#xcpbalance").html("<div id='currentbalance'>" + assetbalance + "</div><div id='currenttoken-pending' class='unconfirmedbal'></div><div style='font-size: 18px; font-weight: bold;'>" + currenttoken + "</div>");
                    
                } else {
                    
                    var clockstyle = assetbalance;
                    
                    $("#xcpbalance").html("<div id='currentbalance'>" + assetbalance + "</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 22px; font-weight: bold;'>" + currenttoken + "</div>");
                   
                    
                }
                $('#assetbalhide').html(assetbalance);
                
                
                
                getRate(assetbalance, pubkey, currenttoken);
                
                currenttokenpending(currenttoken);
                     
            }
        });
       
        
        
    });
    
}
    
    if (typeof assetbalance === 'undefined') {
        
        if(currenttoken.substr(0,1) == "A") {
            
            var enhancedassetname = $("#xcpbalance").data("enhanced");           
            
            $("#xcpbalance").html("<div id='currentbalance'>0</div><div id='currenttoken-pending' class='unconfirmedbal'></div><div style='font-size: 18px; font-weight: bold;'>" + currenttoken + "</div>");
                    
            
        } else {
        
        
            $("#xcpbalance").html("<div id='currentbalance'>0</div><div id='currenttoken-pending' class='unconfirmedbal'></div><br><div style='font-size: 22px; font-weight: bold;'>" + currenttoken + "</div>");
            
            //
            
        }
            $('#assetbalhide').html(0);
            getRate(0, pubkey, currenttoken);
        
        currenttokenpending(currenttoken);
    }

}

function getPrimaryBalanceBTC(pubkey){
        
    //var source_html = "https://blockchain.info/q/addressbalance/"+pubkey;
    //var source_html = "https://chain.so/api/v2/get_address_balance/BTC/"+pubkey;    
    var source_html = "http://btc.blockr.io/api/v1/address/info/"+pubkey;
    //var source_html = "https://insight.bitpay.com/api/addr/"+pubkey+"/balance";
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+pubkey+"/balance";
    
    $.getJSON( source_html, function( apidata ) {  //blockr
    //$.getJSON( source_html, function( data ) {  //insight
        
        //var bitcoinparsed = parseFloat(data) / 100000000; //insight
        var bitcoinparsed = parseFloat(apidata.data.balance); //blockr
        //var bitcoinparsed = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance)).toFixed(8); //chainso
        
        $("#xcpbalance").html(bitcoinparsed + "<br><div style='font-size: 22px; font-weight: bold;'>BTC</div>");
        
//        if (bitcoinparsed.toFixed(8) == 0) {
//            $("#btcsendbox").hide();
//        } else {
//            $("#btcsendbox").show();
//        }
        
        getRate(bitcoinparsed, pubkey, "BTC");
        
        
    });
}

function getPrimaryBalance(pubkey){
    
    var addressbox = $("#sendtoaddress").val();
    
    if (addressbox.length == 0) {
        $("#btcsendbox").hide();   
    }
    
    var currenttoken = $(".currenttoken").html();
   
    if (currenttoken != "BTC") {
        
        getPrimaryBalanceXCP(pubkey, currenttoken);
        
    } else {
    
        getPrimaryBalanceBTC(pubkey);
    
    }
        
}


function getRate(assetbalance, pubkey, currenttoken){
    
    if ($("#ltbPriceFlipped").html() == "...") {
        
                                
        
        //$.getJSON( "https://api.bitcoinaverage.com/ticker/USD/", function( data ) {
            
        $.getJSON( "http://btc.blockr.io/api/v1/exchangerate/current", function( data ) {

                  
                            //var btcprice = 1 / parseFloat(data.last);
            
                            var btcprice = parseFloat(data.data[0]["rates"]["BTC"]);

                            $("#ltbPrice").html(Number(btcprice.toFixed(4).toLocaleString('en')));
                            
                            //var btcpriceflipped = data.last;
            
                            var btcpriceflipped = 1 / parseFloat(data.data[0]["rates"]["BTC"]);
                            
                            $("#ltbPriceFlipped").html("$"+parseFloat(Math.round(btcpriceflipped * 100) / 100).toFixed(2));

                            $("#ltbPrice").data("btc", { price: btcprice.toFixed(6) });




                            if (currenttoken == "BTC") {
                                //var usdValue = parseFloat(data.last) * parseFloat(assetbalance);
                                
                                var usdValue = parseFloat(btcpriceflipped) * parseFloat(assetbalance);

                                $("#xcpfiatValue").html(usdValue.toFixed(2)); 
                                $("#switchtoxcp").hide();
                                $("#fiatvaluebox").show();
                            } else {
                                $("#fiatvaluebox").hide();
                                $("#switchtoxcp").show();
                            }
                            
                           chrome.storage.local.set(
                                {
                                    'btcperusd': btcprice

                                }, function () {
                        
                    

                                }); 
            
            
            $.getJSON( "http://www.coincap.io/front/", function( data ) {
                
                var j = 0;
                
                var assetrates = new Array();  
                
                $.each(data, function(i, item) {
                        var assetname = data[i].short;
                        var assetprice = data[i].price;  

                        if (assetname == "LTBC"){ 
                            assetname = "LTBCOIN";
                            
                            assetrates[j] = {assetname, assetprice};
                            j++;
                        }
                    
                        if (assetname == "XCP"){ 
                            
                            assetrates[j] = {assetname, assetprice};
                            j++;
                        }

                        
                 });
                
                
        
              $.getJSON( "http://www.coincap.io/front/xcp", function( data ) {

                     

                 $.each(data, function(i, item) {
                        var assetname = data[i].short;
                        var assetprice = data[i].price;  

                        if (assetname != "LTBC" && assetname != "XCP"){ 
                            
                            assetrates[i+j] = {assetname, assetprice};
                            
                        }

                        
                 });
                  
                  var currentdate = new Date(); 
                  var datetime = (currentdate.getMonth()+1) + "/" + currentdate.getDate() + "/" + currentdate.getFullYear() + " at " + currentdate.getHours() + ":" + padprefix(currentdate.getMinutes(), 2);
                  
                  
                  

                  chrome.storage.local.set(
                        {
                            'assetrates': assetrates,
                            'assetrates_updated': datetime

                        });

                });
                
             });
        });
    
    } else {
        
        if (currenttoken == "BTC") {
            var ltbrate = $("#ltbPrice").data("btc").price;
            var usdrate = 1 / parseFloat(ltbrate);
            var usdValue = usdrate * parseFloat(assetbalance);
            $("#xcpfiatValue").html(usdValue.toFixed(2));
            $("#switchtoxcp").hide();
            $("#fiatvaluebox").show();
        
            
        } else {
            $("#fiatvaluebox").hide();
            $("#switchtoxcp").show();
        }        
        
    
    }
    
    getBTCBalance(pubkey);
}


function convertPassphrase(m){
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    var derived = HDPrivateKey.derive("m/0'/0/" + 0);
    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
    var pubkey = address1.toString();    
    
    $("#xcpaddressTitle").show();
    $("#xcpaddress").html(pubkey);
    
    getPrimaryBalance(pubkey);
    
}

function assetDropdown(m)
{
    $(".addressselect").html("");
    
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
     
    chrome.storage.local.get(function(data) {
              
        var totaladdress = data["totaladdress"];
        
        var addresslabels = data["addressinfo"];
        
        for (var i = 0; i < totaladdress; i++) {
                            
            var derived = HDPrivateKey.derive("m/0'/0/" + i);
            var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);

            var pubkey = address1.toString();

            $(".addressselect").append("<option label='"+addresslabels[i].label+"' title='"+pubkey+"'>"+pubkey+"</option>");

            if (i == 0) {
                $(".addressselect").attr("title",pubkey);    
            }
                //.slice(0,12)

            //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
        }
    
        $(".addressselect").append("<option label='--- Add New Address ---'>add</option>");
        
    }); 
                 
    
}


function dynamicAddressDropdown(addresslabels, type)
{
      
    var string = $("#newpassphrase").html();
    var array = string.split(" ");
    m = new Mnemonic(array);
    
    var currentsize = $('#walletaddresses option').size(); 
    
    if (type == "newlabel") {
        currentsize = currentsize - 1;
        var addressindex = $("#walletaddresses option:selected").index();
    } 
    
    $(".addressselect").html("");  
    
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
                     
    for (var i = 0; i < currentsize; i++) {
                            
        var derived = HDPrivateKey.derive("m/0'/0/" + i);
        var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
                           
        var pubkey = address1.toString();
        
        //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
        
        $(".addressselect").append("<option label='"+addresslabels[i].label+"' title='"+pubkey+"'>"+pubkey+"</option>");
    }
    
  
    
    
    $(".addressselect").append("<option label='--- Add New Address ---'>add</option>");
       
    if (type == "newaddress") {
        getBTCBalance(pubkey);
        var newaddress_position = parseInt(currentsize) - 1;
        var newaddress_select = "#walletaddresses option:eq("+newaddress_position+")";
        var newaddress_val = $(newaddress_select).val();
        $("#xcpaddress").html(newaddress_val);
        getPrimaryBalance(newaddress_val);
    } else {
        var newaddress_position = addressindex;
    }
    
    
    var newaddress_select = "#walletaddresses option:eq("+newaddress_position+")";
    $(newaddress_select).attr('selected', 'selected');
    
}

function newPassphrase()
{
     
    m = new Mnemonic(128);
    m.toWords();
    var str = m.toWords().toString();
    var res = str.replace(/,/gi, " ");
    var phraseList = res; 
    
    $("#newpassphrase").html(phraseList);
    $("#yournewpassphrase").html(phraseList);
    
    var addressinfo = [{label:"Address 1"},{label:"Address 2"},{label:"Address 3"},{label:"Address 4"},{label:"Address 5"}];        
    
    chrome.storage.local.set(
                    {
                        'passphrase': phraseList,
                        'encrypted': false,
                        'firstopen': false,
                        'addressinfo': addressinfo,
                        'totaladdress': 5
                        
                    }, function () {
                        
                        //resetFive();
                        //$(".hideEncrypted").show();
                        convertPassphrase(m);
                        assetDropdown(m);
                        $('#allTabs a:first').tab('show');
                    
                    });

}

function existingPassphrase(string) {
    
    
    
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    
    $("#newpassphrase").html(string);
       
    convertPassphrase(m2);    
    checkImportedLabels(m2, assetDropdown);

    
    $('#allTabs a:first').tab('show')
}



function manualPassphrase(passphrase) {
//    var string = $('#manualMnemonic').val().trim().toLowerCase();
//    $('#manualMnemonic').val("");
    
    
    var string = passphrase.trim().toLowerCase();
    
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    
    $("#newpassphrase").html(string);
       
    
    
    
    chrome.storage.local.set(
                    {
                        'passphrase': string,
                        'encrypted': false,
                        'firstopen': false
                    }, function () {
                    
                        convertPassphrase(m2);
                        assetDropdown(m2);
    
                        //$(".hideEncrypted").show();
                        $("#manualPassBox").hide();
                        
                        
                         $('#allTabs a:first').tab('show')
                      
                    
                    });
}





function loadAssets(add) {
    
    $( "#allassets" ).html("<div align='center' style='margin: 40px 0 40px 0;' class='lead'><i class='fa fa-cog fa-spin fa-5x'></i></div>");
      
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+add;
    
    var source_html = "https://counterpartychain.io/api/balances/"+add+"?description=1";
    
    var xcp_source_html = "http://counterpartychain.io/api/address/"+add;
    
    var btc_source_html = "https://"+INSIGHT_SERVER+"/api/addr/"+add+"/balance";
    
    $( "#allassets" ).html("<div align='center' style='margin: 40px 0 40px 0;' class='lead'><i class='fa fa-cog fa-spin fa-5x'></i></div>");
    
    $.getJSON( xcp_source_html, function( data ) {  
        //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance); 
        
        var xcpbalance = parseFloat(data.xcp_balance).toFixed(8);    
        
        if (xcpbalance == 'NaN' || typeof xcpbalance === 'undefined') {
            xcpbalance = 0;
        }
    
        $.getJSON( source_html, function( data ) {
        
            $( "#allassets" ).html("<div class='btcasset row roundasset'><div class='col-xs-2' style='margin-left: -10px;'><div style='padding: 6px 0 0 2px;'><img src='bitcoin_48x48.png'></div></div><div class='col-xs-10'><div class='assetname'>BTC</div><div class='movetowallet'>Send</div><div class='assetqtybox'><div class='assetqty' id='btcassetbal' style='background-color: #EDB047; border-radius: 5px; padding: 3px 6px 3px 6px; min-width: 30px; margin-bottom: 3px; text-align: center;'></div></div></div></div>");
            
            //EDB047
            var isbtcloading = $("#isbtcloading").html();
            
            if (isbtcloading == "true") {
    
                var btcbalance = "...";
                
                $("#btcassetbal").html(btcbalance);

                $.getJSON( btc_source_html, function( data_btc ) { 
      
                    var bitcoinparsed = parseFloat(data_btc) / 100000000;
         
                    $("#isbtcloading").html("false");
        
                    $("#btcassetbal").html(bitcoinparsed);
                    
                });
                
            } else {
                
                var btcbalance = $("#btcbalhide").html();
                $("#btcassetbal").html(btcbalance);
                
            }
            
            
            var xcpicon = "http://counterpartychain.io/content/images/icons/xcp.png";
            
            if (xcpbalance != 0) {
            
                $( "#allassets" ).append("<div class='xcpasset row roundasset'><div class='col-xs-2' style='margin-left: -10px;'><div style='padding: 6px 0 0 2px;'><img src='"+xcpicon+"'></div></div><div class='col-xs-10'><div class='assetname'>XCP</div><div class='movetowallet'>Send</div><div class='assetqtybox'><div class='assetqty' style='background-color: #CF5151; border-radius: 5px; padding: 3px 6px 3px 6px; min-width: 30px; margin-bottom: 3px; text-align: center;'>"+xcpbalance+"</div>  <div class='XCP-pending assetqty-unconfirmed'></div></div></div></div>");
                //CF5151
            }
        
//            var totalassets = data.data;
//            var countnumeric = 0;
//            
//            var bvamwtarray = new Array();
//            var addressbvam = new Array();
//            
//            if(data.success != 0) {                
//            
//                for (var i = 0; i < totalassets.length; i++) {
//
//                    var assetdescription = data.data[i].description;
//                    var assetname = data.data[i].asset;
//                    var assetbalance = data.data[i].amount;
//
//                    if (assetdescription.substr(0,6) == "TOKNID" && assetname.substring(0, 4) == "A111") {
//                        countnumeric++;
//                        var bvamhash = assetdescription.substr(7);
//                        addressbvam = addressbvam.concat({asset: assetname, amount: assetbalance, hash: bvamhash, data: ""});
//                    }
//
//                    if (assetdescription.substr(0,6) == "BVAMWT" && assetname.substring(0, 4) == "A111") {
//
//                        var bvamhash = assetdescription.substr(7);
//                        var assetname = data.data[i].asset;
//                        var assetbalance = data.data[i].amount;
//
//                        bvamwtarray = bvamwtarray.concat({hash: bvamhash, asset: assetname, amount: assetbalance, data: ""})
//
//                    }
//
//                }
//
//                console.log("Total BVAM: "+countnumeric);
//
//                checkBvam(addressbvam, countnumeric, function(matchingdata, missing){
//
//                    console.log(matchingdata);
//
//                    console.log("missing: "+missing);
//
//
//
//                    var allbvamdata = new Array();

                    $.each(data.data, function(i, item) {
                        var assetname = data.data[i].asset;
                        var assetbalance = data.data[i].amount; //.balance for blockscan
                        var assetdescription = data.data[i].description;
                        if (assetbalance.indexOf(".")==-1) {var divisible = "no";} else {var divisible = "yes";}

                        var iconname = assetname.toLowerCase();
                        var iconlink = "http://counterpartychain.io/content/images/icons/"+iconname+".png";

                        if (assetname.charAt(0) != "A") {
                            var assethtml = "<div class='singleasset row roundasset'><div class='col-xs-2' style='margin-left: -10px;'><div style='padding: 6px 0 0 2px;'><img src='"+iconlink+"'></div></div><div class='col-xs-10'><div class='archiveasset'>Archive</div><div class='assetname'>"+assetname+"</div><div class='movetowallet'>Send</div><div class='assetqtybox'><div class='assetqty' style='background-color: #3082B0; border-radius: 5px; padding: 3px 6px 3px 6px; min-width: 30px; margin-bottom: 3px; text-align: center;'>"+assetbalance+"</div> <div class='"+assetname+"-pending assetqty-unconfirmed'></div></div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div></div>";
                            //3082B0
                            //$( "#allassets" ).append( assethtml );

                        } else {
                            
                            var assethtml = "<div class='singleasset-numeric row roundasset'><div class='col-xs-2' style='margin-left: -10px;'><div style='padding: 6px 0 0 2px;'><img src='"+iconlink+"'></div></div><div class='col-xs-10'><div class='archiveasset'>Archive</div><div class='assetname-numeric'>"+assetname+"</div><div class='movetowallet'>Send</div><div class='assetqtybox'><div class='assetqty' style='background-color: #3082B0; border-radius: 5px; padding: 3px 6px 3px 6px; min-width: 30px; margin-bottom: 3px; text-align: center;'>"+assetbalance+"</div> <div class='"+assetname+"-pending assetqty-unconfirmed'></div></div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div></div>";
                            
                        }
                        
                        $( "#allassets" ).append( assethtml );

                    });

//                    $.each(matchingdata, function(i, item) {
//
//                        var hash = matchingdata[i]["hash"];
//                        var assetname = matchingdata[i]["asset"];                    
//                        var assetbalance = matchingdata[i]["amount"];
//                        var iconlink = "http://counterpartychain.io/content/images/icons/xcp.png";
//                        if (assetbalance.indexOf(".")==-1) {var divisible = "no";} else {var divisible = "yes";}
//
//
//                        if(matchingdata[i]["data"] != "") {
//                            //local bvam
//                            var isvaliddata = validateEnhancedAssetJSON(matchingdata[i]["data"]);
//
//                            console.log("Calculated Local JSON Hash: "+isvaliddata);
//                            console.log("Stored Local JSON Hash: "+hash);
//
//                            if(isvaliddata != hash) {
//
//                                var jsondata = new Array();  
//                                var jsondata = {ownername: matchingdata[i]["data"]["ownername"], ownertwitter: matchingdata[i]["data"]["ownertwitter"], owneraddress: matchingdata[i]["data"]["owneraddress"], asset: matchingdata[i]["data"]["asset"], assetname: matchingdata[i]["data"]["assetname"], assetdescription: matchingdata[i]["data"]["assetdescription"], assetwebsite: matchingdata[i]["data"]["assetwebsite"]};
//
//                                var isvaliddata = validateEnhancedAssetJSON(jsondata);
//
//                                console.log("Re-ordered Calculated Local JSON Hash: "+isvaliddata);
//                                console.log("Stored Local JSON Hash: "+hash);   
//
//                            }
//
//
//                            if(isvaliddata == hash && matchingdata[i]["data"]["asset"] == assetname) {
//
//                                var enhancedname = matchingdata[i]["data"]["assetname"];
//
//                                var assethtml = "<div class='enhancedasset row'><div class='col-xs-2' style='margin-left: -10px;'><div style='padding: 5px 0 0 2px;'><img src='"+iconlink+"'></div></div><div class='col-xs-10'><div class='archiveasset'>Archive</div><div style='width: 200px;' class='assetname-enhanced' data-numeric='"+assetname+"'>"+enhancedname+"</div><div class='movetowallet'>Send</div><div style='margin: 5px 0 8px 9px; width: 200px; font-size: 11px; font-style: italic;'>"+assetname+"</div><div class='assetqtybox'><div class='assetqty' style='background-color: #6B8A62; border-radius: 5px; padding: 3px 6px 3px 6px; min-width: 30px; margin-bottom: 3px; text-align: center;'>"+assetbalance+"</div> <div class='"+assetname+"-pending assetqty-unconfirmed'></div></div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div></div>";
//
//                                 $( "#allassets" ).append( assethtml );
//
//                            }
//
//                        } else {
//                            //get bvam
//
//                            $.getJSON("http://xcp.ninja/hash/"+hash+".json", function(data) {
//
//                                var isvaliddata = validateEnhancedAssetJSON(data);
//
//                                console.log("Calculated Remote JSON Hash: "+isvaliddata);
//                                console.log("Stored Remote JSON Hash: "+hash);   
//
//                                if(isvaliddata == hash && data.asset == assetname) {
//
//                                        var assethtml = "<div class='enhancedasset row'><div class='col-xs-2' style='margin-left: -10px;'><div style='padding: 5px 0 0 2px;'><img src='"+iconlink+"'></div></div><div class='col-xs-10'><div class='archiveasset'>Archive</div><div style='width: 200px;' class='assetname-enhanced' data-numeric='"+assetname+"'>"+data.assetname+"</div><div class='movetowallet'>Send</div><div style='margin: 5px 0 8px 9px; width: 200px; font-size: 11px; font-style: italic;'>"+assetname+"</div><div class='assetqtybox'><div class='assetqty' style='background-color: #6B8A62; border-radius: 5px; padding: 3px 6px 3px 6px; min-width: 30px; margin-bottom: 3px; text-align: center;'>"+assetbalance+"</div> <div class='"+assetname+"-pending assetqty-unconfirmed'></div></div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div></div>";
//
//                                        var time_date = new Date();
//                                        var time_unix = time_date.getTime();
//
//                                        allbvamdata = allbvamdata.concat({hash: hash, type: "TOKNID", data: data, added: time_unix});
//
//                                        if(missing == 1) { 
//                                            addBvam(allbvamdata);
//                                            console.log(allbvamdata);
//                                        } else {
//                                            missing--;
//                                        }
//
//
//                                        $( "#allassets" ).append( assethtml );
//
//                                }
//                            }).fail(function(){
//
//                                        if(missing == 1) { 
//
//
//                                            addBvam(allbvamdata);
//                                            console.log(allbvamdata);
//                                        } else {
//                                            missing--;
//                                        }
//
//                            });
//
//                        }
//
//                    });

                });



                
//                getBvamWT(bvamwtarray, function(status) {  
//
//                    console.log(status);
//
//                });



                var xcp_mempool_html = "https://counterpartychain.io/api/mempool";

                $.getJSON( xcp_mempool_html, function( data ) {  

                    if (data.success == 1 && data.total > 0) {

                        var currentaddr = $("#xcpaddress").html();

                        $.each(data.data, function(i, item)  {

                            if (currentaddr == data.data[i].source || currentaddr == data.data[i].destination) {

                                if (currentaddr == data.data[i].source) {var debitorcredit = "-";};                    
                                if (currentaddr == data.data[i].destination) {var debitorcredit = "+";};

                                var assetqty = debitorcredit + (data.data[i].quantity * 1);          
                                var assetname = data.data[i].asset;
                                var assetnameclass = "."+assetname+"-pending";

                                if($(assetnameclass).html() != '') {

                                    var currentunconf = $(assetnameclass).html();

                                    var result = currentunconf.substring(1, currentunconf.length-1);

                                    console.log(result);

                                    var combinetxs = parseFloat(result) + parseFloat(assetqty);

                                    console.log(combinetxs);

                                    if (combinetxs > 0) { 

                                        var unconftxs = "+" + combinetxs;



                                    } else {

                                        var unconftxs = combinetxs;

                                    }

                                    $(assetnameclass).html("("+unconftxs+")")

                                } else {

                                    $(assetnameclass).html("("+assetqty+")");

                                }


                                var currentunconf = $(assetnameclass).html();

                                var result = parseFloat(currentunconf.substring(1, currentunconf.length-1));

                                if( result > 0 ) {

                                    $( ".assetqty-unconfirmed" ).css( "color", "#9CFFA7" );

                                } else {

                                    $( ".assetqty-unconfirmed" ).css( "color", "#FA9B9B" );

                                }

                            }

                        });

                    }

                });

                //loadTransactions(add);
            
       // }
        
        });
        
  //  });
}





    		function makedSignedMessage(msg, addr, sig)
    		{
        		var qtHdr = [
      			"<pre>-----BEGIN BITCOIN SIGNED MESSAGE-----",
      			"-----BEGIN BITCOIN SIGNATURE-----",
      			"-----END BITCOIN SIGNATURE-----</pre>"
    			];
                
                return qtHdr[0]+'\n'+msg +'\n'+qtHdr[1]+'\nVersion: Bitcoin-qt (1.0)\nAddress: '+addr+'\n\n'+sig+'\n'+qtHdr[2];
    		}
    		
    		function getprivkey(inputaddr, inputpassphrase){
    			//var inputaddr = $('#inputaddress').val();
    			
    			//var string = inputpassphrase.val().trim().toLowerCase();
                //string = string.replace(/\s{2,}/g, ' ');
                var array = inputpassphrase.split(" ");
                
                m2 = new Mnemonic(array);
                
                var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m2.toHex(), bitcore.Networks.livenet);
                
                 
                        for (var i = 0; i < 50; i++) {
                            
                            var derived = HDPrivateKey.derive("m/0'/0/" + i);
                            var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
                           
                            var pubkey = address1.toString();
                            
                            if (inputaddr == pubkey) {
                            var privkey = derived.privateKey.toWIF();
                            break;
                            
                            }
                        }
                
                return privkey;
    		}
    		
    		
    		
    		function signwith(privkey, pubkey, message) {
    			
    			
    			
    			//var message = "Message, message";
      			var p = updateAddr(privkey, pubkey);
      			
      			if ( !message || !p.address ){
        		return;
      			}

      			message = fullTrim(message);

      			
        		var sig = sign_message(p.key, message, p.compressed, p.addrtype);
   

      			sgData = {"message":message, "address":p.address, "signature":sig};

      			signature_final = makedSignedMessage(sgData.message, sgData.address, sgData.signature);
    			
    			return signature_final;
    
    		}

function twodigits(n){
    return n > 9 ? "" + n: "0" + n;
}

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp*1000);
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = twodigits(month) + '-' + twodigits(date) + '-' + year + ' | ' + twodigits(hour) + ':' + twodigits(min) + ':' + twodigits(sec) ;
  return time;
}


function loadTransactionsBTC(add, callback) {
    
    var source_html = "http://btc.blockr.io/api/v1/address/txs/"+add;
    
    $.getJSON( source_html, function( data ) {
        
        var btctxs = new Array();
        
        
//        for (var i = 0; i < 100; i++) {
        $.each(data.data.txs, function(i, item) {
            
            var tx = data.data.txs[i]["tx"];          
            var time_utc = data.data.txs[i]["time_utc"];
            var confirmations = data.data.txs[i]["confirmations"];
            var amount = data.data.txs[i]["amount"];
            
            if (amount > 0) {
                amount = "+"+amount;
            }
            
            var time_date = new Date(time_utc);
            var time_unix = time_date.getTime();
            
            time_unix = parseFloat(time_unix) / 1000;
            
            btctxs.push({assetname: "BTC", address: "", tx: tx, time_utc: time_unix, amount: amount});
            
        });
//        }
//        console.log(btctxs);
        
        callback(add, btctxs);
        
    });
    
}

function loadTransactions(add, btctxs) {
    
    $( "#alltransactions" ).html("<div align='center' style='margin: 40px 0 40px 0;' class='lead'><i class='fa fa-cog fa-spin fa-5x'></i></div>");

//    loadBvam(function(bvamdata, hashname, hashhash){
    
        loadTransactionsBTC(add, function(add, btctxs) { //{"address":"1CWpnJVCQ2hHtehW9jhVjT2Ccj9eo5dc2E","asset":"LTBCOIN","block":348621,"quantity":"-50000.00000000","status":"valid","time":1426978699,"tx_hash":"dc34bbbf3fa02619b2e086a3cde14f096b53dc91f49f43b697aaee3fdec22e86"}

            var source_html = "https://counterpartychain.io/api/transactions/"+add;

            $.getJSON( source_html, function( data ) {

                var alltxs = new Array();

                var xcptxs = new Array();    
                
                console.log(data);
                
                if(data.success != 0) {

                    $.each(data.data, function(i, item) {

                        
                        var assetname = data.data[i].asset;
                        var address = data.data[i].address;
                        var quantity = data.data[i].quantity;
                        var time = data.data[i].time;
                        var tx = data.data[i].tx_hash;
                        
                     //   if (assetname == "TIMEPIECE") {
                            xcptxs.push({assetname: assetname, address: address, tx: tx, time_utc: time, amount: quantity});
                     //   }
                    });

                    var alltxs = xcptxs.concat(btctxs);
                    
                } else {
                    
                    var alltxs = btctxs;
                    
                }

                console.log(alltxs);

                alltxs.sort(function(a, b) {
                    return b.time_utc - a.time_utc;
                });

                var j;

                for (var i = 0; i < alltxs.length; i++) {

    //                j = i - 1;

                    for (var j = 0; j < alltxs.length; j++) {
                        
                        if (i != j) {

                            if (alltxs[i]["tx"] == alltxs[j]["tx"]) {

                                if(alltxs[i].assetname == "BTC") {
                                    alltxs.splice(i, 1);
                                } else if(alltxs[j].assetname == "BTC") {
                                    alltxs.splice(j, 1);
                                }   

                            }
                            
                        }

                    }

                }
                
//                console.log(alltxs);

                $( "#alltransactions" ).html( "" );

                for (var i = 0; i < 100; i++) {
                //$.each(alltxs, function(i, item) {

                    if (alltxs[i] !== undefined) {

                        var assetname = alltxs[i]["assetname"];

                    //if (assetname.charAt(0) != "A") {

                        var address = alltxs[i].address;

                        var quantity = alltxs[i].amount;
                        var time = alltxs[i].time_utc;

                        //var translink = "https://counterpartychain.io/transaction/"+alltxs[i].tx;
                        var addlink = "https://counterpartychain.io/address/"+address;
                        var translink = "https://chain.so/tx/BTC/"+alltxs[i].tx;
                        //var addlink = "https://chain.so/address/BTC/"+alltxs[i].tx;

                        if (parseFloat(quantity) < 0) {
                            var background = "senttrans";
                            var transtype = "<span class='small' style='color: #333;'>Sent to </span>";
                        } else {
                            var background = "receivedtrans";
                            var transtype = "<span class='small' style='color: #333;'>Received from </span>";
                        }

                        if (assetname != "BTC") {

                            if (assetname.charAt(0) == "A") {
                                
//                                if (typeof(hashname[assetname]) !== 'undefined') {
//                                    
//                                    var assetname_localbvam = hashname[assetname];
//                                    
//                                    var assethtml = "<div class='"+background+"'><div class='row'><div class='col-xs-6'><div class='assetnumerictrans'>"+assetname_localbvam+"<div style='font-size: 11px; font-style: italic; font-weight: normal;'>"+assetname+"</div></div><div class='assetqtytrans'><span class='small'>Amount:</span><br>"+quantity+"</div></div><div class='col-xs-6'><div class='addresstrans'>"+transtype+"<br><a href='"+addlink+"'>"+address.substring(0, 12)+"...</a></div></div></div><div class='small' style='width: 100%; text-align: right; margin: -18px 0 0 -14px;'><a href='"+translink+"'>"+timeConverter(time)+"</a></div></div>";
//                                
//                                } else {
                                    
                                    var assethtml = "<div class='"+background+"'><div class='row'><div class='col-xs-6'><div class='assetnumerictrans' style='font-size: 12px;'>"+assetname+"</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>"+quantity+"</div></div><div class='col-xs-6'><div class='addresstrans'>"+transtype+"<br><a href='"+addlink+"'>"+address.substring(0, 12)+"...</a></div></div></div><div class='small' style='width: 100%; text-align: right; margin: -18px 0 0 -14px;'><a href='"+translink+"'>"+timeConverter(time)+"</a></div></div>";
                                
                              //  }
                                
                                
                            } else {
                                var assethtml = "<div class='"+background+"'><div class='row'><div class='col-xs-6'><div class='assetnametrans'>"+assetname+"</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>"+quantity+"</div></div><div class='col-xs-6'><div class='addresstrans'>"+transtype+"<br><a href='"+addlink+"'>"+address.substring(0, 12)+"...</a></div><div class='small' style='bottom: 0;'><a href='"+translink+"'>"+timeConverter(time)+"</a></div></div></div></div>";
                            }

                        } else {

                            translink = "https://chain.so/tx/BTC/"+alltxs[i].tx;
                            
   

                                var assethtml = "<div class='"+background+"'><div class='row'><div class='col-xs-6'><div class='assetnametrans'>"+assetname+"</div><div class='assetqtytrans'><span class='small'>Amount:</span><br>"+quantity+"</div></div><div class='col-xs-6'><div class='small' style='margin-top: 54px;'><a href='"+translink+"''>"+timeConverter(time)+"</a></div></div></div></div>";
                                
                   
                        }


                        $( "#alltransactions" ).append( assethtml );

                    //}
                    }
                //});
                }

    //            $( "#alltransactions" ).append("<div style='height: 20px;'></div>");

            });

        });
        
   // });
}

function sendtokenaction() {
    
            $("#sendtokenbutton").html("Sending... <i class='fa fa-spinner fa-spin'></i>");
            $("#sendtokenbutton").prop('disabled', true);

            var assetbalance = $("#assetbalhide").html();
            var currentbalance = parseFloat(assetbalance);
      
            var pubkey = $("#xcpaddress").html();
            var currenttoken = $(".currenttoken").html();
            
            var sendtoaddress = $("#sendtoaddress").val();
    
            var sendtoamount = $("#sendtoamount").val();
            

            console.log(sendtoamount);
    
                       
            if($("#isdivisible").html() == "no"){
            
                sendtoamount = Math.floor(sendtoamount) / 100000000;
            
            } 
            
            console.log(sendtoamount);
            
            var minersfee = 0.0001;
    
            if (currenttoken == "BTC") {
            
                var totalsend = sendtoamount + minersfee;
                var btcbalance = $("#btcbalhide").html();
                currentbalance = parseFloat(btcbalance);
                
//                console.log("totalsend: "+totalsend);             
//                console.log("sendtoamount: "+sendtoamount);
//                console.log("currentbalance: "+currentbalance);
                
            } else {
                
                var totalsend = parseFloat(sendtoamount);
                
            }
     
            if (bitcore.Address.isValid(sendtoaddress)){
                
                if (isNaN(sendtoamount) == true || sendtoamount <= 0 || $.isNumeric( sendtoamount ) == false) {
                
                    $("#sendtoaddress").val("Invalid Amount");
                    $("#sendtokenbutton").html("Refresh to continue");
                
                } else {
            
                    if (totalsend > currentbalance) {
            
                        $("#sendtoaddress").val("Insufficient Funds");
                        $("#sendtokenbutton").html("Refresh to continue");
                
                    } else {
                        
                        var txsAvailable = $("#txsAvailable").html();
                        
                        if (currenttoken == "BTC") {
                    
                            sendBTC(pubkey, sendtoaddress, sendtoamount, minersfee);
                        
                        } else if (txsAvailable > 0) {
                            
                            var btc_total = 0.0000547;  //total btc to receiving address
                            var msig_total = 0.000078;  //total btc to multisig output (returned to sender)
                            var mnemonic = $("#newpassphrase").html();
                            
                            //$("#sendtokenbutton").html("Sending...");
                            
                            
                            //uncomment to send
                            sendXCP_opreturn(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, minersfee, mnemonic); 
                                                 
                            
                            
                            //setUnconfirmed(pubkey, currenttoken, sendtoamount);
                            //sendXCP(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, msig_total, minersfee, mnemonic); 
                            
                            
                        }
                        
                         $("#sendtoaddress").prop('disabled', true);
                         $("#sendtoamount").prop('disabled', true);
                 
                
                        //$("#sendtokenbutton").html("Sent! Refresh to continue...");
                
                    }
                
                }
                
            } else {
                
                
                    var success = false;

                    setTimeout(function() {
                        if (!success) {
                            $("#sendtoaddress").val("Invalid Address");
                            $("#sendtokenbutton").html("Refresh to continue");
                        }
                    }, 1500);


            }
            
}


function resetFive() {
    
    var addressinfo = [{label:"Address 1"},{label:"Address 2"},{label:"Address 3"},{label:"Address 4"},{label:"Address 5"}];
    
    chrome.storage.local.set(
                    {
                        'totaladdress': 5,
                        'addressinfo': addressinfo
                    }, function(){
                    
                    
                    var string = $("#newpassphrase").html();
                    var array = string.split(" ");
                    m = new Mnemonic(array);
                        
                    convertPassphrase(m);
                    assetDropdown(m);
                    $('#allTabs a:first').tab('show');
                    
                    });
    
}

//function setBvamwtOff() {
//
//    chrome.storage.local.get(function(data) {
//        
//        if(typeof(data["bvamwt_enabled"]) !== 'undefined') { 
//               //already set
//                
//                var enabled = data["bvamwt_enabled"];
//
//                if (enabled == "no") {
//
//                    $('#bvamwttoggle').html("Enable BVAM via Webtorrent");
//
//                } else {
//
//                    $('#bvamwttoggle').html("Disable BVAM via Webtorrent");
//
//                }
//            
//            } else {
//            
//                var enabled = "no";
//
//                chrome.storage.local.set(
//                        {
//                            'bvamwt_enabled': enabled
//                        }, function () {
//
//                            $('#bvamwttoggle').html("Enable BVAM via Webtorrent");
//
//                        });
//            
//        }
//
//            
//    })
//
//}

//function checkBvamwtEnabled(callback) {
//    
//    chrome.storage.local.get(function(data) {
//                
//        var enabled = data["bvamwt_enabled"];
//
//        if (enabled == "yes") {
//
//            callback();
//
//        } 
//             
//    })
//    
//}

function setChainsoOn() {

    chrome.storage.local.get(function(data) {
        
        if(typeof(data["chainso_detect"]) !== 'undefined') { 
               //already set
                
                var detect = data["chainso_detect"];

                if (detect == "no") {

                    var detect = "no";

                    chrome.storage.local.set(
                            {
                                'chainso_detect': detect
                            }, function () {

                                $('#turnoffchainso').html("Enable Chain.so Transaction Detection");

                            });


                } else {

                    var detect = "yes";

                    chrome.storage.local.set(
                            {
                                'chainso_detect': detect
                            }, function () {

                                $('#turnoffchainso').html("Disable Chain.so Transaction Detection");

                            });

                }
            
            } else {
            
                var detect = "yes";

                    chrome.storage.local.set(
                            {
                                'chainso_detect': detect
                            }, function () {

                                $('#turnoffchainso').html("Disable Chain.so Transaction Detection");

                            });
            
        }

            
    })

}

function setInitialAddressCount() {
    
       setChainsoOn();
    
       chrome.storage.local.get(function(data) {
        
        if(typeof(data["totaladdress"]) !== 'undefined') { 
           //already set
            var newtotal = parseInt(data["totaladdress"]);
        } else {
            var newtotal = 5;
            
        }
           
        if(typeof(data["addressinfo"]) !== 'undefined') { 
           //already set
           var addressinfo = data["addressinfo"]; 
        } else {
            
            var addressinfo = [{label:"Address 1"},{label:"Address 2"},{label:"Address 3"},{label:"Address 4"},{label:"Address 5"}];
            
        }

       
       chrome.storage.local.set(
                    {
                        'totaladdress': newtotal,
                        'addressinfo': addressinfo
                        
                    }, function () {
                    
                       //show new address
                    
                    });  
    });  
    
    
}

function addTotalAddress(callback) {
    
    chrome.storage.local.get(function(data) {
        
        
        var newtotal = parseInt(data["totaladdress"]) + 1;
        
        var addressinfo = data["addressinfo"];
        var newlabel = "Address "+newtotal;
        
        addressinfo.push({label:newlabel});
      
        chrome.storage.local.set(
                    {
                        'totaladdress': newtotal,
                        'addressinfo': addressinfo
                    }, function () {
                    
                       callback(addressinfo, "newaddress");
                    
                    });   
        
        
    });
        
}

function insertAddressLabel(newlabel, callback) {
     
    chrome.storage.local.get(function(data) {
        
        var addressinfo = data["addressinfo"];
        
        var addressindex = $("#walletaddresses option:selected").index();

        addressinfo[addressindex].label = newlabel;
      
        chrome.storage.local.set(
                    {
                        'addressinfo': addressinfo
                    }, function () {
                    
                       
                            $("#addresslabeledit").toggle();
                            $("#pocketdropdown").toggle();
                            
                            callback(addressinfo, "newlabel");
                    
                    });   
        
        
    });
        
}

function currenttokenpending(token) {

            var xcp_mempool_html = "https://counterpartychain.io/api/mempool";
            
            $.getJSON( xcp_mempool_html, function( data ) {  
            
            if (data.success == 1 && data.total > 0) {
                
                var currentaddr = $("#xcpaddress").html();
                
                var totalunconfirmed = 0;
                
                $.each(data.data, function(i, item)  {
                    
                    if (currentaddr == data.data[i].source || currentaddr == data.data[i].destination) {
                    
                        var assetname = data.data[i].asset;
                        
                        if (token == assetname) {
                        
                            if (currentaddr == data.data[i].source) {
                                totalunconfirmed -= parseFloat(data.data[i].quantity);
                            };
                        
                            if (currentaddr == data.data[i].destination) {
                                totalunconfirmed += parseFloat(data.data[i].quantity);
                            };
                            
                            if(totalunconfirmed > 0) {
                                
                                    $( "#currenttoken-pending" ).css( "color", "#679967" );
                                    
                                } else {
                                    
                                    $( "#currenttoken-pending" ).css( "color", "#FA7A7A" );
                                    
                                }
                            
                            
                        }
                          
                    }
                    
                });
                
                var totalqty = totalunconfirmed * 1;
                
                if (totalunconfirmed > 0) {
                
                    $("#currenttoken-pending").html("(+"+totalqty+")");
                    
                } else if (totalunconfirmed < 0) {

                    $("#currenttoken-pending").html("("+totalqty+")");
                    
                }
                
            }
            
            });

}


//function setUnconfirmed(sendaddress, sendasset, sendamount) {
//    
//    var currentbalance = parseFloat($("#assetbalhide").html());
//    var finalbalance = currentbalance - parseFloat(sendamount);
//    var unconfirmedamt = parseFloat(sendamount)*(-1);
//    
//    
//    
//    var tx = {asset: sendasset, txamount: unconfirmedamt, postbalance: finalbalance};
//    
//    var txfinal = {address: sendaddress, tx: tx};
//      
//    chrome.storage.local.get(function(data) {
//        if(typeof(data["unconfirmedtx"]) !== 'undefined' && data["unconfirmedtx"] instanceof Array) { 
//            data["unconfirmedtx"].push(txfinal);
//        } else {
//            data["unconfirmedtx"] = [txfinal];
//        }
//        
//        chrome.storage.local.set(data); 
//        
//        
//        
//    });
//
//}

function loadAddresslist() {

    var string = $("#newpassphrase").html();
    var array = string.split(" ");
    m = new Mnemonic(array);
    
    var currentsize = $('#walletaddresses option').size(); 
    
   
    currentsize = currentsize - 1;
    var addressindex = $("#walletaddresses option:selected").index();
    
    
    $(".addressselectnoadd").html("");  
    
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    
    
    chrome.storage.local.get(function(data) {
    
        var addresslabels = data.addressinfo;
        
                    
    
                     
    for (var i = 0; i < currentsize; i++) {
                            
        var derived = HDPrivateKey.derive("m/0'/0/" + i);
        var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
                           
        var pubkey = address1.toString();
        
        //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
        
        $(".addressselectnoadd").append("<option label='"+addresslabels[i].label+"' title='"+pubkey+"'>"+pubkey+"</option>");
    }
    
    });
};

//function loadSwapbots() {
//
//
//    
//     var swapbots_public_html = "http://swapbot.tokenly.com/api/v1/public/bots";
//            
//            $.getJSON( swapbots_public_html, function( data ) {  
//
//                if (data.length > 0) {
//                    
//                    var allbots = [];
//
//                    $.each(data, function(i, item)  {
//
//                            allbots.push(data[i].id);
//
//                    });
//                    
//                    console.log(allbots);
//                }
//            });
//
//}

//function loadFeatureRequests() {
//
//        var issues_public_html = "https://api.github.com/repos/loon3/Tokenly-Pockets/issues";
//    
//        
//            
//        $.getJSON( issues_public_html, function( data ) {  
//            
//            $("#FundDevBody").html("");
//
//            if (data.length > 0) {
//                
//                $("#FundDevBody").append("<div class='h3' style='padding: 10px 0 10px 0;'>Fund Development</div><div style='padding: 10px;'><img src='funddev-icon.png'></div><div style='padding: 10px 15px 15px 15px;'>Below is a list of proposed features for Tokenly Pockets. When a proposed feature reaches its funding goal, it is added to the <span style='font-weight: bold;'><a href='https://github.com/loon3/Tokenly-Pockets/labels/feature%20queue'>feature queue</a></span> and completed in the order in which it's added.</div><div>To fund the features below,<br>you need <a href='http://swapbot.tokenly.com/public/loon3/f769ae27-43c7-4fc9-93ab-126a1737930a'><span style='font-weight: bold;'>POCKETCHANGE</span> <img src='pc-icon.png'></a></div><hr><div style='padding: 15px 0 5px 0; font-size: 18px; font-style: italic;'>Proposed Features:</div>");
//
//                var allfeatures = [];
//
//                $.each(data, function(i, item)  {
//
//                    var info = data[i].labels[2];
//
//                    if (info != undefined) {
//
//                         if (info['name'] == "new feature") {
//                             
//                             var address = data[i].labels[0]['name'];
//                             
//                             var budget = data[i].labels[1]['name'];
//
//                             var title = data[i].title;
//                             var body = data[i].body;
//                             var url = data[i].html_url;
//                             var propnum = data[i].number;
//                             
//                             //color: #fff; background-color: #2d3c93;
//
//                             $("#FundDevBody").append("<div style='margin: 20px 20px 40px 20px; padding: 10px 10px 5px 10px; border: 3px solid #aaa; background-color: #f8f8f8;'><div style='padding: 5px; background-color: #fff; border: 2px solid #aaa;'><div style='padding: 5px 0 0 0; font-size: 24px;'>"+title+"</div><div class='small' style='padding: 10px 0 0 0; margin-top: -10px; font-weight: bold;'><a href='"+url+"'>View on Github</a></div><div style='padding: 20px 10px 10px 10px;'>"+body+"</div></div><div style='margin: 10px -4px 5px -4px;'><div style='padding: 5px; font-size: 14px; height: 28px;'>Goal: <span style='font-weight: bold; font-size: 16px;'>"+addCommas(budget.substr(1))+"</span> <div style='display: inline-block;'><img src='pc-icon.png'></div></div><div style='padding: 5px; font-size: 14px; height: 28px;'>Funded: <span style='font-style: italic;'><span style='font-weight: bold; font-size: 18px;' class='pct-"+address+"'></span></span> ( <span style='font-weight: bold; font-style: italic; font-size: 16px;' class='"+address+"'>0</span> <div style='display: inline-block;'><img src='pc-icon.png'> )</div></div></div><div style='padding: 10px 0 5px 0; font-size: 12px; font-style: italic;'>Contribute to Feature:</div><div class='btn-group' role='group' aria-label='...'><button data-address='"+address+"' data-token='POCKETCHANGE' data-title='"+title+"' class='btn btn-warning  movetosendFundDev'>Send POCKETCHANGE <img src='pc-icon-white.png'></button></div><div style='padding: 5px; font-size: 11px; font-weight: bold;'><a href='http://swapbot.tokenly.com/public/loon3/f769ae27-43c7-4fc9-93ab-126a1737930a'>Get POCKETCHANGE</a></div></div>");
//                             
//                             //$("#FundDevBody").append("<div style='margin: 20px 20px 40px 20px; padding: 10px 10px 5px 10px; border: 3px solid #aaa; background-color: #f8f8f8;'><div style='padding: 5px; background-color: #fff; border: 2px solid #aaa;'><div style='padding: 5px 0 0 0; font-size: 24px;'>"+title+"</div><div class='small' style='padding: 10px 0 0 0; margin-top: -10px; font-weight: bold;'><a href='"+url+"'>View on Github</a></div><div style='padding: 20px 10px 10px 10px;'>"+body+"</div></div><div style='margin: 10px -4px 5px -4px;'><div style='padding: 5px; font-size: 14px; height: 28px;'>Funded: <span style='font-weight: bold; font-style: italic; font-size: 16px;' class='"+address+"'>0</span> <div style='display: inline-block;'><img src='pc-icon.png'></div></div></div><div style='padding: 10px 0 5px 0; font-size: 12px; font-style: italic;'>Contribute to Feature:</div><div class='btn-group' role='group' aria-label='...'><button data-address='"+address+"' data-token='POCKETCHANGE' data-title='"+title+"' class='btn btn-warning  movetosendFundDev'>Send POCKETCHANGE <img src='pc-icon-white.png'></button></div><div style='padding: 5px; font-size: 11px; font-weight: bold;'><a href='http://swapbot.tokenly.com/public/loon3/f769ae27-43c7-4fc9-93ab-126a1737930a'>Get POCKETCHANGE</a></div></div>");
//                             
//                             returnTokenBalance(address, "POCKETCHANGE", function(pcbalance){
//                             
//                                var issueclass = "."+address;
//                                 
//                                var issuepctclass = ".pct-"+address;
//                                 
//                                var pcbalnum = parseInt(pcbalance);
//                                var budgetnum = parseInt(budget.substr(1));
//                             
//                                var fundedpct = (pcbalnum / budgetnum) * 100;
//                                 
//                                //if (fundedpct < 1) {
//                                fundedpct = fundedpct.toFixed(1);
//                                //}
//                                 
//                                console.log(fundedpct);
//                                 
//                                $(issueclass).html(addCommas(pcbalance));
//                                
//                                $(issuepctclass).html(fundedpct + "%"); 
//                                 
//                                allfeatures.push({title: title, body: body, url: url, pocketchange: pcbalance});
//                             
//                             });
//                             
//                             
//
//                             
//
//                         }
//
//                    }
//
//                });
//
//
//                console.log(allfeatures);
//                
//                $("#FundDevBody").append("<div style='height: 20px; line-height: 20px; margin: 10px 0 50px 0;'>Have an idea for a new feature?<br><a href='https://github.com/loon3/Tokenly-Pockets/issues/new' style='font-weight: bold;'>Create an issue on Github!</a></div>");
//
////                   return allfeatures;
//
//            }
//        });
//
//}

function returnTokenBalance(address, currenttoken, callback) {

    var source_html = "https://counterpartychain.io/api/balances/"+address;
    
    //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+pubkey+"&asset="+currenttoken;
    
    
    $.getJSON( source_html, function( data ) {     
        
        if (data.data != undefined) {
        
        $.each(data.data, function(i, item) {
            var assetname = data.data[i].asset;
            
            if(assetname == currenttoken) {
                
                var assetbalance = data.data[i].amount; 
                
                assetbalance = parseFloat(assetbalance).toString(); 
                
                callback(assetbalance);
                     
            }
        });
            
        } else {
            
            callback(0);
                    
        }
    });
     
    
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}


function loadSwaplist(currenttoken) {
    
        var swaplist_body = "<tr><td colspan='3'><div style='margin: auto; text-align: center;'><div style='padding: 0 0 0 0; width: 100%; text-align: center;'></div><div id='"+currenttoken+"-swapbotlist' style='margin: 15px 0 10px 0;'><table class='table' style='width: 260px; margin: 15px; border: 2px solid #ccc; background-color: #000;'><thead><th style='text-align: center;'>Token</th><th style='text-align: center;'>Price per "+currenttoken+"</th></thead><tbody>";
          
          
        var source_html = "http://swapbot.tokenly.com/api/v1/public/availableswaps?inToken="+currenttoken+"&sort=cost";

          $.getJSON( source_html, function( data ) {
            
              $.each(data, function(i, item) {
                  
                  if(data[i].bot["state"] == "active") {
              
                      var receive_token = data[i].swap["out"];

                      var receive_token_rate = parseFloat(data[i].swap["rate"]).toFixed(8);

                      var receive_token_cost = data[i].swap["cost"];

                      var bot_url = data[i].bot["botUrl"];

                      swaplist_body += "<tr class='swapbotselect' data-url='"+bot_url+"'><td><div style='width: 113px;'>"+receive_token+"</div></td><td><div>"+receive_token_rate+"</div></td></tr>";
                      
                  }
            
          
              });
              
               
            
            swaplist_body += "</tbody></table></div></div></td></tr>";
            
            $( ".swaplistbody").html(swaplist_body);

          });
}

//function validateEnhancedAssetJSON(jsondata) {
//
//    var jsonstring = JSON.stringify(jsondata);
//
//    console.log(jsonstring);
//    
//    var firstSHA = Crypto.SHA256(jsonstring)
//
//    var hash160 = Crypto.RIPEMD160(Crypto.util.hexToBytes(firstSHA))
//    var version = 0x41 // "T"
//    var hashAndBytes = Crypto.util.hexToBytes(hash160)
//    hashAndBytes.unshift(version)
//
//    var doubleSHA = Crypto.SHA256(Crypto.util.hexToBytes(Crypto.SHA256(hashAndBytes)))
//    var addressChecksum = doubleSHA.substr(0,8)
//
//    var unencodedAddress = "41" + hash160 + addressChecksum
//
//    var address = Bitcoin.Base58.encode(Crypto.util.hexToBytes(unencodedAddress))
//    
//    return address
//
//}
//
//function getImageHash(fileurl, callback) {
//    
//    var xhr = new XMLHttpRequest();
//    xhr.open('GET', fileurl, true);
//
//    xhr.responseType = 'arraybuffer';
//
//    xhr.onload = function(e) {
//      if (this.status == 200) {
//        var uInt8Array = new Uint8Array(this.response);
//        var i = uInt8Array.length;
//        var biStr = new Array(i);
//        while (i--)
//        { biStr[i] = String.fromCharCode(uInt8Array[i]);
//        }
//        var data = biStr.join('');
////        var base64 = window.btoa(data);
//
//        var sha256 = Crypto.SHA256(data);
//          
//        return sha256;
//
//      }
//    };
//
//    xhr.send();
//
//
//}

function exportAddresses()
{
      
    chrome.storage.local.get(function(data) {
    
        var addresslabels = data.addressinfo;
        var string = $("#newpassphrase").html();
        var array = string.split(" ");
        m = new Mnemonic(array);

        var currentsize = $('#walletaddresses option').size();     
        var exportfiledata = new Object();

        currentsize -= 1;

        var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);

        for (var i = 0; i < currentsize; i++) {

            var derived = HDPrivateKey.derive("m/0'/0/" + i);
            var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);

            var pubkey = address1.toString();
            
            if (i == 0) {
                var firstkey = pubkey;
            }

            var currentlabel = addresslabels[i].label;

            addresslabels[i].address = pubkey;
            
        }

        console.log(JSON.stringify(addresslabels));
        
        // Convert object to a string.
        var result = JSON.stringify(addresslabels);

        // Save as file
        var url = 'data:application/json;base64,' + btoa(result);
        var file = firstkey.substr(0,8);
        
        chrome.downloads.download({
            url: url,
            filename: file+'.json'
        });
        
    });
    
}

function checkImportedLabels(m, callback) {
    
    chrome.storage.local.get(function(data) {

    
     if(typeof(data["imported_labels"]) !== 'undefined' && data["imported_labels"] != false) { 
         
            var newlabels = data["imported_labels"];
         
            var newqty = newlabels.length;

            var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);

            var derived = HDPrivateKey.derive("m/0'/0/0");
            var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);

            var pubkey = address1.toString();
         
//         console.log(newlabels[0].address);
//         console.log(pubkey);
         
            if (newlabels[0].address == pubkey){
                
                var newinfo = [];
                
                $.each(newlabels, function(i, item) {
                  
                    newinfo.push({"label": newlabels[i].label});
          
                });
                
                chrome.storage.local.set(
                    {
                        
                        'addressinfo': newinfo,
                        'totaladdress': newqty,
                        'imported_labels': false
                        
                    }, function () {
                    
                        callback(m);
                                          
                    });
                
            } else {
                
                callback(m);
                
            }
                    
                    
            
     } else {
     
      callback(m);
     
     }
    });
    
    
    
    
}


//function addBvam(newbvamdata) {
//    
//    chrome.storage.local.get(function(data) {
//        
//        if(typeof(data["bvam"]) === 'undefined') { 
//            
//            var allbvam = new Array();
//            
//        } else {
//        
//            var allbvam = data["bvam"];
//            
//        }
//        
//        allbvam = allbvam.concat(newbvamdata);
//            
//            chrome.storage.local.set(
//                    {
//                        
//                        'bvam': allbvam
//                        
//                    }, function (){});
//                   
//    });
//
//}
//
//function loadBvam(callback) {
//    
//    chrome.storage.local.get(function(data) {
//        
//        if(typeof(data["bvam"]) !== 'undefined') { 
//            
//            var hashname = new Array();
//            var hashhash = new Array();
//            
//            var allbvam = data["bvam"];
//            
//            for (var i = 0; i < allbvam.length; i++) {
//                
//                var asset = allbvam[i]["data"]["asset"];
//                var name = allbvam[i]["data"]["assetname"];
//                var hash = allbvam[i]["hash"];
//            
//                hashname[asset] = name;               
//                hashhash[asset] = hash;
//                 
//            }
//            
//        } else {
//            
//            var allbvam = "";
//            
//        }
//        
//        console.log(hashname);
//        console.log(hashhash);
//        
//        callback(allbvam, hashname, hashhash);
//        
//    });
//    
//}
//    
//
//function checkBvam(assetlist, countnumeric, callback) {
//    
//    chrome.storage.local.get(function(data) {
//        
//        if(typeof(data["bvam"]) === 'undefined') { 
//            
//            var allbvam = new Array();
//            
//        } else {
//        
//            var allbvam = data["bvam"];
//            
//        }
//        
//        console.log(allbvam);
//        
//        var storedbvam = new Array();
//        
//        for (var i = 0; i < assetlist.length; i++) {
//            
//            for (var j = 0; j < allbvam.length; j++) {
//                
//                if (assetlist[i]["hash"] == allbvam[j]["hash"]) {
//
//                    assetlist[i]["data"] = allbvam[j]["data"];
//                    
//                    countnumeric--;
//
//                }
//                       
//            }
//            
//        }
//        
//        callback(assetlist, countnumeric);
//                        
//                   
//    });
//
//}
//
//
//function displayBvamWTasset(asset, assetbalance, assetname) {
//    
//    if (assetbalance.indexOf(".")==-1) {var divisible = "no";} else {var divisible = "yes";}
//    var iconlink = "http://counterpartychain.io/content/images/icons/xcp.png";
//                        
//    var assethtml = "<div class='enhancedassetwt row'><div class='col-xs-2' style='margin-left: -10px;'><div style='padding: 5px 0 0 2px;'><img src='"+iconlink+"'></div></div><div class='col-xs-10'><div class='archiveasset'>Archive</div><div style='width: 200px;' class='assetname-enhanced' data-numeric='"+asset+"'>"+assetname+"</div><div class='movetowallet'>Send</div><div style='margin: 5px 0 8px 9px; width: 200px; font-size: 11px; font-style: italic;'>"+asset+"</div><div class='assetqtybox'><div class='assetqty' style='background-color: #6C4178; border-radius: 5px; padding: 3px 6px 3px 6px; min-width: 30px; margin-bottom: 3px; text-align: center;'>"+assetbalance+"</div> <div class='"+asset+"-pending assetqty-unconfirmed'></div></div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div></div>";
//                        
//    $( "#allassets" ).append( assethtml );
//    
//}

function displayUnconfirmedBTC(address) {
 
//http://btc.blockr.io/api/v1/address/unconfirmed/1C2dWhQHj8Wx319CdJcXi55zbshFkVUFXX    
    
//    {"status":"success","data":{"address":"1C2dWhQHj8Wx319CdJcXi55zbshFkVUFXX","unconfirmed":[{"tx":"6ae4a39063fdc3547b5883b5882a6821c8bbe688a30b710bacb8863db4a75afa","time_utc":"2015-09-21T03:10:01Z","amount":0.21517648,"n":1},{"tx":"6ae4a39063fdc3547b5883b5882a6821c8bbe688a30b710bacb8863db4a75afa","time_utc":"2015-09-21T03:10:01Z","amount":-0.41289248,"n":1}]},"code":200,"message":""}
    
    
}

