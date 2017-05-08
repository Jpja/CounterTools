function randomIntFromInterval(min,max) {

    return Math.floor(Math.random()*(max-min+1)+min); 
    
}

function padprefix(str, max) {   
    
    str = str.toString();
    return str.length < max ? padprefix('0' + str, max) : str;   
    
}

function padtrail(str, max) {

    while (str.length < max) {
        str += "0";
    }
    return str;
}

function hex_byte() {

    var hex_digits = "0123456789abcdef";
    var hex_dig_array = hex_digits.split('');
    
    var hex_byte_array = new Array();
        
    for (a = 0; a < 16; a++){
        for (b = 0; b < 16; b++){            
            hex_byte_array.push(hex_dig_array[a] + hex_dig_array[b]);           
        }
    }
    
    return hex_byte_array;
   
}


function rawtotxid(raw) {

    var firstSHA = Crypto.SHA256(Crypto.util.hexToBytes(raw))
    var secondSHA = Crypto.SHA256(Crypto.util.hexToBytes(firstSHA))    
   
    return reverseBytes(secondSHA);  

}


//function assetid(asset_name) {
//    
//    //asset_name.toUpperCase();
//
//    if (asset_name != "XCP"){
//    
//        var b26_digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
//        var name_array = asset_name.split("");
//    
//        var n = 0;
//    
//        for (i = 0; i < name_array.length; i++) { 
//            n *= 26;
//            n += b26_digits.indexOf(name_array[i]);
//        }    
//     
//        var asset_id = n;
//    
//    } else {
//        
//        var asset_id = 1;
//        
//    }
//    
//    return asset_id;
//    
//}

function assetid(asset_name) {
    
    //asset_name.toUpperCase();

    if (asset_name == "XCP") {
        
        var asset_id = (1).toString(16);
        
    } else if (asset_name.substr(0, 1) == "A") {
        
        var pre_id = asset_name.substr(1);
        
        var pre_id_bigint = BigIntegerSM(pre_id);
        
        //var asset_id = pre_id_bigint.toString(16);
		var asset_id = pre_id_bigint.toString(10);
        
        
    } else {  
    
        var b26_digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
        var name_array = asset_name.split("");
    
        //var n = 0;
        var n_bigint = BigIntegerSM(0);
    
        for (i = 0; i < name_array.length; i++) { 
            
            //n *= 26;
            //n += b26_digits.indexOf(name_array[i]);
            
            n_bigint = BigIntegerSM(n_bigint).multiply(26);
            n_bigint = BigIntegerSM(n_bigint).add(b26_digits.indexOf(name_array[i]));
                    
        }    
     
        //var asset_id = n;
        //var asset_id = n_bigint.toString(16);
		var asset_id = n_bigint.toString(10);
    
    } 
    
    //return asset_id;
    console.log(asset_id);
    
    return asset_id;
    
}


//bug in transaction functions. send_opreturn wants hex format. issuance wants dec format.
function assetid_hex(asset_name) {
    
    //asset_name.toUpperCase();

    if (asset_name == "XCP") {
        
        var asset_id = (1).toString(16);
        
    } else if (asset_name.substr(0, 1) == "A") {
        
        var pre_id = asset_name.substr(1);
        
        var pre_id_bigint = BigIntegerSM(pre_id);
        
        //var asset_id = pre_id_bigint.toString(16);
		var asset_id = pre_id_bigint.toString(10);
        
        
    } else {  
    
        var b26_digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
        var name_array = asset_name.split("");
    
        //var n = 0;
        var n_bigint = BigIntegerSM(0);
    
        for (i = 0; i < name_array.length; i++) { 
            
            //n *= 26;
            //n += b26_digits.indexOf(name_array[i]);
            
            n_bigint = BigIntegerSM(n_bigint).multiply(26);
            n_bigint = BigIntegerSM(n_bigint).add(b26_digits.indexOf(name_array[i]));
                    
        }    
     
        //var asset_id = n;
        var asset_id = n_bigint.toString(16);
		//var asset_id = n_bigint.toString(10);
    
    } 
    
    //return asset_id;
    console.log(asset_id);
    
    return asset_id;
    
}

function create_xcp_send_data(asset_name, amount) {
    
    var prefix = "1c434e54525052545900000000"; //CNTRPRTY
    var trailing_zeros = "000000000000000000000000000000000000000000000000000000000000000000";
    var asset_id = assetid(asset_name); 
    
    //var asset_id_hex = padprefix(asset_id.toString(16), 16);
    var asset_id_hex = padprefix(asset_id, 16);
    var amount_round = parseInt((amount*100000000).toFixed(0));
    
    var amount_hex = padprefix((amount_round).toString(16), 16);
    
    console.log(asset_id_hex);
    console.log(amount_hex);
                               
    var data = prefix + asset_id_hex + amount_hex + trailing_zeros; 
    
    return data;
    
}

