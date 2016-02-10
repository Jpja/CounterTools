function jsonFromURL(url) {
//Returns a string array with json data from url
//For this to work, jquery must be loaded: <script src="lib/jquery/jquery-2.1.4.js"></script>
//Function is async:false so it will block rendering while loading the url
	//if (url.indexOf('?') == -1) url += '?callback=?';
	//else url += '&callback=?';
	try {
		var value= $.ajax({ 
			url: url, 
			dataType: 'text',
			async: false,
		});
		var json = value.responseText;
		if (json.substring(0,2) == "?(") json = json.substring(2);
		if (json.slice(-2) == ");") json = json.slice(0,-2);
		json = JSON.parse(json);
    } catch (e) {
        return "-1";
    }
	return json;
}

function getBtcBalance(address) {
//returns address' BTC balance or '?' if fail across all APIs
	var jsondata = "";
	
	try {
		jsondata = jsonFromURL("http://btc.blockr.io/api/v1/address/info/"+address);
		if (jsondata == "-1") throw "coinmarketcap api does not work";
		return Number(jsondata['data']['balance']);
	} catch(err) {}
	
	try {
		jsondata = jsonFromURL("https://api.blockcypher.com/v1/btc/main/addrs/"+address);
		if (jsondata == "-1") throw "blockcypher api does not work";
		return Number(jsondata['final_balance']);
	} catch(err) {}
	
	return '?';
}

function getXcpBalance(address) {
//returns address' XCP balance or '?' if fail across all APIs
	var jsondata = "";
	
	try {
		jsondata = jsonFromURL("https://counterpartychain.io/api/address/"+address);
		if (jsondata == "-1") throw "counterpartychain api does not work";
		if (jsondata.success == 0) return 0; //valid api call, means address never been used = 0 xcp
		return Number(jsondata['xcp_balance']);
	} catch(err) {}
	
	try {
		jsondata = jsonFromURL("http://xcp.blockscan.com/api2?module=address&action=balance&btc_address="+address+"&asset=XCP");
		if (jsondata == "-1") throw "blockscan api does not work";
		if (jsondata.status == "error") return 0; //valid api call, means address never been used = 0 xcp
		return Number(jsondata['data'][0]['balance']);
	} catch(err) {}
	
	return '?';
}

function getAssetBalances(address) {
//returns address' asset balance as 2D array [asset index].asset and [asset index].balance
// -- all assets are returned except BTC and XCP (better force it not to bcs some APIs may include these, others not)
//or returns 'none' if no assets held by address
//or returns '?' if fail across all APIs
	var jsondata = "";
	var assetBalances = [];
	var numbersOK;
	var ind;
	
	try {
		jsondata = jsonFromURL("https://counterpartychain.io/api/balances/" + address);
		if (jsondata == "-1") throw "counterpartychain api does not work";
		ind = -1;
		if (jsondata.hasOwnProperty('data') && jsondata['data'].hasOwnProperty(0) && jsondata['data'][0].hasOwnProperty('asset')) {
			numbersOK = true;
			for (var i=0; i < jsondata['data'].length; i++){
				var asset = jsondata['data'][i]['asset'];
				var balance = jsondata['data'][i]['amount'];
				if (asset != 'BTC' && asset != 'XCP') {
					ind +=1;
					assetBalances[ind] = {asset:"", balance:0};
					assetBalances[ind].asset = asset;
					if (!isNaN(balance)) assetBalances[ind].balance = Number(balance);
					else numbersOK = false;
				}
			}
			if (ind > -1 && numbersOK) return assetBalances;
		} 
		return 'none';
	} catch(err) {}
	
	try {
		jsondata = jsonFromURL("http://xcp.blockscan.com/api2?module=address&action=balance&btc_address=" + address);
		if (jsondata == "-1") throw "blockscan api does not work";
		ind = -1;
		if (jsondata.hasOwnProperty('data') && jsondata['data'].hasOwnProperty(0) && jsondata['data'][0].hasOwnProperty('asset')) {
			numbersOK = true;
			for(var i=0; i < jsondata['data'].length; i++){
				var asset = jsondata['data'][i]['asset'];
				var balance = jsondata['data'][i]['balance'];
				if (asset != 'BTC' && asset != 'XCP') {
					ind +=1;
					assetBalances[ind] = {asset:"", balance:0};
					assetBalances[ind].asset = asset;
					if (!isNaN(balance)) assetBalances[ind].balance = Number(balance);
					else numbersOK = false;
				}
			}
			if (ind > -1 && numbersOK) return assetBalances;
		} 
		return 'none';
	} catch(err) {}
	
	return '?';
}

