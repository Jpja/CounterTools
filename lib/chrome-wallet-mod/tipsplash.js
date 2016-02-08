function progressbar(valeur, callback) {

  $('.progress-bar').css('width', valeur+'%').attr('aria-valuenow', valeur);    
   
  callback();
}

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

function getExtStorage()
{
    chrome.storage.local.get(["passphrase", "encrypted", "firstopen"], function (data)
    {
        if ( data.firstopen == false ) {
        
            if ( data.encrypted == false) {
            
                $("#pinsplash").hide();
                $(".hideEncrypted").hide();
                $(".progress").show();
                
                $("#acceptedbox").hide();
                  
                existingExtPassphrase(data.passphrase);
            
            } else if ( data.encrypted == true) {
            
                $(".progress").hide();
                $(".hideEncrypted").hide();
                $("#pinsplash").show();
                $("#acceptedbox").hide();
               
            } 
       
        } else {
            
            $("#tipsendcomplete").html("<div align='center'><div style='padding: 50px 0 30px 0; font-size: 18px; width: 480px;'>Click on the Tokenly Pockets icon to the right of your browser address bar to set up your wallet.</div><div><img src='setupss.png'></div></div>");
            
            $("#yourtxid").hide();
        }
    });
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

function existingExtPassphrase(string) {
    
    string = string.replace(/\s{2,}/g, ' ');
    var array = string.split(" ");
    m2 = new Mnemonic(array);
    
    $("#passphrasefromstorage").html(string);
       
    
//    convertPassphrase(m2);
    assetDropdown(m2);
//    
//    $('#allTabs a:first').tab('show')
}

function convertPassphrase(m){
    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
    var derived = HDPrivateKey.derive("m/0'/0/" + 0);
    var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
    var pubkey = address1.toString();    
    
//    $("#xcpaddressTitle").show();
//    $("#xcpaddress").html(pubkey);
    
//    getPrimaryBalance(pubkey);
    
}

//function assetDropdown(m)
//{
//    $(".addressselect").html("");
//    
//    var HDPrivateKey = bitcore.HDPrivateKey.fromSeed(m.toHex(), bitcore.Networks.livenet);
//                
//                 
//    for (var i = 0; i < 5; i++) {
//                            
//        var derived = HDPrivateKey.derive("m/0'/0/" + i);
//        var address1 = new bitcore.Address(derived.publicKey, bitcore.Networks.livenet);
//                           
//        var pubkey = address1.toString();
//                            
//        //$(".addressselect").append("<option label='"+pubkey.slice(0,8)+"...'>"+pubkey+"</option>");
//        
//        $(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
//        
//        if (i == 0) {
//            $("#xcpaddress").html(pubkey);
//            getAssetsandBalances(pubkey);
//            
//        }
//    }
//}


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
  
        $(".addressselect").append("<option label='"+addresslabels[i].label+" - "+pubkey.slice(0,12)+"...'>"+pubkey+"</option>");

            
        if (i == 0) {
            $("#xcpaddress").html(pubkey);
            getAssetsandBalances(pubkey);
            
        }
        //$(".addressselect").append("<option label='"+pubkey+"'>"+pubkey+"</option>");
    }
    
    //$(".addressselect").append("<option label='Add New Address'>add</option>");
        
    }); 
                 
    
}