function create_xcp_send_data_opreturn(asset_name, amount) {
    
    var prefix = "434e54525052545900000000"; //CNTRPRTY
    var asset_id = assetid(asset_name); 
    //var asset_id = assetid_hex(asset_name);
    
    console.log("from cxsdo: "+asset_id);
    
    //var asset_id_hex = padprefix((asset_id).toString(16), 16);
    //var asset_id_hex = padprefix(asset_id, 16);
    var asset_id_hex = padprefix(convertBase(asset_id, 10, 16), 16);
    var amount_round = parseInt((amount*100000000).toFixed(0));
    
    var amount_hex = padprefix((amount_round).toString(16), 16);
                               
    var data = prefix + asset_id_hex + amount_hex; 
    
    return data;
    
}


function create_broadcast_data(message, value, feefraction, type) {
    
    //max 32 character broadcast for single OP_CHECKMULTISIG output
    //fee fraction must be less than 42.94967295 to be stored as a 4-byte hexadecimal
    
    var feefraction_int = parseFloat(feefraction).toFixed(8) * 100000000;
    feefraction_int = Math.round(feefraction_int);
    
    if (message.length <= 46 && feefraction_int <= 4294967295) {
        
        var currenttime = Math.floor(Date.now() / 1000);
        var currenttime_hex = currenttime.toString(16);   
            
        var cntrprty_prefix = "434e5452505254590000001e"; //includes ID = 30
          
        var messagelength = message.length;
        var messagelength_hex = padprefix(messagelength.toString(16),2);
        
        var initiallength = parseFloat(messagelength) + 29;
        var initiallength_hex = padprefix(initiallength.toString(16),2);
         
        var feefraction_hex = padprefix(feefraction_int.toString(16),8);
       
        var message_hex_short = bin2hex(message);
        
        var value_binary = toIEEE754Double(parseFloat(value));
    
        var value_hex_array = new Array();
        
        for (i = 0; i < value_binary.length; ++i) {
            value_hex_array[i] = padprefix(value_binary[i].toString(16),2);
        }

        var value_hex = value_hex_array.join("");
        
        if (type == "OP_CHECKMULTISIG" && message.length <= 32) {
        
            var message_hex = padtrail(message_hex_short, 64);

            var broadcast_tx_data = initiallength_hex + cntrprty_prefix + currenttime_hex + value_hex + feefraction_hex + messagelength_hex + message_hex;
            
        } else if (type == "OP_RETURN") {
            
            var broadcast_tx_data = cntrprty_prefix + currenttime_hex + value_hex + feefraction_hex + messagelength_hex + message_hex_short;
            
        }
          
        return broadcast_tx_data;
    
    } else {
        
        var error = "error";
        return error;
        
    }
    
}

/*DEPRECATED
function create_broadcast_data(message, value, feefraction) {
    
    //max 32 character broadcast for single OP_CHECKMULTISIG output
    //fee fraction must be less than 42.94967295 to be stored as a 4-byte hexadecimal
    
    var feefraction_int = parseFloat(feefraction).toFixed(8) * 100000000;
    feefraction_int = Math.round(feefraction_int);
    
    if (message.length <= 32 && feefraction_int <= 4294967295) {
        
        var currenttime = Math.floor(Date.now() / 1000);
        var currenttime_hex = currenttime.toString(16);   
            
        var cntrprty_prefix = "434e5452505254590000001e"; //includes ID = 30
          
        var messagelength = message.length;
        var messagelength_hex = padprefix(messagelength.toString(16),2);
        
        var initiallength = parseFloat(messagelength) + 29;
        var initiallength_hex = padprefix(initiallength.toString(16),2);
         
        var feefraction_hex = padprefix(feefraction_int.toString(16),8);
       
        var message_hex_short = bin2hex(message);
        var message_hex = padtrail(message_hex_short, 64);
        
        
        var value_binary = toIEEE754Double(parseFloat(value));
    
        var value_hex_array = new Array();
        
        for (i = 0; i < value_binary.length; ++i) {
            value_hex_array[i] = padprefix(value_binary[i].toString(16),2);
        }

        var value_hex = value_hex_array.join("");

        var broadcast_tx_data = initiallength_hex + cntrprty_prefix + currenttime_hex + value_hex + feefraction_hex + messagelength_hex + message_hex;
        
        return broadcast_tx_data;
    
    } else {
        
        var error = "error";
        return error;
        
    }
    
}
*/

function xcp_rc4(key, datachunk) {
    
    return bin2hex(rc4(hex2bin(key), hex2bin(datachunk)));
    
}

function address_from_pubkeyhash(pubkeyhash) {
    
    var publicKey = new bitcore.PublicKey(pubkeyhash);
    var address = bitcore.Address.fromPublicKey(publicKey);
    
    //console.log(address.toString());
    return address.toString();
    
}

