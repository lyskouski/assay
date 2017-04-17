/**
* Provide interaction with the parent window
* // This file must be added for iframe window
* 
* @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
*/

var prnt_event = null;

window.onload = function(){
    publishHeight();
};

// All browsers except IE before version 9
if (window.addEventListener) {
    window.addEventListener ("message", publishHeight, false);
// IE before version 9
} else if (window.attachEvent) {
    window.attachEvent("onmessage", publishHeight);
// Others
} else {
    window.onmessage = function(event) {
        publishHeight(event);
    };
}

/**
 * Return by postMessage height
 * @param object event - postMessage event
 * @return none
 */
function publishHeight(event){
    if(!prnt_event) {
        if(!event){
            return;
        }
        prnt_event = event;
    }

    try {
        var actualHeight = document.body.offsetHeight + 15;

        var currentHeight = 0;
        if (window.innerHeight) {
            currentHeight = window.innerHeight;
        } else if ((document.documentElement) && (document.documentElement.clientHeight)) {
            currentHeight = document.documentElement.clientHeight;
        } else if ((document.body) && (document.body.clientHeight)) {
            currentHeight = document.body.clientHeight;
        }


        if  (Math.abs(actualHeight - currentHeight) > 30) {
            actualHeight = actualHeight.toString();
            /* // iframe session fix for Safari < 5.1
            if(typeof session_id != 'undefined') {
                actualHeight = session_id+';'+actualHeight;
            }
            */

            if (prnt_event.contentWindow && prnt_event.contentWindow.postMessage) {
                prnt_event.contentWindow.postMessage (actualHeight, "*");
            }else{
                prnt_event.source.postMessage(actualHeight, prnt_event.origin);
            }
        }
    } catch(e){
        // ...
    }
}