function create_new_assetid() {
         
        var assetid = "A111";
          
        for (var i = 1; i < 18; i++) {
            assetid += randomIntFromInterval(0,9);
        };
    
    //26^12 + 1 and 256^8
    
        var lowerlimit = BigIntegerSM(26).pow(12);
        lowerlimit = BigIntegerSM(lowerlimit).add(1);
    
        var upperlimit = BigIntegerSM(256).pow(8);
    
        console.log(BigIntegerSM.toJSValue(lowerlimit));
        console.log(BigIntegerSM.toJSValue(upperlimit));
        
        return assetid;
    
}

function is_asset_unique(assetid, quantity, divisible, description, callback){
    
    var source_html = "https://counterpartychain.io/api/asset/"+assetid;
    
    $.getJSON( source_html, function( data ) {
        
        console.log(data.success);
        
        if(data.success == 0) { //asset is unique
            
            callback(assetid);
            
        } else { //asset is not unique
            
            //setTimeout(create_asset_unique(quantity, divisible, description, function(){}), 2000);
            
            callback("error");
            
        }
        
    });
    
}


function create_asset_unique(assetid_new, quantity, divisible, description, callback){
    
    if (assetid_new == "A") {
    
        var newasset = create_new_assetid();
        
    } else {
        
        var newasset = assetid_new;
        
    }
    
    is_asset_unique(newasset, quantity, divisible, description, function(assetid_unique){
              
        if (assetid_unique != "error") {
            
            console.log("Unique Asset ID: "+assetid_unique);

            if (assetid_unique.charAt(0) == "A") {
            
                assetid_num = assetid_unique.substring(1);
                
            } else {
                
                assetid_num = assetid(assetid_unique);
                
                console.log(assetid_num);
                
                var assetnametest = assetname(assetid_num);
                
                console.log("Confirm Asset Name: "+assetnametest);
                
            }

//            
//            if (assetid_num <= 9007199254740992) { 
                      
                //var issuance_data = create_issuance_data(assetid_num, 1000, true, "testing 1-2-3");

                var issuance_data = create_issuance_data(assetid_num, quantity, divisible, description);

                console.log(issuance_data);
                console.log(issuance_data.length);

                callback(issuance_data);
                
//            } else {
//                
//                console.log("Asset ID is too large"); 
//                callback("error");
//                
//            }
            
        } else {
            
            callback("error");
            
        }
        
    });

}




function create_issuance_data(assetid, quantity, divisible, description) {
    
    //max 22 character description for single OP_CHECKMULTISIG output
    //divisible asset quantity must be less than 184467440737.09551615 and non-divisible less than 18446744073709551615 to be stored as an 8-byte hexadecimal
    
    if (divisible == true || divisible == "true") {
        var quantity_int = parseFloat(quantity).toFixed(8) * 100000000;
        var divisible_hex = "01000000000000000000";
    } else {
        var quantity_int = parseFloat(quantity); 
        var divisible_hex = "00000000000000000000";
    }
    
    quantity_int = Math.round(quantity_int);
    
    
    if (quantity_int <= 18446744073709551615) {
    
        if (description.length <= 22) {

            var cntrprty_prefix = "434e545250525459"; 
            var trans_id = "00000014";

            var descriptionlength = description.length;
            var descriptionlength_hex = pad(descriptionlength.toString(16),2);

            var initiallength = parseFloat(descriptionlength) + 39;
            var initiallength_hex = pad(initiallength.toString(16),2);

            var assetid_prehex = decToHex(assetid);

            console.log(assetid_prehex);
            console.log(assetid_prehex.substr(2));

            var assetid_hex = pad(assetid_prehex.substr(2),16);

            var quantity_hex = pad(quantity_int.toString(16),16);

            var description_hex_short = bin2hex(description);
            var description_hex = padtrail(description_hex_short, 44);

            var issuance_tx_data = initiallength_hex + cntrprty_prefix + trans_id + assetid_hex + quantity_hex + divisible_hex + descriptionlength_hex + description_hex;

            return issuance_tx_data;

        } else if (description.length <= 41) {

            var cntrprty_prefix = "434e545250525459"; 
            var trans_id = "00000014";

            //var descriptionlength = 41;
            var descriptionlength = description.length;
            var descriptionlength_hex = pad(descriptionlength.toString(16),2);

            var initiallength = 61;
            var initiallength_hex = pad(initiallength.toString(16),2);

            //var secondlength = 27;
            var secondlength = descriptionlength - 14;
            
            var secondlength_hex = pad(secondlength.toString(16),2);


            var assetid_prehex = decToHex(assetid);

            console.log(assetid_prehex);
            console.log(assetid_prehex.substr(2));

            var assetid_hex = pad(assetid_prehex.substr(2),16);

            var quantity_hex = pad(quantity_int.toString(16),16);

            var description_hex_short_a = bin2hex(description.substr(0,22));
            var description_hex_a = padtrail(description_hex_short_a, 44);

            var description_hex_short_b = bin2hex(description.substr(22));
            var description_hex_b = padtrail(description_hex_short_b, 106);

            var issuance_tx_data_a = initiallength_hex + cntrprty_prefix + trans_id + assetid_hex + quantity_hex + divisible_hex + descriptionlength_hex + description_hex_a;

            //var issuance_tx_data_a = initiallength_hex + cntrprty_prefix + trans_id + assetid_hex + quantity_hex + divisible_hex + description_hex_a;

            var issuance_tx_data_b = secondlength_hex + cntrprty_prefix + description_hex_b;

            console.log("msig output 1 length: "+issuance_tx_data_a.length);
            console.log("msig output 2 length: "+issuance_tx_data_b.length);

            var issuance_tx_data = [issuance_tx_data_a, issuance_tx_data_b];

            return issuance_tx_data;

        }
        
    if (description.length > 22 && description.length != 41) {
        
        var error = "error";
        return error;
        
    }
    
    }
    
}