function addresses_from_datachunk(datachunk) {
    
    var hex_byte_array = hex_byte();
    
    var pubkey_seg1 = datachunk.substring(0, 62);
    var pubkey_seg2 = datachunk.substring(62, 124);
    var first_byte = "02";
    var second_byte;
    var pubkeyhash;
    var address1="";
    var address2="";
    var rand;
    
    while (address1.length == 0) {
        rand = randomIntFromInterval(0,255);
        
        second_byte = hex_byte_array[rand];          
        pubkeyhash = first_byte + pubkey_seg1 + second_byte;
            
        if (bitcore.PublicKey.isValid(pubkeyhash)){
            console.log(pubkeyhash);        
            var hash1 = pubkeyhash;
            var address1 = address_from_pubkeyhash(pubkeyhash);
        }    

    }
    
    while (address2.length == 0) {
        rand = randomIntFromInterval(0,255);
        
        second_byte = hex_byte_array[rand];          
        pubkeyhash = first_byte + pubkey_seg2 + second_byte;
            
        if (bitcore.PublicKey.isValid(pubkeyhash)){
            console.log(pubkeyhash);
            var hash2 = pubkeyhash;
            var address2 = address_from_pubkeyhash(pubkeyhash);
        }  

    }
         
    console.log(address1);
    console.log(address2);
    
    var data_hashes = [hash1, hash2];
    
    return data_hashes;
    
}

function isdatacorrect(data_chunk, asset, asset_total) {
            
            var asset_id = padprefix(assetid(asset),16);
            //var asset_id = padprefix(assetid_hex(asset),16);
			var asset_id_hex = padprefix(convertBase(asset_id, 10, 16), 16);
    
    console.log(asset_id);
            
            var assethex = data_chunk.substring(42, 26);
    
    console.log(assethex);
    
            var amount = data_chunk.substring(58, 42);
            //var asset_dec = parseInt(assethex, 16);
            var amount_dec = parseInt(amount, 16) / 100000000;
            
            if (asset_id_hex == assethex && asset_total == amount_dec) {
                var correct = "yes";
            } else {
                var correct = "no";
            }
            
            return correct;
            
            console.log(correct);
}


function sendXCP(add_from, add_to, asset, asset_total, btc_total, msig_total, transfee, mnemonic) {
       
    //var mnemonic = $("#newpassphrase").html();
    
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://"+INSIGHT_SERVER+"/api/addr/"+add_from+"/utxo";     
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+add_from+"/utxo";
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
        
        var amountremaining = (parseFloat(btc_total) + parseFloat(msig_total) + parseFloat(transfee));
        
        data.sort(function(a, b) {
            return b.amount - a.amount;
        });
        
        $.each(data, function(i, item) {

//             //chain.so
//             var txid = data[i].txid;
//             var vout = data[i].output_no;
//             var script = data[i].script_hex;
//             var value = parseFloat(data[i].amount);
            
             //insight
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
        
        console.log(asset);
        console.log(asset_total);
        
        var datachunk_unencoded = create_xcp_send_data(asset, asset_total);
        
        var correct = isdatacorrect(datachunk_unencoded, asset, asset_total); 
        
        console.log(datachunk_unencoded);
        console.log(correct + " correct");
        
        var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);
        
        
        
        console.log(datachunk_encoded);
        
        var address_array = addresses_from_datachunk(datachunk_encoded);
        
        var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));
        
        var scriptstring = "OP_1 33 0x"+address_array[0]+" 33 0x"+address_array[1]+" 33 0x"+sender_pubkeyhash+" OP_3 OP_CHECKMULTISIG";
        console.log(scriptstring);
        var data_script = new bitcore.Script(scriptstring);
        
        var transaction = new bitcore.Transaction();
            
        for (i = 0; i < total_utxo.length; i++) {
            transaction.from(total_utxo[i]);
        }
    
        var btc_total_satoshis = parseFloat((btc_total * 100000000).toFixed(0));
        transaction.to(add_to, btc_total_satoshis);
        
        var msig_total_satoshis = parseFloat((msig_total * 100000000).toFixed(0));
        
        var xcpdata_msig = new bitcore.Transaction.Output({script: data_script, satoshis: msig_total_satoshis}); 
        
        transaction.addOutput(xcpdata_msig);
                  
        if (satoshi_change > 5459) {
            transaction.to(add_from, satoshi_change);
        }
        
        transaction.sign(privkey);

        var final_trans = transaction.serialize();
        
        console.log(final_trans);   
        
        //sendXCP_opreturn(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic);
       
            
        if (correct == "yes") {   
            sendBTCpush(final_trans);  //push raw tx to the bitcoin network via Blockchain.info
        } else {
            $("#sendtokenbutton").html("Error, refresh to continue...");
        }

    });
    
}