function getBalance(address, asset) {
//returns address' asset balance or '?' if fail across all APIs
	asset = asset.toUpperCase();
	if (asset == 'BTC') return getBtcBalance(address);
	if (asset == 'XCP') return getXcpBalance(address);

	var assetBalances = getAssetBalances(address);
	if (assetBalances == 'none') return 0;
	if (assetBalances == '?') return '?';
	for(var i=0; i < assetBalances.length; i++){
		if (assetBalances[i].asset == asset) return assetBalances[i].balance;
	}
	return 0;
}

function getPrice(asset) {
//returns asset's prices or '?' if fail across all APIs
	var jsondata = "";
	var prices = {usd:"?", eur:"?", cny:"?", cad:"?", rub:"?", btc:"?"};
	
	try {
		jsondata = jsonFromURL("http://coinmarketcap-nexuist.rhcloud.com/api/"+asset+"/price");
		if (jsondata == "-1") throw "coinmarketcap api does not work";
		prices.usd = Number(jsondata['usd']);
		prices.eur = Number(jsondata['eur']);
		prices.cny = Number(jsondata['cny']);
		prices.cad = Number(jsondata['cad']);
		prices.rub = Number(jsondata['rub']);
		prices.btc = Number(jsondata['btc']);
		return prices;
	} catch(err) {}
	
	return prices;
}

function getAssetInfo(asset) {
//returns asset's info or assetInfo.name = 'not registered' or '?' if fail across all APIs
	var jsondata = "";
	var assetInfo = {name:"?", issuer:"?", owner:"?", divisible:"?", locked:"?", supply:"?", description:"?"};
	
	try {
		jsondata = jsonFromURL("http://xcp.blockscan.com/api2?module=asset&action=info&name="+asset);
		if (jsondata == "-1") throw "blockscan api does not work";
		if (jsondata.status == "success") { //else asset does not exist
			assetInfo.name = jsondata['data'][0]['asset'];
			assetInfo.issuer = jsondata['data'][0]['issuer'];
			assetInfo.owner = jsondata['data'][0]['owner'];
			assetInfo.divisible = jsondata['data'][0]['divisible'];
			assetInfo.locked = jsondata['data'][0]['locked'];
			assetInfo.supply = Number(jsondata['data'][0]['circulation']);
			assetInfo.description = jsondata['data'][0]['description'];
			if (assetInfo.divisible = "True") assetInfo.divisible = true; else assetInfo.divisible = false;
			if (assetInfo.locked == "True") assetInfo.locked = true; else assetInfo.locked = false;
			return assetInfo;
		}
		assetInfo.name = 'not registered';
		return assetInfo;
	} catch(err) {}
	
	try {
		jsondata = jsonFromURL("https://counterpartychain.io/api/asset/"+asset);
		if (jsondata == "-1" ) throw "counterpartychain api does not work"; 
		if (jsondata.success == 1) { //else asset does not exist
			assetInfo.name = jsondata['asset'];
			//bug - shows owner assetInfo.issuer = jsondata['issuer'];
			assetInfo.owner = jsondata['owner'];
			assetInfo.divisible = Boolean(jsondata['divisible']); //0=>false,1=>true
			assetInfo.locked = Boolean(jsondata['locked']);
			assetInfo.supply = Number(jsondata['supply']);
			assetInfo.description = jsondata['description'];
			return assetInfo;
		}
		assetInfo.name = 'not registered';
		return assetInfo;
	} catch(err) {}
	
	return assetInfo;
}