function getAssetsandBalances(add) {
    
    $( "button.dropdown-toggle" ).removeClass( "disabled" );
    
    
    progressbar(10, function(){});
    
    getBTCBalance(add, function(){
    
        progressbar(60, function(){});
        //var source_html = "http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+add;

        var source_html = "https://counterpartychain.io/api/balances/"+add;
        var xcp_source_html = "http://counterpartychain.io/api/address/"+add;

        $( ".assetselect" ).html("");
        $("#assetdisplayed").html("");

        
        var thisurl = window.location.href;
        var tokensfromurl = parseURLParams(thisurl);
        var spectokens = tokensfromurl["tokens"][0].toUpperCase();
        var tokenarray = spectokens.split(",");

        console.log(tokenarray);
        
        if (tokenarray[0] == "UNDEFINED") {
        
            tokenarray[0] = "BTC";
        
        }
        if ($("#acceptedtokens").html().length == 0) {
            $.each(tokenarray, function(i, item) {


                    if (i > 0 ){
                        $("#acceptedtokens").append(", ");
                    }

                    $("#acceptedtokens").append(tokenarray[i]);


            });
        }

        $.getJSON( xcp_source_html, function( data ) {  
            
            progressbar(70, function(){});
            //var assetbalance = parseFloat(data.data[0].balance) + parseFloat(data.data[0].unconfirmed_balance); 

            var xcpbalance = parseFloat(data.xcp_balance).toFixed(8);    

            if (xcpbalance == 'NaN' || typeof xcpbalance === 'undefined') {
                xcpbalance = 0;
            }

            $.getJSON( source_html, function( data ) {
                
                progressbar(85, function(){});

                //$(".assetselect").append("<option label='BTC'>BTC - Balance: "+btcbalance+"</option>");

                if (tokenarray[0] == "ALL" || jQuery.inArray("BTC", tokenarray) !== -1) {

                    var btcbalance = $("#btcbalhide").html();

                    var btchtml = "<div class='btcasset row linkpointer' style='width: 315px;'><div class='col-xs-2' style='margin-left: -10px;'><img src='bitcoin_48x48.png'></div><div class='col-xs-10'><div class='assetname'>BTC</div><div>Balance: <span class='assetqty'>"+btcbalance+"</span></div></div></div>";

                    $("#assetdisplayed").html(btchtml);

                    $(".assetselect").append("<li role='presentation'><a class='singleasset' role='menuitem' tabindex='-1'>"+btchtml+"</a></li>");

                }
                //console.log("isxcp: "+spectokens);

                //if (isaddressxcp == "true") {



                if (xcpbalance != 0) {
                    
                    if (tokenarray[0] == "ALL" || jQuery.inArray("XCP", tokenarray) !== -1) {

                        var xcpicon = "http://counterpartychain.io/content/images/icons/xcp.png";

                        //$("#tokendropdown").show();

                        var xcphtml = "<div class='row linkpointer' style='width: 315px;'><div class='col-xs-2' style='margin-left: -10px;'><img src='"+xcpicon+"'></div><div class='col-xs-10'><div class='assetname'>XCP</div><div>Balance: <span class='assetqty'>"+xcpbalance+"</span></div><div id='assetdivisible' style='display: none;'>yes</div></div></div>";

                        var assetdisplayed = $("#assetdisplayed").html();
                        
                        if (assetdisplayed.length == 0) {
                            $("#assetdisplayed").html(xcphtml);
                        }
                        
                        $(".assetselect").append("<li role='presentation'><a class='singleasset' role='menuitem' tabindex='-1'>"+xcphtml+"</a></li>");

                    }
                }

    //                if (data.data.length == 0) {
    //                    $(".assetselect").append("<li role='presentation'><div style='padding: 10px;'>You have no tokens at this address.</div></li>");
    //                    $("#tokendropdown").hide();
    //                }
                
                var assetsataddress = parseFloat(data.total);

                if (assetsataddress > 0){
                
                    $.each(data.data, function(i, item) {

                        var assetname = data.data[i].asset;

                        if (assetname.charAt(0) != "A") {

                            if (tokenarray[0] == "ALL" || jQuery.inArray(assetname, tokenarray) !== -1) {

                                var assetbalance = data.data[i].amount; //.balance for blockscan
                                if (assetbalance.indexOf(".")==-1) {var divisible = "no";} else {var divisible = "yes";}

                                var iconname = assetname.toLowerCase();
                                var iconlink = "http://counterpartychain.io/content/images/icons/"+iconname+".png";

                                //$("#tokendropdown").show();

                                var assethtml = "<div class='row linkpointer' style='width: 315px;'><div class='col-xs-2' style='margin-left: -10px;'><img src='"+iconlink+"'></div><div class='col-xs-10'><div class='assetname'>"+assetname+"</div><div>Balance: <span class='assetqty'>"+assetbalance+"</span></div><div id='assetdivisible' style='display: none;'>"+divisible+"</div></div></div>";


                                $(".assetselect").append("<li role='presentation'><a class='singleasset' role='menuitem' tabindex='-1'>"+assethtml+"</a></li>");

                                var assetdisplayed = $("#assetdisplayed").html();

                                if (assetdisplayed.length == 0) {

                                    $("#assetdisplayed").html(assethtml);

                                }

                            }

                        } 

//                        $("#fulldropdown").css( "display", "block" );
//                        //$("#fulldropdown").show();
//                        $("#dropdown-working").css("display", "none");
//
//
//                        $( "#walletaddresses" ).removeProp( "disabled" );    

                    });
                    
                }
                
                var displayedassetname = $("#assetdisplayed").find(".assetname").text();
                $("#sendtokenbutton").html("Send "+displayedassetname);
                
                $("#fulldropdown").css( "display", "block" );
                //$("#fulldropdown").show();
                $("#dropdown-working").css("display", "none");


                $( "#walletaddresses" ).removeProp( "disabled" ); 
                
                
                
                
                var assetdisplayed = $("#assetdisplayed").html();
                
                if (assetdisplayed.length == 0) {

                        $("#btcbalance").html("<div style='font-size: 12px;'>You do not have accepted tokens in this Pocket.</div>");        
                        $("#tokendropdown").hide(); 

                }
                
                if ($(".assetselect li").length == 1 && tokenarray[0] != "ALL") {

                    $( "button.dropdown-toggle" ).addClass( "disabled" );
                    $( "button.dropdown-toggle" ).css( "opacity", "1" );

                }
                
                progressbar(100, function(){
                
                    setInterval(function(){
                        $(".progress").hide();
                        $(".hideEncrypted").show();
                        $("#acceptedbox").show();
                        
                    }, 500);
                
                    
                });

            });

        });
    });
}