//SEND ASSET
//Several changes to the original code adds stability (several APIs, only one needs to work).
//Downside is that it takes several seconds.
//Recommended to have div 'sendfeedback' for feedback in HTML document.
var sendXcpOK = 0;
var sendXcpStatus = "";
var sendTimeouts = [];
function send_piggyback(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic, feedbackdiv) {
    sendXCP_opreturn(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic, feedbackdiv, false);
}
function sendXCP_opreturn(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic, feedbackdiv, check_asset_balance) {
	hex_byte();    
	bitcore = require('bitcore');
	if (typeof(feedbackdiv)==='undefined') feedbackdiv = "sendfeedback";
	if (typeof(check_asset_balance)==='undefined') check_asset_balance = true;
	sendXcpOK = 0;
	var asset_total_input = asset_total;
	var divisibleAsset = isDivisible(asset); 
	if (divisibleAsset == 0) {
		asset_total = parseFloat(asset_total) / 100000000;
    }
	pushTxOK = 0;
	var d = new Date();
	sendXcpStatus = "<span style=\"font-size:80%;color:grey;\">" + d.toLocaleTimeString() + " - <i>" + asset +" to " + addressReadable(add_to) + "</i></span><br>";
	
	//Error tests
	if (check_asset_balance && getBalance(add_from,asset) < asset_total_input) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />Address balance is too low.";
		return;
	} 
	if (asset_total_input <= 0) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />Send amount must be a positive number.";
		return;
	} 
	if (asset_total_input != asset_total && asset_total_input % 1 !== 0) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />Asset is indivisible. Therefore the amount must be an integer.";
		return;
	}
	if (getBalance(add_from,'BTC') < btc_total+transfee) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />BTC balance is too low.";
		return;
	}
	if (transfee > 0.002) { //a hardcoded test to prevent accidentally high BTC fee (today ~$0.80)
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />BTC fee is "+transfee.toFixed(8)+" and that's too high, right?";
		return;
	}
	if (divisibleAsset == -1) { //api call to determine if divisible failed
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />API call to determine divisibility status failed.";
		return;
	}
	
	sendXcpStatus += "Sending...";
	document.getElementById(feedbackdiv).innerHTML = sendXcpStatus;
	sendTimeouts.push(setTimeout(prepareSendXCP_opreturn_bitpay, 1, add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic, feedbackdiv));
	sendTimeouts.push(setTimeout(prepareSendXCP_opreturn_blockchaininfo, API_TIMEOUT_MS, add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic, feedbackdiv));
	sendTimeouts.push(setTimeout(writeSendStatus, API_TIMEOUT_MS*2, feedbackdiv));        
}

function prepareSendXCP_opreturn_bitpay(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic, feedbackdiv) {
	if (sendXcpOK != 1) { 
		sendXcpStatus += "<br>Trying Bitpay API"; 
		sendXCP_opreturn_bitpay(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic);
		document.getElementById(feedbackdiv).innerHTML = sendXcpStatus;
	} else {
		writeSendStatus(feedbackdiv);
	}
}
function prepareSendXCP_opreturn_blockchaininfo(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic, feedbackdiv) {
	if (sendXcpOK != 1) { 
		sendXcpStatus += "<br>Trying Blockchain.info API"; 
		sendXCP_opreturn_blockchaininfo(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic);
		document.getElementById(feedbackdiv).innerHTML = sendXcpStatus;
	} else {
		writeSendStatus(feedbackdiv);
	}
}
function writeSendStatus(feedbackdiv) {
	for (var i=0; i<sendTimeouts.length; i++) {
		clearTimeout(sendTimeouts[i]);
	}
    if (isPushingTx) {
        setTimeout(writeSendStatus, 100, feedbackdiv);
        return;
    } else if (sendXcpOK == 0) 	{ 
		sendXcpStatus += "<br><span style=\"color:DarkRed ;font-weight:bold;\">SEND FAILED</span><br />Either fail across all APIs, no Internet connection, or insufficient BTC."; 
	} else if (pushTxOK == 0) {
		sendXcpStatus += "<br><span style=\"color:DarkRed ;font-weight:bold;\">SEND FAILED</span><br />Please wait for previous transaction to confirm. It usually takes between 5 and 15 minutes."; 
	} else {
		sendXcpStatus += "<br><span style=\"color:DarkGreen;font-weight:bold;\">SEND SUCCESSFUL</span>"; 
	}
	console.log("write status: "+sendXcpStatus);
	document.getElementById(feedbackdiv).innerHTML = sendXcpStatus;  
}

