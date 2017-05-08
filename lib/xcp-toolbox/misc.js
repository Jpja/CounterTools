function fixedlength(string, length, rightAdj) {
	if (typeof(rightAdj)==='undefined') rightAdj = false;
	do {
		if (rightAdj == true) {
			string = "\xA0" + string;
		} else {
			string = string + "\xA0";
		}
	} while (string.length < length); 
	return string;
}

function displayNumber(number, numOfDecimals, decColor, decShrinkPst) {
//returns a string where:
//integer part with thousands separator if >=10,000
//decimal part with as many digits as specified
//decimal html5 span color if selected
//decimal shrink size by additional decShrinkPst for every three digits 
//number is rounded if necessary
	if (typeof(numOfDecimals)==='undefined') numOfDecimals = 0;
	if (typeof(decColor)==='undefined' || decColor == 'inherit' || decColor == 'default') decColor = 0;
	if (typeof(decShrinkPst)==='undefined' || decShrinkPst == '0' || decShrinkPst == 0) decShrinkPst = 0;
	if (isNaN(number)) return number;
	var formatted = parseFloat(number);
	formatted = formatted.toFixed(numOfDecimals);
	var split = formatted.toString().split('.');
	if (split[0].length >= 5) {
        split[0] = split[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
	if (numOfDecimals == 0) return String(formatted);
	var decimals = split[1];
	if (decShrinkPst != 0) {
		decimals = '';
		var splitDec = split[1].match(/.{1,3}/g);
		for (var i = 0; i < splitDec.length; i++) {
			decimals += "<span style=\"font-size:"+(100-decShrinkPst*(i+1))+"%;\">"+splitDec[i]+"</span>";
		}
	}
	if (decColor != 0) {
		decimals = "<span style=\"color:"+decColor+";\">"+decimals+"</span>";
	}
	return formatted+"."+decimals;
}

function walletFormat(number) {
//Outputs a string with number formatted for wallet balance display
//Always 8 digits after comma
//Fractional part shall be smaller and grey (HTML5 format)
//Thousands separator if >=10,000.00000000
	if (isNaN(number)) return "?";
	var formatted = parseFloat(number);
	formatted = formatted.toFixed(8);
	var split = formatted.toString().split('.');
	split[1] = "<span style=\"color:dimgray;font-size:90%;\">" + split[1].substring(0,3) + "</span><span style=\"color:dimgray;font-size:80%;\">" + split[1].substring(3,6) + "</span><span style=\"color:dimgray;font-size:65%;\">" + split[1].substring(6) + "</span>";
	if (split[0].length >= 5) {
        split[0] = split[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
	formatted = split[0] + "." + split[1];
	return formatted;
}

function walletFormatUSD(number) {
//Outputs a string with number formatted for wallet balance display
//Always 2 digits after comma
//Thousands separator if >=10,000.00000000
	if (isNaN(number)) return "?";
	var formatted = parseFloat(number);
	formatted = formatted.toFixed(2);
	var split = formatted.toString().split('.');
	if (split[0].length >= 5) {
        split[0] = split[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
	formatted = split[0] + "." + split[1];
	return formatted;
}

function walletFormatBTC(number) {
//Outputs a string with number formatted for wallet balance display
//Always 6 digits after comma
	if (isNaN(number)) return "?";
	var formatted = parseFloat(number);
	formatted = formatted.toFixed(6);
	var split = formatted.toString().split('.');
	if (split[0].length >= 5) {
        split[0] = split[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
	formatted = split[0] + "." + split[1];
	return formatted;
/*
//Always 8 digits after comma
//Last two digits shall be small and grey (HTML5 format)
//Thousands separator if >=10,000.00000000
	if (isNaN(number)) return "?";
	var formatted = parseFloat(number);
	formatted = formatted.toFixed(8);
	var split = formatted.toString().split('.');
	split[1] = "<span style=\"font-size:90%;\">" + split[1].substring(0,3) + "</span><span style=\"font-size:80%;\">" + split[1].substring(3,6) + "</span><span style=\"font-size:65%;\">" + split[1].substring(6) + "</span>";
	if (split[0].length >= 5) {
        split[0] = split[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
	formatted = split[0] + "." + split[1];
	return formatted;
*/
}

function maxAmountSendFormat(number) {
//Outputs a string with number formatted for wallet balance display
//Either 0, 3 or 8 digits after comma
//After comma digits shall be small and grey (HTML5 format)
//Thousands separator if >=10,000.00000000
	if (isNaN(number)) return "?";
	var formatted = parseFloat(number);
	formatted = formatted.toFixed(8);
	var split = formatted.toString().split('.');
	if (split[1] == "00000000") {
		split[1] = "";	
	} else if (split[1].substring(3) == "00000") {
		split[1] = ".<span style=\"color:dimgray;font-size:90%;\">" + split[1].substring(0,3) + "</span>";		
	} else {
		split[1] = ".<span style=\"color:dimgray;font-size:90%;\">" + split[1] + "</span>";	
	}
	if (split[0].length >= 5) {
        split[0] = split[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
	formatted = split[0] + split[1];
	return formatted;
}

function isValidAddress(address) {
//Returns true or false
//Not perfect validation. Just ensures right prefix, length and characters. 
//No checksum validation
//https://en.bitcoin.it/wiki/Address
	if (address[0] != '1' && address[0] != '3') return false;
	if (address.length < 26) return false;
	if (address.length > 35) return false;
	return /^[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/.test(address);
}

function addressReadable(address, charsFirst, charsLast, binder) {
//return address on format 1AeEh..MMmK
	if (typeof(charsFirst)==='undefined') charsFirst = 6;
	if (typeof(charsLast)==='undefined') charsLast = 3;
	if (typeof(binder)==='undefined') binder = "..";
	return address.substring(0,charsFirst) + binder + address.slice(-charsLast);
}

function assetReadable(asset, charsFirst, charsLast, binder, maxDescr) {
//return numeric asset on format A8285..00 (Test)
//if alphabetic asset, just return asset name unchanged
//if no description found, just return asset name in full
	if (typeof(asset)==='undefined' || asset == "" || asset[0] != 'A') return asset;
	if (typeof(charsFirst)==='undefined') charsFirst = 4;
	if (typeof(charsLast)==='undefined') charsLast = 2;
	if (typeof(binder)==='undefined') binder = "..";
	if (typeof(maxDescr)==='undefined') maxDescr = 21;
	var assetInd = assetListIndex(asset);
	if (assetInd == -1 || ASSET_LIST[assetInd][1] == "") return asset;
	var assetDescription = ASSET_LIST[assetInd][1];
	var assetDisplay = addressReadable(asset,charsFirst,charsLast, binder);
	if (numericAssetFromDescription(assetDescription) == asset) assetDisplay += " ⚓";
	if (assetDescription.length > maxDescr) {
		assetDescription = assetDescription.substring(0,maxDescr-2) + "..";
	}
	assetDisplay += " ("+assetDescription+")";
	return assetDisplay;	
}

function isValidAsset(asset) {
if (isValidAlphabeticAsset(asset) || isValidNumericAsset(asset)) return true;
return false;
}

function isValidAlphabeticAsset(asset) {
	//4-12 chars, cannot start with A
	//A few old ones have 13 or 14 chars
	if (asset.match(/^[B-Z][A-Z]{3,11}$/) == null) return false;
	return true;
}

function isValidNumericAsset(asset) {
	//'A' followed by a really large number
	//Min = 26^12+1 =    95,428,956,661,682,177
	//Max = 2^64-1 = 18,446,744,073,709,551,615
	if (asset.length>21) return false;
	if (asset.length<18) return false;
	if (asset[0] != 'A') return false;
	if (asset.substring(0,2) == 'A0') return false;
	if (asset.substring(1).match(/[^0-9]/) != null) return false;
	if (asset.length==18 && asset.substring(1,9)<95428956) return false;
	if (asset.length==18 && asset.substring(1,9)==95428956  && asset.substring(9)<661682177) return false;
	if (asset.length==21 && asset.substring(1,10)>184467440) return false;
	if (asset.length==21 && asset.substring(1,10)==184467440  && asset.substring(10)>73709551615) return false;
    return true;
}

function numericAssetFromDescription(asset_description) {
	var str = asset_description;
	str = str.substring(0,21);
	str = str.toLowerCase();
	str = str.replace(/[^a-z]/g,'');
	str = CryptoJS.SHA256(str).toString();
	str = str.replace(/[a-f]/g,'');
	str = str.substring(0,19);
	while (str.length < 19) str = str+'0';
	if (str[0] == '0') str = '1'+str.substring(1);
	return 'A'+str;
}

function inAssetList(asset) {
//return true if in list (it exists)
//else false (either not registered or registered after list was updated)
	for (var i = 0; i < ASSET_LIST.length; i++) {
		if (asset === ASSET_LIST[i][0]) {
			return true;
		}
	}
	return false;
}
function assetListIndex(asset) {
//return index in asset list (-1 if not found)
//else false (either not registered or registered after list was updated)
	for (var i = 0; i < ASSET_LIST.length; i++) {
		if (asset === ASSET_LIST[i][0]) {
			return i;
		}
	}
	return -1;
}

function isDivisible(asset) {
//return 1 if asset is divisible, 0 if not, -1 if lookup fails
//this function MAY have to make an API call. Then it will delay execution of entire script by ~0.2-1 sec
//in rare cases when array lookup and API call fail it will return -1 
	var indAsset = assetListIndex(asset);
	var divisible = false;
	if (indAsset != -1) {
		if (ASSET_LIST[indAsset][3] == 0) return 0;
		if (ASSET_LIST[indAsset][3] == 1) return 1;		
	} else {
		//API call
		var jsondata = jsonFromURL("https://counterpartychain.io/api/asset/" + asset);
		if (jsondata != "-1") {
			if(jsondata.hasOwnProperty('divisible')) {
				if (jsondata['divisible'] == 0) return 0;				
				if (jsondata['divisible'] == 1) return 1;				
			}
		}
	}
	return -1;
}

function highlightDiffChars(str1, str2) {
	//Returns str1 where chars differing from str2 are marked
	var strOut = "";
	for (var i = 0; i < str1.length; i++) {
		if (i > str2.length || str1[i] != str2[i]) {
			strOut += "<mark>" + str1[i] + "</mark>";
		} else {
			strOut += str1[i];
		}
	}
	return strOut;
}

function highlightDiffWords(str1, str2) {
	//Returns str1 where words differing from str2 are marked
	var words1 = str1.split(' ');
	var words2 = str2.split(' ');
	var wordsOut = [];
	for (var i = 0; i < words1.length; i++) {
		if (i > words2.length || words1[i] != words2[i]) {
			wordsOut[i] = "<mark>" + words1[i] + "</mark>";
		} else {
			wordsOut[i] = words1[i];
		}
	}
	return wordsOut.join(' ');
}