//CREATE ISSUANCE (REGISTER ASSET)
//Several changes to the original code adds stability (several APIs, only one needs to work).
//Downside is that it takes several seconds.
//Recommended to have div 'sendfeedback' for feedback in HTML document.
var createIssuanceOK = 0;
var createIssuanceStatus = "";
var issuanceTimeouts = [];
function createIssuance(add_from, assetid, quantity, divisible, description, msig_total, transfee, mnemonic, feedbackdiv) {
	hex_byte();    
	bitcore = require('bitcore');
	var msig_outputs = 1;
	if (typeof(feedbackdiv)==='undefined') feedbackdiv = "sendfeedback";
	createIssuanceOK = 0;
	pushTxOK = 0;
	var d = new Date();
	createIssuanceStatus = "<span style=\"font-size:80%;color:grey;\">" + d.toLocaleTimeString() + " - <i>" + assetid + "</i></span><br>";
	
	//Error tests
	if (!isValidAsset(assetid)) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />"+assetid+" is not a valid asset name.";
		return;
	}
	if (description.length > 22) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />The description is too long.";
		return;
	}
	if (description != description.replace(/[^ -~]/gi, 'ƫ')) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />Description contains non-ascii character.";
		return;
	} 
	if (getAssetInfo(assetid).name != 'not registered') {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />"+assetid+" exists already";
		return;
	}
    var myXcpBalance = getXcpBalance(add_from);
    if (isValidAlphabeticAsset(assetid) && myXcpBalance < 0.5) { 
        //if API fails myXcpBalance == '?' and this will not be caught. This is desired as a faulty non-essential API shall not disrupt
        //everything. The worst that can happen is you send a registration but it will not be valid
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />Your XCP balance is " + myXcpBalance.toFixed(2) + ". You need at least 0.50 XCP";
		return;
	}
	if (transfee > 0.002) { //a hardcoded test to prevent accidentally high BTC fee (today ~$0.80)
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />BTC fee is "+transfee.toFixed(8)+" and that's too high, right?";
		return;
	}
	
	createIssuanceStatus += "Sending...";
	document.getElementById(feedbackdiv).innerHTML = createIssuanceStatus;
	issuanceTimeouts.push(setTimeout(prepareIssuance_bitpay, 1, add_from, assetid, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs, feedbackdiv));
	issuanceTimeouts.push(setTimeout(prepareIssuance_blockchaininfo, API_TIMEOUT_MS, add_from, assetid, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs, feedbackdiv));
	issuanceTimeouts.push(setTimeout(writeIssuanceStatus, API_TIMEOUT_MS*2, feedbackdiv));
}