function getBTCBalance(pubkey, callback) {

    
    //var source_html = "https://chain.so/api/v2/get_address_balance/BTC/"+pubkey;
    
    var source_html = "http://btc.blockr.io/api/v1/address/info/"+pubkey;  //blockr
    
    //var source_html = "https://insight.bitpay.com/api/addr/"+pubkey+"/balance";
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+pubkey+"/balance";

    //$.getJSON( source_html, function( data ) { //insight
    $.getJSON( source_html, function( apidata ) {  //blockr

        //var bitcoinparsed = parseFloat(data) / 100000000; //insight
        var bitcoinparsed = parseFloat(apidata.data.balance); //blockr
        //var bitcoinparsed = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance)).toFixed(8); //chainso
         
        $("#btcbalhide").html(bitcoinparsed);
        
        //var transactions = (parseFloat(data) / 15470) ; //insight
        //var transactions = (parseFloat(data.data.confirmed_balance) + parseFloat(data.data.unconfirmed_balance))/ 0.0001547; //chainso
        var transactions = (parseFloat(apidata.data.balance) / 0.0001547) ; //blockr
        
        if (transactions < 1) {
            transactions = 0;
        }
        
        showBTCtransactions(transactions);
        
        callback();
             
    });
}



//function getBTCBalance(pubkey, callback) {
//    
//    var source_html = "https://insight.bitpay.com/api/addr/"+pubkey+"/balance";
//    //var source_html = "https://chain.localbitcoins.com/api/addr/"+pubkey+"/balance";
//    
//    $.getJSON( source_html, function( data ) { 
//        
//        var bitcoinparsed = parseFloat(data) / 100000000;     
//        
//        $("#btcbalhide").html(bitcoinparsed);
//        
//        var transactions = (parseFloat(data) / 15470) ;
//        
//        showBTCtransactions(transactions);
//        
//        callback();
//            
//    });
//}

function showBTCtransactions(transactions) {
    
    if (transactions == 0) {
              
        $("#btcbalance").html("<div style='font-size: 12px;'>Deposit bitcoin to send tokens from this address.<span id='txsAvailable' style='display: none;'>"+transactions.toFixed(0)+"</span></div>");        
        $("#tokendropdown").hide();        
    } else {
    
        $("#btcbalance").html("<div style='font-size: 12px;'>You can perform <span id='txsAvailable'>"+transactions.toFixed(0)+"</span> transactions</div>");
        $("#tokendropdown").show();
                
    }
        
            //var titletext = data + " satoshis";

            //$("#btcbalbox").prop('title', titletext);       
            $("#btcbalbox").show();
}


