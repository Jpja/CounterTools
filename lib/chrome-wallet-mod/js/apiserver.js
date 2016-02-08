function getInsightServer() {
    var INSIGHT_SERVER = "localbitcoinschain.com";
    
    console.log("Insight Server: "+INSIGHT_SERVER);
    
    return INSIGHT_SERVER;

//    $.getJSON( "https://"+INSIGHT_SERVER+"/api/peer", function( data ) {  
//
//        //console.log(data.connected);
//
//        if (data.connected != true) {
//
//            INSIGHT_SERVER = "chain.localbitcoins.com";
//            
//            $.getJSON( "https://"+INSIGHT_SERVER+"/api/peer", function( data ) { 
//                
//                if (data.connected != true) {
//                    
//                    INSIGHT_SERVER = "search.bitaccess.ca";
//                    console.log("Active Insight Server: "+INSIGHT_SERVER);
//                    
//                    return INSIGHT_SERVER;
//                    
//                } else {
//                    
//                    console.log("Active Insight Server: "+INSIGHT_SERVER);
//                    
//                    return INSIGHT_SERVER;
//                    
//                }
//                
//            });
//            
//        } else {
//            
//            console.log("Active Insight Server: "+INSIGHT_SERVER);
//            
//            return INSIGHT_SERVER;
//            
//        }
//
//    });
}

//function getInsightServerCallback(callback) {
//    var INSIGHT_SERVER = "insight.bitpay.com";
//
//    $.getJSON( "https://"+INSIGHT_SERVER+"/api/peer", function( data ) {  
//
//        console.log(data.connected);
//
//        if (data.connected != true) {
//
//            INSIGHT_SERVER = "chain.localbitcoins.com";
//            
//            $.getJSON( "https://"+INSIGHT_SERVER+"/api/peer", function( data ) { 
//                
//                if (data.connected != true) {
//                    
//                    INSIGHT_SERVER = "search.bitaccess.ca";
//                    console.log("Insight Server: "+INSIGHT_SERVER);
//            
//                    callback(INSIGHT_SERVER);
//                    
//                } else {
//                    
//                    console.log("Insight Server: "+INSIGHT_SERVER);
//              
//                    callback(INSIGHT_SERVER);
//                    
//                }
//                
//            });
//            
//        } else {
//            
//            console.log("Insight Server: "+INSIGHT_SERVER);
//          
//            callback(INSIGHT_SERVER);
//            
//        }
//
//    });
//}
//
//
