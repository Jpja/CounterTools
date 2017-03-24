function drawMenus() {
	pageTitle()
	leftMenu();
	topHeader();
	bottomFooter();
}

function pageTitle() {
	var openfile = location.pathname.replace(/^.*[\\\/]/, '');
	openfile = openfile.toLowerCase();
	var catInd = 0;
	var fileInd = 0;
	for (var i = 0; i < MENU_ITEMS.length; i++) {
		for (var j = 0; j < MENU_ITEMS[i].items.length; j++) {
			if (MENU_ITEMS[i].items[j].file.toLowerCase() == openfile) {
				catInd = i;
				fileInd = j;
				break;
			}
		}
	}
	document.getElementById('pageTitle').innerHTML =  MENU_ITEMS[catInd].category + ": " + MENU_ITEMS[catInd].items[fileInd].name + " - " + WALLET_NAME;
}
function leftMenu() {
	var openfile = location.pathname.replace(/^.*[\\\/]/, '');
	openfile = openfile.toLowerCase();
	var output = "<table cellspacing=\"0\" cellpadding=\"0\">";
	for (var i = 0; i < MENU_ITEMS.length; i++) {
		output += "<tr><th>"+MENU_ITEMS[i].category;+"</th></tr>";
		for (var j = 0; j < MENU_ITEMS[i].items.length; j++) {
			if (MENU_ITEMS[i].items[j].file.toLowerCase() != openfile.toLowerCase()) {
				output += "<tr class=\tablelink\"><td><a href=\""+MENU_ITEMS[i].items[j].file+"\">"+MENU_ITEMS[i].items[j].name+"</a></td><td></td></tr>";
			} else {
				output += "<tr><td class=\"currentpage\">"+MENU_ITEMS[i].items[j].name.toUpperCase()+"</td><td><img src=\"img/trianglearrow28.png\" style=\"display:block;\" width=\"100%\" height=\"100%\"></td></tr>";
			}
		}
		output += "<tr><td>&nbsp;</td></tr>";
	}
	output += "</table>";
	document.getElementById('leftMenu').innerHTML = output;
}
function topHeader() {
	var topHeader = "<table style=\"width:100%;border-collapse:collapse;\"><tr><td style=\"width:20%;padding:0px 0px 2px 0px;\"><img src=\"img/logo-gold.png\" style=\"float:left;height:88px;\"></td><td style=\"width:60%;padding:0px;\"><h2>"+WALLET_TITLE+"</h2><h1>"+WALLET_NAME+"</h1></td>";
	if (ADDR_IN_HEADER == true || ADDR_IN_HEADER.toLowerCase() == 'true' || ADDR_IN_HEADER == 1) {
		var numAddr = Math.min(NUM_ADDR_DISPLAY, MY_ADDR.length, 6);
		topHeader += "<td style=\"width:20%;padding:0px;align:right;vertical-align:top;text-align:right;font-size:75%;\"><span class=\"monospaceBold\">";
		for (var i = 0; i < numAddr; i++) {
			topHeader += MY_ADDR[i]+"<br>";
		}
		topHeader += "</span></td></tr></table>";
	} else {
		topHeader += "<td>&nbsp;</td></tr></table>";
	}
	document.getElementById('topHeader').innerHTML = topHeader;
	//document.getElementById('topHeader').innerHTML =  "<img src=\"img/logo-gold.png\" style=\"float:left;height:88px;\"><h2 style=\"position:relative;\">"+WALLET_TITLE+"</h2><h1 style=\"position:relative;\">"+WALLET_NAME+"</h1>";
}
function bottomFooter() {
	var openfile = location.pathname.replace(/^.*[\\\/]/, '');
	openfile = openfile.toLowerCase();
	var output = "";
	var author = "?";
	for (var i = 0; i < MENU_ITEMS.length; i++) {
		for (var j = 0; j < MENU_ITEMS[i].items.length; j++) {
			if (MENU_ITEMS[i].items[j].file.toLowerCase() == openfile.toLowerCase()) {
				author = MENU_ITEMS[i].items[j].author;
			}
		}
	}
	if (author == undefined) author = "?";
	output += "<a href=\"https://github.com/Jpja\" target=\"_blank\">CounterTools v0.3</a><br>";
	output += "Module by: " + author + "<br>";
	output += "CounterTools designed by: JP Janssen<br>";
	output += "Counterparty APIs: <a href=\"http://blockscan.com/\" target=\"_blank\">Blockscan.com</a>, <a href=\"http://counterpartychain.io/\" target=\"_blank\">CounterpartyChain.io</a><br>";
	output += "Bitcoin APIs: Blockchain.info, Insight.bitpay.com, Chain.so<br>";
	output += "JS libraries: <a href=\"https://github.com/loon3/XCP-Wallet/\" target=\"_blank\">Joe Looney's Chrome Wallet</a>, Bitcore, CryptoJS, JQuery, and more<br>";
	output += "Graphics: <a href=\"http://www.flaticon.com/\" target=\"_blank\">flaticon</a><br><br><br>";
	output += "<span id=\"licence\">Free Public License 1.0.0<br>";
	output += "Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.<br>";
	output += "THE SOFTWARE IS PROVIDED \"AS IS\" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.</span>";
	document.getElementById('bottomFooter').innerHTML =  output;
}
