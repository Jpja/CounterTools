function hex2bin(hex) {

        var bytes = [];
        var str;
        
        for (var i = 0; i < hex.length - 1; i += 2) {

                var ch = parseInt(hex.substr(i, 2), 16);
                bytes.push(ch);

        }

        str = String.fromCharCode.apply(String, bytes);
        return str;
    
};

function bin2hex(s) {

        // http://kevin.vanzonneveld.net

        var i, l, o = "",
                n;

        s += "";

        for (i = 0, l = s.length; i < l; i++) {
                n = s.charCodeAt(i).toString(16);
                o += n.length < 2 ? "0" + n : n;
        }

        return o;
    
}; 

function reverseBytes(s) {
    var a = s.match(/../g);             // split number in groups of two
    a.reverse();                        // reverse the groups
    var s2 = a.join("");
    return s2;
}


function removeA(arr) {
    		var what, a = arguments, L = a.length, ax;
    		while (L > 1 && arr.length) {
        		what = a[--L];
        		while ((ax= arr.indexOf(what)) !== -1) {
        		    arr.splice(ax, 1);
        		}
    		}
    		return arr;
}


function conv_floating_pt(value_array) {
	    var buffer = new ArrayBuffer(8);
		var bytes = new Uint8Array(buffer);
		var doubles = new Float64Array(buffer); 

		bytes[7] = "0x" + value_array[0];
		bytes[6] = "0x" + value_array[1];
		bytes[5] = "0x" + value_array[2];
		bytes[4] = "0x" + value_array[3];
		bytes[3] = "0x" + value_array[4];
		bytes[2] = "0x" + value_array[5];
		bytes[1] = "0x" + value_array[6];
		bytes[0] = "0x" + value_array[7];

		var value_final = doubles[0];

		return value_final;
}



// Convert a JavaScript number to IEEE-754 Double Precision
// value represented as an array of 8 bytes (octets)
//
// http://cautionsingularityahead.blogspot.com/2010/04/javascript-and-ieee754-redux.html
 
function toIEEE754(v, ebits, fbits) {
 
    var bias = (1 << (ebits - 1)) - 1;
 
    // Compute sign, exponent, fraction
    var s, e, f;
    if (isNaN(v)) {
        e = (1 << bias) - 1; f = 1; s = 0;
    }
    else if (v === Infinity || v === -Infinity) {
        e = (1 << bias) - 1; f = 0; s = (v < 0) ? 1 : 0;
    }
    else if (v === 0) {
        e = 0; f = 0; s = (1 / v === -Infinity) ? 1 : 0;
    }
    else {
        s = v < 0;
        v = Math.abs(v);
 
        if (v >= Math.pow(2, 1 - bias)) {
            var ln = Math.min(Math.floor(Math.log(v) / Math.LN2), bias);
            e = ln + bias;
            f = v * Math.pow(2, fbits - ln) - Math.pow(2, fbits);
        }
        else {
            e = 0;
            f = v / Math.pow(2, 1 - bias - fbits);
        }
    }
     
    // Pack sign, exponent, fraction
    var i, bits = [];
    for (i = fbits; i; i -= 1) { bits.push(f % 2 ? 1 : 0); f = Math.floor(f / 2); }
    for (i = ebits; i; i -= 1) { bits.push(e % 2 ? 1 : 0); e = Math.floor(e / 2); }
    bits.push(s ? 1 : 0);
    bits.reverse();
    var str = bits.join('');
     
    // Bits to bytes
    var bytes = [];
    while (str.length) {
        bytes.push(parseInt(str.substring(0, 8), 2));
        str = str.substring(8);
    }
    return bytes;
}
 

function   toIEEE754Double(v) { return   toIEEE754(v, 11, 52); }