function prepareIssuance_bitpay(add_from, assetid, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs, feedbackdiv) {
	if (createIssuanceOK != 1) { 
		createIssuanceStatus += "<br>Trying Bitpay API"; 
		createIssuance_bitpay(add_from, assetid, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs);
		document.getElementById(feedbackdiv).innerHTML = createIssuanceStatus;
	} else {
		writeIssuanceStatus(feedbackdiv);
	}
}
function prepareIssuance_blockchaininfo(add_from, assetid, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs, feedbackdiv) {
	if (createIssuanceOK != 1) { 
		createIssuanceStatus += "<br>Trying Blockchain.info API"; 
		createIssuance_blockchaininfo(add_from, assetid, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs);
		document.getElementById(feedbackdiv).innerHTML = createIssuanceStatus;
	} else {
		writeIssuanceStatus(feedbackdiv);
	}
}
function writeIssuanceStatus(feedbackdiv) {
	for (var i=0; i<issuanceTimeouts.length; i++) {
		clearTimeout(issuanceTimeouts[i]);
	}
	if (isPushingTx) {
        setTimeout(writeIssuanceStatus, 100, feedbackdiv);
        return;
    } else if (createIssuanceOK == 0) 	{ 
		createIssuanceStatus += "<br><span style=\"color:DarkRed ;font-weight:bold;\">REGISTRATION FAILED</span><br />Either fail across all APIs, no Internet connection, asset is taken, or insufficient XCP or BTC."; 
	} else if (pushTxOK == 0) {
		createIssuanceStatus += "<br><span style=\"color:DarkRed ;font-weight:bold;\">REGISTRATION FAILED</span><br />Please wait for previous transaction to confirm. It usually takes between 5 and 15 minutes."; 
	} else {
		createIssuanceStatus += "<br><span style=\"color:DarkGreen;font-weight:bold;\">REGISTRATION SUCCESSFUL</span>"; 
	}
	document.getElementById(feedbackdiv).innerHTML = createIssuanceStatus;  
}

function createIssuance_bitpay(add_from, assetid, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs) {
    var buildTxStart = new Date().getTime();              
    //var mnemonic = $("#newpassphrase").html();
    
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://insight.bitpay.com/api/addr/"+add_from+"/utxo";
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
        
        var amountremaining = parseFloat(msig_total) + parseFloat(transfee);
        
        if (msig_outputs > 1) {
        
            amountremaining += ((msig_outputs - 1) * msig_total);
        
        }
        
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
    
        var utxo_key = total_utxo[0].txid;
        
        if (amountremaining < 0) {
            var satoshi_change = -(amountremaining.toFixed(8) * 100000000).toFixed(0);
        } else {
            var satoshi_change = 0;
        }
    
        create_asset_unique(assetid, quantity, divisible, description, function(datachunk_unencoded){
        
            if (datachunk_unencoded != "error") {
                
                if ($.isArray(datachunk_unencoded) == false) {
        
                    var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);
                    var address_array = addresses_from_datachunk(datachunk_encoded);

                    var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));

                    var scriptstring = "OP_1 33 0x"+address_array[0]+" 33 0x"+address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
                    console.log(scriptstring);
                    var data_script = new bitcore.Script(scriptstring);

                    var transaction = new bitcore.Transaction();

                    for (i = 0; i < total_utxo.length; i++) {
                        transaction.from(total_utxo[i]);
                    }

                    var msig_total_satoshis = parseFloat((msig_total * 100000000).toFixed(0));

                    var xcpdata_msig = new bitcore.Transaction.Output({script: data_script, satoshis: msig_total_satoshis}); 

                    transaction.addOutput(xcpdata_msig);

                    if (satoshi_change > 5459) {
                        transaction.to(add_from, satoshi_change);
                    }

                    transaction.sign(privkey);

                    var final_trans = transaction.serialize();
                    
                } else {
                    
                    var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));
                    
                    var transaction = new bitcore.Transaction();

                    for (i = 0; i < total_utxo.length; i++) {
                        transaction.from(total_utxo[i]);
                    }

                    var msig_total_satoshis = parseFloat((msig_total * 100000000).toFixed(0));
                    
                    
                    var first_datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded[0]);
                    var first_address_array = addresses_from_datachunk(first_datachunk_encoded);
                    
                    var second_datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded[1]);
                    var second_address_array = addresses_from_datachunk(second_datachunk_encoded);

                    var first_scriptstring = "OP_1 33 0x"+first_address_array[0]+" 33 0x"+first_address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
                    console.log(first_scriptstring);
                    var first_data_script = new bitcore.Script(first_scriptstring);
                    
                    var second_scriptstring = "OP_1 33 0x"+second_address_array[0]+" 33 0x"+second_address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
                    console.log(second_scriptstring);
                    var second_data_script = new bitcore.Script(second_scriptstring);

                    

                    var xcpdata_msig_first = new bitcore.Transaction.Output({script: first_data_script, satoshis: msig_total_satoshis});
                    var xcpdata_msig_second = new bitcore.Transaction.Output({script: second_data_script, satoshis: msig_total_satoshis}); 

                    transaction.addOutput(xcpdata_msig_first);
                    transaction.addOutput(xcpdata_msig_second);

                    if (satoshi_change > 5459) {
                        transaction.to(add_from, satoshi_change);
                    }

                    transaction.sign(privkey);

                    var final_trans = transaction.serialize();
                    
                }

            } else {

                var final_trans = "error";

            }

            console.log(final_trans);
			var buildTxEnd = new Date().getTime();
			var buildTxTime = Number(buildTxEnd - buildTxStart);
			if (final_trans != "error" && buildTxTime < API_TIMEOUT_MS - 200 && pushTxOK == 0) {
				createIssuanceOK = 1;
				sendBTCpush(final_trans);  //uncomment to push raw tx to the bitcoin network
			}        
		
        });
    });  
}