function getTransactionHistory(address, page, count) {
//returns array with address' latest asset transactions (pure BTC not included) or string 'none' if no transactions or '?' if fail across all APIs
	if (typeof(page)==='undefined') page = 1;
	if (typeof(count)==='undefined') count = 12;
	
	var jsondata = "";
	var transactions = [];
	//amount is positive if receive, negative if send
	//time is timestamp and should be converted to time display string
		
	try {
		jsondata = jsonFromURL("https://counterpartychain.io/api/transactions/"+address+"/"+page+"/"+count);
		if (jsondata == "-1") throw "counterpartychain api does not work";
		if (jsondata.success == 1 && jsondata.total > 0) { //else no transactions
			for(var i=0; i < jsondata['data'].length; i++){
				transactions[i] = {address:"?", asset:"?", block:"?", amount:"?", time:"?"};
				transactions[i].address = jsondata['data'][i]['address'];
				transactions[i].asset = jsondata['data'][i]['asset'];
				transactions[i].block = Number(jsondata['data'][i]['block']);
				transactions[i].amount = Number(jsondata['data'][i]['quantity']);
				transactions[i].time = jsondata['data'][i]['time'];
			}
			return transactions;
		}
		return 'none';
	} catch(err) {}
	
	/*
	//blockscan currently does not have a suitable API. 
	// - credit_debit is more issuance and burns in addition to transactions (this is maybe a good thing)
	// - it shows oldest first. could have worked if it showed total number of hits and then make a second call to the last page
	try {
		jsondata = jsonFromURL("http://xcp.blockscan.com/api2?module=address&action=credit_debit&btc_address="+asset+"&page="+page+"count="+count);
		if (jsondata == "-1") throw "blockscan api does not work";
		if (jsondata.status == "success") { //else no transactions
			for(var i=jsondata['data'].length-1; i >= 0; i--){
				assetInfo.address = '?';
				assetInfo.asset = jsondata['data'][i]['asset'];
				assetInfo.block = jsondata['data'][i]['block_index'];
				assetInfo.amount = jsondata['data'][i]['quantity'];
				assetInfo.time = jsondata['data'][i]['block_time'];
				return assetInfo;
			}
		}
		return 'none';
	} catch(err) {}
	*/
	
	return '?';
}

function getBroadcastHistory(address, page, count) {
//returns array with address' latest broadcasts or string 'none' if no broadcasts or '?' if fail across all APIs
	if (typeof(page)==='undefined') page = 1;
	if (typeof(count)==='undefined') count = 12;
	
	var jsondata = "";
	var broadcasts = [];
	//time is timestamp and should be converted to time display string
	//return fee as a fraction, e.g. 0.02 instead of 2%
		
	try {
		jsondata = jsonFromURL("https://counterpartychain.io/api/broadcasts/"+address+"/"+page+"/"+count);
		if (jsondata == "-1") throw "counterpartychain api does not work";
		if (jsondata.success == 1 && jsondata.total > 0) { //else no broadcasts
			for(var i=0; i < jsondata['data'].length; i++){
				broadcasts[i] = {block:"?", fee:"?", locked:"?", text:"?", value:"?", time:"?"};
				broadcasts[i].block = Number(jsondata['data'][i]['block']);
				broadcasts[i].fee = Number(jsondata['data'][i]['fee']) / 100;
				broadcasts[i].locked = Boolean(jsondata['data'][i]['locked']);
				broadcasts[i].text = jsondata['data'][i]['text'];
				broadcasts[i].value = Number(jsondata['data'][i]['value']);
				broadcasts[i].time = jsondata['data'][i]['time'];
			}
			return broadcasts;
		}
		return 'none';
	} catch(err) {}
	
	try {
		jsondata = jsonFromURL("http://xcp.blockscan.com/api2?module=broadcast&action=list&btc_address="+address+"&page="+page+"count="+count);
		if (jsondata == "-1") throw "blockscan api does not work";
		if (jsondata.totalcount > 0) { //else no broadcasts
			for(var i=0; i < jsondata['data'].length; i++){
				broadcasts[i] = {block:"?", fee:"?", locked:"?", text:"?", value:"?", time:"?"};
				broadcasts[i].block = Number(jsondata['data'][i]['block_index']);
				broadcasts[i].fee = Number(jsondata['data'][i]['fee_fraction_int']) / 10000000000;
				broadcasts[i].locked = jsondata['data'][i]['locked'];
				broadcasts[i].text = jsondata['data'][i]['text'];
				broadcasts[i].value = Number(jsondata['data'][i]['value']);
				broadcasts[i].time = jsondata['data'][i]['timestamp'];
				if (broadcasts[i].locked == "True") broadcasts[i].locked = true; else broadcasts[i].locked = false;
			}
			return broadcasts;
		}
		return 'none';
	} catch(err) {}
	
	return '?';
}