function sendXCP_opreturn_bitpay(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic) {
    var buildTxStart = new Date().getTime(); 
	console.log("bitpay api start");	
    //var mnemonic = $("#newpassphrase").html();
    
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://insight.bitpay.com/api/addr/"+add_from+"/utxo";  
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+add_from+"/utxo"; 
    
//    var source_html = "http://btc.blockr.io/api/v1/address/unspent/"+add_from;
    
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
//    $.getJSON( source_html, function( apidata ) {
        
        var amountremaining = ((parseFloat(btc_total) * 100000000) + (parseFloat(transfee)*100000000))/100000000;
		var fee_satoshis = (parseFloat(transfee) * 100000000).toFixed(0);
        
//        var data = apidata.data.unspent;
        
        console.log(amountremaining);
        
        data.sort(function(a, b) {
            return b.amount - a.amount;
        });
        
        $.each(data, function(i, item) {
            
             var txid = data[i].txid;
             var vout = data[i].vout;
             var script = data[i].scriptPubKey;

            
//             var txid = data[i].tx;
//             var vout = data[i].n;
//             var script = data[i].script;
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
    
        var datachunk_unencoded = create_xcp_send_data_opreturn(asset, asset_total);
        
        var check_data = "1c"+datachunk_unencoded;
        
        var correct = isdatacorrect(check_data, asset, asset_total); 
        
        console.log(correct);
        
        console.log(datachunk_unencoded);
        
        var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);
        
        //var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));
        
        var scriptstring = "OP_RETURN 28 0x"+datachunk_encoded;
        var data_script = new bitcore.Script(scriptstring);
        
        var transaction = new bitcore.Transaction();
		transaction.fee(fee_satoshis);
            
        for (i = 0; i < total_utxo.length; i++) {
            transaction.from(total_utxo[i]);     
        }
        
        console.log(total_utxo);
    
        var btc_total_satoshis = parseFloat((btc_total * 100000000).toFixed(0));
        
        console.log(btc_total_satoshis);
        
        transaction.to(add_to, btc_total_satoshis);
        
        var xcpdata_opreturn = new bitcore.Transaction.Output({script: data_script, satoshis: 0}); 
       
        transaction.addOutput(xcpdata_opreturn);
        
        console.log(satoshi_change);
        
        if (satoshi_change > 5459) {
            transaction.change(add_from);
        }
        
        
        
        transaction.sign(privkey);

        var final_trans = transaction.uncheckedSerialize();
        
        console.log(final_trans);
		var buildTxEnd = new Date().getTime();
		var buildTxTime = Number(buildTxEnd - buildTxStart);
		if (buildTxTime < API_TIMEOUT_MS - 200 && pushTxOK == 0) {
			sendXcpOK = 1;
			console.log("bitpay api final trans ok");
			sendBTCpush(final_trans);  //uncomment to push raw tx to the bitcoin network
		}

    });
    
}

function sendXCP_opreturn_blockchaininfo(add_from, add_to, asset, asset_total, btc_total, transfee, mnemonic) {
    var buildTxStart = new Date().getTime();
	console.log("blockchain.info api start");	
    //var mnemonic = $("#newpassphrase").html();
    
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://blockchain.info/unspent?active="+add_from; //modified  
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
        
        var amountremaining = ((parseFloat(btc_total) * 100000000) + (parseFloat(transfee)*100000000))/100000000;
		var fee_satoshis = (parseFloat(transfee) * 100000000).toFixed(0);
        
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
    
        var datachunk_unencoded = create_xcp_send_data_opreturn(asset, asset_total);
        
        var check_data = "1c"+datachunk_unencoded;
        
        var correct = isdatacorrect(check_data, asset, asset_total); 
        
        console.log(correct);
        
        console.log(datachunk_unencoded);
        
        var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);
        
        //var sender_pubkeyhash = new bitcore.PublicKey(bitcore.PrivateKey.fromWIF(privkey));
        
        var scriptstring = "OP_RETURN 28 0x"+datachunk_encoded;
        var data_script = new bitcore.Script(scriptstring);
        
        var transaction = new bitcore.Transaction();
        transaction.fee(fee_satoshis);
            
        for (i = 0; i < total_utxo.length; i++) {
            transaction.from(total_utxo[i]);     
        }
        
        console.log(total_utxo);
    
        var btc_total_satoshis = parseFloat((btc_total * 100000000).toFixed(0));
        
        console.log(btc_total_satoshis);
        
        transaction.to(add_to, btc_total_satoshis);
        
        var xcpdata_opreturn = new bitcore.Transaction.Output({script: data_script, satoshis: 0}); 
       
        transaction.addOutput(xcpdata_opreturn);
        
        console.log(satoshi_change);
        
        if (satoshi_change > 5459) {
            transaction.change(add_from);
        }
        
        
        
        transaction.sign(privkey);

        var final_trans = transaction.uncheckedSerialize();
        
        console.log(final_trans);
		var buildTxEnd = new Date().getTime();
		var buildTxTime = Number(buildTxEnd - buildTxStart);
		if (buildTxTime < API_TIMEOUT_MS - 200 && pushTxOK == 0) {
			sendXcpOK = 1;
			console.log("blockchain.info api final trans ok");
			sendBTCpush(final_trans);  //uncomment to push raw tx to the bitcoin network
		}

    });
    
}