function sendtokenaction() {
    
            $("#sendtokenbutton").html("Sending...");
            $("#sendtokenbutton").prop('disabled', true);
            
            var currenttokenhtml = $("#assetdisplayed").find(".assetname");
            var currenttoken = currenttokenhtml.html();
            var assetbalance = $("#assetdisplayed").find(".assetqty");

            var currentbalance = assetbalance.html();
      
            var pubkey = $("#xcpaddress").html();
            //var currenttoken = $(".currenttoken").html();
            
            //var sendtoaddress = $("#sendtoaddress").html();
    
            var thisurl = window.location.href;
            var addressfromurl = parseURLParams(thisurl);
            var sendtoaddress = addressfromurl["address"][0];
    
            console.log(sendtoaddress);
    
            var sendtoamount_text = $("#sendtoamount").val();
            var sendtoamount = parseFloat(sendtoamount_text);
                       
            var isdivisible = $("#assetdisplayed").find("#assetdivisible");
    
            var divisible = isdivisible.text();
            
     
            if (bitcore.Address.isValid(sendtoaddress)){
                
                if (isNaN(sendtoamount) == true || sendtoamount <= 0 || $.isNumeric( sendtoamount ) == false) {
                
                    $("#sendtoamount").val("Invalid Amount");
                    $("#sendtokenbutton").html("Click to continue");
                    $("#sendtokenbutton").prop('disabled', false);
                
                } else {
                    
                    console.log(sendtoamount);
                    console.log(currentbalance);
            
                    if (sendtoamount > currentbalance) {
            
                        $("#sendtoamount").val("Insufficient Funds");
                        $("#sendtokenbutton").html("Click to continue");
                        $("#sendtokenbutton").prop('disabled', false);
                
                    } else {
                        
                        console.log(divisible);
                        
                        
                        
                        if(divisible == "no"){
            
                            sendtoamount = Math.floor(sendtoamount) / 100000000;
            
                        } 
            
                        console.log(sendtoamount);
                        
                        var txsAvailable = $("#txsAvailable").html();
                        
                        if (txsAvailable >= 1) {
                            
                            if (currenttoken == "BTC") {
                    
                                var minersfee = 0.0001;
                                sendBTCsplash(pubkey, sendtoaddress, sendtoamount, minersfee);
                        
                            } else {
                            
                                var btc_total = 0.0000547;  //total btc to receiving address
                                var minersfee = 0.0001;
                                var mnemonic = $("#passphrasefromstorage").html();

                                $("#sendtokenbutton").html("Sending...");

                                //sendXCP(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, msig_total, minersfee, mnemonic); 

                                sendXCP_opreturn(pubkey, sendtoaddress, currenttoken, sendtoamount, btc_total, minersfee, mnemonic); 

                                //setUnconfirmed(pubkey, currenttoken, sendtoamount);
                            }
                        }
                        
                         $("#sendtoaddress").prop('disabled', true);
                         $("#sendtoamount").prop('disabled', true);
                
                        //$("#sendtokenbutton").html("Sent! Refresh to continue...");
                
                    }
                
                }
                
            } else {
                
                
                    var success = false;

//                    var userid = $("#sendtoaddress").val().toLowerCase();
//
//                    $.getJSON( "https://letstalkbitcoin.com/api/v1/users/"+userid, function( data ) {
//
//                            success = true;
//                            $("#sendtoaddress").val(data.profile.profile["ltbcoin-address"]["value"]);
//                            sendtokenaction();
//
//                    });
//
//                    setTimeout(function() {
//                        if (!success) {
                            $("#sendtoamount").val("Invalid Address");
                            $("#sendtokenbutton").html("Click to continue");
                            $("#sendtokenbutton").prop('disabled', false);
//                        }
//                    }, 1500);


            }
            
}



function sendBTCsplash(add_from, add_to, sendtotal, transfee) {
    
    var source_html = "https://insight.bitpay.com/api/addr/"+add_from+"/utxo";     
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+add_from+"/utxo";
    
    var total_utxo = new Array();   
    var sendtotal_satoshis = parseFloat(sendtotal).toFixed(8) * 100000000;   
    //sendtotal_satoshis.toFixed(0);
    
    console.log(sendtotal_satoshis);
    sendtotal_satoshis = Math.round(sendtotal_satoshis);
    console.log(sendtotal_satoshis);
    
    //console.log("sendtotal_satoshis " + sendtotal_satoshis);
    
    var mnemonic = $("#passphrasefromstorage").html();
    
    var privkey = getprivkey(add_from, mnemonic);
    
    
    $.getJSON( source_html, function( data ) {
        
        var amountremaining = (parseFloat(sendtotal) + parseFloat(transfee));
        
        data.sort(function(a, b) {
            return b.amount - a.amount;
        });
        
        $.each(data, function(i, item) {
            
             var txid = data[i].txid;
             var vout = data[i].vout;
             var script = data[i].scriptPubKey;
             var amount = parseFloat(data[i].amount);
             
             amountremaining = amountremaining - amount;            
             amountremaining.toFixed(8);
    
             var obj = {
                "txid": txid,
                "address": add_from,
                "vout": vout,
                "scriptPubKey": script,
                "amount": amount
             };
            
             total_utxo.push(obj);
              
             //dust limit = 5460 
            
             if (amountremaining == 0 || amountremaining < -0.00005460) {                                 
                 return false;
             }
             
        });
        
        console.log(total_utxo);
        
        if (amountremaining < 0) {
            var satoshi_change = -(amountremaining.toFixed(8) * 100000000).toFixed(0);
        } else {
            var satoshi_change = 0;
        }
        
        console.log(satoshi_change);
        
        var transaction = new bitcore.Transaction();
            
        for (i = 0; i < total_utxo.length; i++) {
            transaction.from(total_utxo[i]);
        }
        
        transaction.to(add_to, sendtotal_satoshis);
            
        if (satoshi_change > 5459) {
            transaction.to(add_from, satoshi_change);
        }
        transaction.sign(privkey);

        var final_trans = transaction.serialize();
        
        console.log(final_trans);
        
        sendBTCpush(final_trans);
    });
       
}