function createIssuance_blockchaininfo(add_from, assetid, quantity, divisible, description, msig_total, transfee, mnemonic, msig_outputs) {
    var buildTxStart = new Date().getTime();              
    //var mnemonic = $("#newpassphrase").html();
    
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://blockchain.info/unspent?active="+add_from; //modified  
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
        
        var amountremaining = parseFloat(msig_total) + parseFloat(transfee);
		
		if (msig_outputs > 1) {
        
            amountremaining += ((msig_outputs - 1) * msig_total);
        
        }
        
        data.unspent_outputs.sort(function(a, b) { //modified
			return b.value - a.value;
		});
        
        $.each(data.unspent_outputs, function(i, item) { //modified
            
             var txid = data.unspent_outputs[i].tx_hash_big_endian; //modified
             var vout = data.unspent_outputs[i].tx_output_n; //modified
             var script = data.unspent_outputs[i].script; //modified
             var amount = parseFloat((data.unspent_outputs[i].value)/100000000); //modified
             
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
    
        var utxo_key = total_utxo[0].txid;
        
        if (amountremaining < 0) {
            var satoshi_change = -(amountremaining.toFixed(8) * 100000000).toFixed(0);
        } else {
            var satoshi_change = 0;
        }
    
        create_asset_unique(assetid, quantity, divisible, description, function(datachunk_unencoded){
        
            if (datachunk_unencoded != "error") {
                
                if ($.isArray(datachunk_unencoded) == false) {
        
                    var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);
                    var address_array = addresses_from_datachunk(datachunk_encoded);

                    var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));

                    var scriptstring = "OP_1 33 0x"+address_array[0]+" 33 0x"+address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
                    console.log(scriptstring);
                    var data_script = new bitcore.Script(scriptstring);

                    var transaction = new bitcore.Transaction();

                    for (i = 0; i < total_utxo.length; i++) {
                        transaction.from(total_utxo[i]);
                    }

                    var msig_total_satoshis = parseFloat((msig_total * 100000000).toFixed(0));

                    var xcpdata_msig = new bitcore.Transaction.Output({script: data_script, satoshis: msig_total_satoshis}); 

                    transaction.addOutput(xcpdata_msig);

                    if (satoshi_change > 5459) {
                        transaction.to(add_from, satoshi_change);
                    }

                    transaction.sign(privkey);

                    var final_trans = transaction.serialize();
                    
                } else {
                    
                    var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));
                    
                    var transaction = new bitcore.Transaction();

                    for (i = 0; i < total_utxo.length; i++) {
                        transaction.from(total_utxo[i]);
                    }

                    var msig_total_satoshis = parseFloat((msig_total * 100000000).toFixed(0));
                    
                    
                    var first_datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded[0]);
                    var first_address_array = addresses_from_datachunk(first_datachunk_encoded);
                    
                    var second_datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded[1]);
                    var second_address_array = addresses_from_datachunk(second_datachunk_encoded);

                    var first_scriptstring = "OP_1 33 0x"+first_address_array[0]+" 33 0x"+first_address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
                    console.log(first_scriptstring);
                    var first_data_script = new bitcore.Script(first_scriptstring);
                    
                    var second_scriptstring = "OP_1 33 0x"+second_address_array[0]+" 33 0x"+second_address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
                    console.log(second_scriptstring);
                    var second_data_script = new bitcore.Script(second_scriptstring);

                    

                    var xcpdata_msig_first = new bitcore.Transaction.Output({script: first_data_script, satoshis: msig_total_satoshis});
                    var xcpdata_msig_second = new bitcore.Transaction.Output({script: second_data_script, satoshis: msig_total_satoshis}); 

                    transaction.addOutput(xcpdata_msig_first);
                    transaction.addOutput(xcpdata_msig_second);

                    if (satoshi_change > 5459) {
                        transaction.to(add_from, satoshi_change);
                    }

                    transaction.sign(privkey);

                    var final_trans = transaction.serialize();
                    
                }

            } else {

                var final_trans = "error";

            }

            console.log(final_trans);
			var buildTxEnd = new Date().getTime();
			var buildTxTime = Number(buildTxEnd - buildTxStart);
			if (final_trans != "error" && buildTxTime < API_TIMEOUT_MS - 200 && pushTxOK == 0) {
				createIssuanceOK = 1;
				sendBTCpush(final_trans);  //uncomment to push raw tx to the bitcoin network
			}
        });
    });  
}