//BRAODCAST
//Several changes to the original code adds stability (several APIs, only one needs to work).
//Downside is that it takes several seconds.
//Recommended to have div 'sendfeedback' for feedback in HTML document.
var sendBroadcastOK = 0;
var sendBroadcastStatus = "";
var bcTimeouts = [];
function sendBroadcast(add_from, message, value, feefraction, transfee, mnemonic, feedbackdiv) {
	hex_byte();    
	bitcore = require('bitcore');
	var callback = undefined;
	if (typeof(feedbackdiv)==='undefined') feedbackdiv = "sendfeedback";
	sendBroadcastOK = 0;
	pushTxOK = 0;
	var d = new Date();
	sendBroadcastStatus = "<span style=\"font-size:80%;color:grey;\">" + d.toLocaleTimeString() + " - <i>" + message + "</i></span><br>";
	
	//Error tests
	if (getBalance(add_from,'BTC') < transfee) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />BTC balance is too low.";
		return;
	}
	if (message.length > 46) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />The description is too long.";
		return;
	}
	if (message != message.replace(/[^ -~]/gi, 'ƫ')) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />Message contains non-ascii character.";
		return;
	}
	if (feefraction < 0 || feefraction > 42.94967295) {
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />Fee fraction must be between 0 and 42.94967295.";
		return;
	}
	if (transfee > 0.002) { //a hardcoded test to prevent accidentally high BTC fee (today ~$0.80)
		document.getElementById(feedbackdiv).innerHTML = "<span style=\"color:DarkRed;font-weight:bold;\">CANNOT SEND</span><br />BTC fee is "+transfee.toFixed(8)+" and that's too high, right?";
		return;
	}
	
	sendBroadcastStatus += "Sending...";
	document.getElementById(feedbackdiv).innerHTML = sendBroadcastStatus;
	bcTimeouts.push(setTimeout(prepareBroadcast_bitpay, 1, add_from,  message, value, feefraction, transfee, mnemonic, callback, feedbackdiv));
	bcTimeouts.push(setTimeout(prepareBroadcast_blockchaininfo, API_TIMEOUT_MS, add_from,  message, value, feefraction, transfee, mnemonic, callback, feedbackdiv));
	bcTimeouts.push(setTimeout(writeBroadcastStatus, API_TIMEOUT_MS*2, feedbackdiv));
}

function prepareBroadcast_bitpay(add_from,  message, value, feefraction, transfee, mnemonic, callback, feedbackdiv) {
	if (sendBroadcastOK != 1) { 
		sendBroadcastStatus += "<br>Trying Bitpay API"; 
		//sendBroadcast_bitpay(add_from, message, value, feefraction, msig_total, transfee, mnemonic, callback);
		sendBroadcast_opreturn_bitpay(add_from, message, value, feefraction, transfee, mnemonic, callback);
		document.getElementById(feedbackdiv).innerHTML = sendBroadcastStatus;
	} else {
		writeBroadcastStatus(feedbackdiv);
	}
}
function prepareBroadcast_blockchaininfo(add_from,  message, value, feefraction, transfee, mnemonic, callback, feedbackdiv) {
	if (sendBroadcastOK != 1) { 
		sendBroadcastStatus += "<br>Trying Blockchain.info API"; 
		//sendBroadcast_blockchaininfo(add_from, message, value, feefraction, msig_total, transfee, mnemonic, callback);
		sendBroadcast_opreturn_blockchaininfo(add_from, message, value, feefraction, transfee, mnemonic, callback);
		document.getElementById(feedbackdiv).innerHTML = sendBroadcastStatus;
	} else {
		writeBroadcastStatus(feedbackdiv);
	}
}
function writeBroadcastStatus(feedbackdiv) {
	for (var i=0; i<bcTimeouts.length; i++) {
		clearTimeout(bcTimeouts[i]);
	}
	if (isPushingTx) {
        setTimeout(writeBroadcastStatus, 100, feedbackdiv);
        return;
    } else if (sendBroadcastOK == 0) 	{ 
		sendBroadcastStatus += "<br><span style=\"color:DarkRed ;font-weight:bold;\">BROADCAST FAILED</span><br />Either fail across all APIs, no Internet connection, or insufficient BTC."; 
	} else if (pushTxOK == 0) {
		sendBroadcastStatus += "<br><span style=\"color:DarkRed ;font-weight:bold;\">BROADCAST FAILED</span><br />Please wait for previous transaction to confirm. It usually takes between 5 and 15 minutes."; 
	} else {
		sendBroadcastStatus += "<br><span style=\"color:DarkGreen;font-weight:bold;\">BROADCAST SUCCESSFUL</span>"; 
	}
	document.getElementById(feedbackdiv).innerHTML = sendBroadcastStatus;  
}

function sendBroadcast_opreturn_bitpay(add_from, message, value, feefraction, transfee, mnemonic, callback) {
    var buildTxStart = new Date().getTime();   
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://insight.bitpay.com/api/addr/"+add_from+"/utxo";     
    
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
        
        var amountremaining = (parseFloat(transfee)*100000000)/100000000;
		var fee_satoshis = (parseFloat(transfee) * 100000000).toFixed(0);
        
        console.log(amountremaining);
        
        data.sort(function(a, b) {
            return b.amount - a.amount;
        });
        
        $.each(data, function(i, item) {
            
             var txid = data[i].txid;
             var vout = data[i].vout;
             var script = data[i].scriptPubKey;

            
//             var txid = data[i].tx;
//             var vout = data[i].n;
//             var script = data[i].script;
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
    
        var datachunk_unencoded = create_broadcast_data(message, value, feefraction, "OP_RETURN");

        console.log(datachunk_unencoded);
        
        if (datachunk_unencoded != "error") {
            
            var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);

            var bytelength = datachunk_encoded.length / 2;

            var scriptstring = "OP_RETURN "+bytelength+" 0x"+datachunk_encoded;
            var data_script = new bitcore.Script(scriptstring);

            var transaction = new bitcore.Transaction();
			transaction.fee(fee_satoshis);

            for (i = 0; i < total_utxo.length; i++) {
                transaction.from(total_utxo[i]);     
            }

            console.log(total_utxo);

            var xcpdata_opreturn = new bitcore.Transaction.Output({script: data_script, satoshis: 0}); 

            transaction.addOutput(xcpdata_opreturn);

            console.log(satoshi_change);

            if (satoshi_change > 5459) {
                transaction.change(add_from);
            }

            transaction.sign(privkey);

            var final_trans = transaction.uncheckedSerialize();
            
            console.log(final_trans);
			var buildTxEnd = new Date().getTime();
			var buildTxTime = Number(buildTxEnd - buildTxStart);
			if (final_trans != "errpr" && buildTxTime < API_TIMEOUT_MS - 200 && pushTxOK == 0) {
				sendBroadcastOK = 1;
				sendBTCpush(final_trans);  //uncomment to push raw tx to the bitcoin network
			}
			
            callback();
            
        } else {
            
            //$("#broadcastmessage").val("Error! Refresh to Continue...");
            
        }
    });
}

function sendBroadcast_opreturn_blockchaininfo(add_from, message, value, feefraction, transfee, mnemonic, callback) {
    var buildTxStart = new Date().getTime();   
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://blockchain.info/unspent?active="+add_from; //modified      
    
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
        
        var amountremaining = (parseFloat(transfee)*100000000)/100000000;
		var fee_satoshis = (parseFloat(transfee) * 100000000).toFixed(0);
        
        console.log(amountremaining);
        
        data.unspent_outputs.sort(function(a, b) { //modified
            return b.amount - a.amount;
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
    
        var datachunk_unencoded = create_broadcast_data(message, value, feefraction, "OP_RETURN");

        console.log(datachunk_unencoded);
        
        if (datachunk_unencoded != "error") {
            
            var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);

            var bytelength = datachunk_encoded.length / 2;

            var scriptstring = "OP_RETURN "+bytelength+" 0x"+datachunk_encoded;
            var data_script = new bitcore.Script(scriptstring);

            var transaction = new bitcore.Transaction();
			transaction.fee(fee_satoshis);

            for (i = 0; i < total_utxo.length; i++) {
                transaction.from(total_utxo[i]);     
            }

            console.log(total_utxo);

            var xcpdata_opreturn = new bitcore.Transaction.Output({script: data_script, satoshis: 0}); 

            transaction.addOutput(xcpdata_opreturn);

            console.log(satoshi_change);

            if (satoshi_change > 5459) {
                transaction.change(add_from);
            }

            transaction.sign(privkey);

            var final_trans = transaction.uncheckedSerialize();
            
            console.log(final_trans);
			var buildTxEnd = new Date().getTime();
			var buildTxTime = Number(buildTxEnd - buildTxStart);
			if (final_trans != "errpr" && buildTxTime < API_TIMEOUT_MS - 200 && pushTxOK == 0) {
				sendBroadcastOK = 1;
				sendBTCpush(final_trans);  //uncomment to push raw tx to the bitcoin network
			}
			
            callback();
            
        } else {
            
            //$("#broadcastmessage").val("Error! Refresh to Continue...");
            
        }
    });
}

/* DEPRECATED. Use opreturn instead.
function sendBroadcast_bitpay(add_from, message, value, feefraction, msig_total, transfee, mnemonic, callback) {
       
    //var mnemonic = $("#newpassphrase").html();
    
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://insight.bitpay.com/api/addr/"+add_from+"/utxo";  
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
        
        var amountremaining = parseFloat(msig_total) + parseFloat(transfee);
        
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
    
        var datachunk_unencoded = create_broadcast_data(message, value, feefraction);
        
        console.log(datachunk_unencoded);
        
        if (datachunk_unencoded != "error") {
        
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
            
            console.log(final_trans);
        
            sendBTCpush(final_trans);  //uncomment to push raw tx to the bitcoin network
			sendBroadcastOK = 1;
 
            callback();
            
        } else {
            //$("#broadcastmessage").val("Error! Refresh to Continue...");   
        }
    });  
}

function sendBroadcast_blockchaininfo(add_from, message, value, feefraction, msig_total, transfee, mnemonic, callback) {
       
    //var mnemonic = $("#newpassphrase").html();
    
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://blockchain.info/unspent?active="+add_from; //modified  
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
        
        var amountremaining = parseFloat(msig_total) + parseFloat(transfee);
        
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
    
        var datachunk_unencoded = create_broadcast_data(message, value, feefraction);
        
        console.log(datachunk_unencoded);
        
        if (datachunk_unencoded != "error") {
        
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
            
            console.log(final_trans);
        
            sendBTCpush(final_trans);  //uncomment to push raw tx to the bitcoin network
			sendBroadcastOK = 1;
            
            callback();
            
        } else {
            //$("#broadcastmessage").val("Error! Refresh to Continue...");   
        }
    });  
}
*/



//BET
//Under development
function sendBet_opreturn(add_from, feed_address, betType, deadline, wager, counterwager, expiration, target, btc_total, transfee, mnemonic, callback) {
    hex_byte();    
    bitcore = require('bitcore');
    pushTxOK = 0;
    sendBet_opreturn_bitpay(add_from, feed_address, betType, deadline, wager, counterwager, expiration, target, btc_total, transfee, mnemonic, callback);
}
function sendBet_opreturn_bitpay(add_from, feed_address, betType, deadline, wager, counterwager, expiration, target, btc_total, transfee, mnemonic, callback) { 
    //var mnemonic = $("#newpassphrase").html();
    
    var privkey = getprivkey(add_from, mnemonic);
     
    var source_html = "https://insight.bitpay.com/api/addr/"+add_from+"/utxo";  
    //var source_html = "https://chain.localbitcoins.com/api/addr/"+add_from+"/utxo"; 
    
//    var source_html = "http://btc.blockr.io/api/v1/address/unspent/"+add_from;
    
    var total_utxo = new Array();   
       
    $.getJSON( source_html, function( data ) {
//    $.getJSON( source_html, function( apidata ) {
        
        var amountremaining = ((parseFloat(btc_total) * 100000000) + (parseFloat(transfee)*100000000))/100000000;
		var fee_satoshis = (parseFloat(transfee) * 100000000).toFixed(0);
        
//        var data = apidata.data.unspent;
        
        console.log(amountremaining);
        
        data.sort(function(a, b) {
            return b.amount - a.amount;
        });
        
        $.each(data, function(i, item) {
            
             var txid = data[i].txid;
             var vout = data[i].vout;
             var script = data[i].scriptPubKey;

            
//             var txid = data[i].tx;
//             var vout = data[i].n;
//             var script = data[i].script;
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
    
        var datachunk_unencoded = create_bet_data(betType, deadline, wager, counterwager, expiration, target);
        
        
        if (datachunk_unencoded != "error") {
            
            var datachunk_encoded = xcp_rc4(utxo_key, datachunk_unencoded);

            var bytelength = datachunk_encoded.length / 2;

            var scriptstring = "OP_RETURN "+bytelength+" 0x"+datachunk_encoded;
            var data_script = new bitcore.Script(scriptstring);

            var transaction = new bitcore.Transaction();
			transaction.fee(fee_satoshis);

            for (var i = 0; i < total_utxo.length; i++) {
                transaction.from(total_utxo[i]);     
            }

            console.log(total_utxo);
            
            var btc_total_satoshis = parseFloat((btc_total * 100000000).toFixed(0));
        
            console.log(btc_total_satoshis);
        
            transaction.to(feed_address, btc_total_satoshis);

            var xcpdata_opreturn = new bitcore.Transaction.Output({script: data_script, satoshis: 0}); 

            transaction.addOutput(xcpdata_opreturn);

            console.log(satoshi_change);

            if (satoshi_change > 5459) {
                transaction.change(add_from);
            }

            transaction.sign(privkey);

            var final_trans = transaction.uncheckedSerialize();
        
            console.log(final_trans);
            console.log("bitpay api final bet trans ok");
            sendBTCpush(final_trans);  //uncomment to push raw tx to the bitcoin network
            document.getElementById('sendfeedback').innerHTML = final_trans;
             
        }

    });
    
}

function create_bet_data(betType, deadline, wager, counterwager, expiration, target) {
    
    //OP_RETURN output
    //betType = 2 for Equal or 3 for Not Equal
    //deadline is unix timestamp
    //wager is quantity XCP
    //counterwager is is quantity XCP
    //expiration is number of blocks (integer)
    //target value is number (double)
    var cntrprtyPrefix = "434e545250525459";
    var transIdHex = "00000028"; //id for bet is int 40 = hex 28
    var leverageHex = "000013b0"; //always 5040 (hex 13B0) - was only used for CFDs, now deprecated
    
    var betTypeHex = '';
    if (betType == 2) {
        betTypeHex = "0002";
    } else if (betType == 3) {
        betTypeHex = "0003";
    } else {
        return 'error';
    }
    
    var deadlineInt = Math.round(deadline); //force integer
    var deadlineHex = padprefix(deadlineInt.toString(16),8);
    
    var wagerInt = parseFloat(wager).toFixed(8) * 100000000;
    wagerInt = Math.round(wagerInt);
    var wagerHex = padprefix(wagerInt.toString(16),16);
    
    var counterwagerInt = parseFloat(counterwager).toFixed(8) * 100000000;
    counterwagerInt = Math.round(counterwagerInt);
    var counterwagerHex = padprefix(counterwagerInt.toString(16),16);
    
    var expirationInt = Math.round(expiration);
    var expirationHex = padprefix(expiration.toString(16),8);
    
    var target_binary = toIEEE754Double(parseFloat(target));
    var target_hex_array = new Array();
    for (var i = 0; i < target_binary.length; ++i) {
        target_hex_array[i] = padprefix(target_binary[i].toString(16),2);
    }
    var targetHex = target_hex_array.join("");
    
   var bet_tx_data = cntrprtyPrefix + transIdHex + betTypeHex + deadlineHex + wagerHex + counterwagerHex + targetHex + leverageHex + expirationHex;
    
    if (bet_tx_data.length == 100) { //catches only error where some input is too long.
        return bet_tx_data;
    } 
    
    return 'error';
    
}