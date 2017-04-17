/**
* Provide interaction with the child frame
*
* //This files must be added for Hosting window
*
* @author Viachaslau Lyskouski <s.lyskouski@creativity.by>
*
* @sample <iframe onload="FrameManager.registerFrame(this)"></iframe>
* @sample jQuery('#id_iframe').on('load', function(){ FrameManager.registerFrame(this) });
*/

var FrameManager = {
    id: '',
    url: null,

    /**
     * Provide autoheight for iframe
     *
     * @param object event - event from postMessage
     * @return none
     */
    init: function (event) {
        if (FrameManager.id) {
            /* // iframe session fix for Safari < 5.1
            var i = event.data.indexOf(';');
            if(i != -1) {
                var oDate = new Date();
                oDate.setTime(oDate.getTime() + 86400000);
                FrameManager.setcookie('fe_typo_user', event.data.substr(0, i), oDate, '/', FrameManager.url);
                event.data = event.data.substr(i+1);
            }
            */
            document.getElementById(FrameManager.id).style.height = event.data+'px';
        }
    },

    /**
     * Send request into iframe to take height
     *
     * @param none
     * @return none
     */
    request: function() {
        if (FrameManager.id) {
            document.getElementById(FrameManager.id).contentWindow.postMessage('','*');
        }
    },

    /**
     * Set cookie (analog php-function)
     * @param string name - The name of the cookie
     * @param string value - The value of the cookie
     * @param Date|string expire - The time the cookie expires
     * @param string path - The path on the server in which the cookie will be available on
     * @param string domain - The domain that the cookie is available to
     * @param boolean secure - Indicates that the cookie should only be transmitted over a secure HTTPS connection from the client
     * @return boolean
     */
    setcookie: function(name, value, expires, path, domain, secure) {
        expires instanceof Date ? expires = expires.toGMTString() : typeof(expires) == 'number' && (expires = (new Date(+(new Date) + expires * 1e3)).toGMTString());
        var r = [name + "=" + escape(value)], s, i;
        for(i in s = {expires: expires, path: path, domain: domain}){
            s[i] && r.push(i + "=" + s[i]);
        }
        return secure && r.push("secure"), document.cookie = r.join(";"), true;
    },

    /**
     * Init session for all browsers (exept Safari)
     * @param object obj - DOM-iframe
     */
    boot: function (obj){
        var form = document.createElement("form");
        form.setAttribute('method', 'POST');
        form.setAttribute('action', obj.src);
        form.setAttribute('target', obj.id);
        form.setAttribute('enctype', 'application/x-www-form-urlencoded');
        document.body.appendChild(form);
        form.submit();
    },

    /**
     * Init parameters for all functions (__constructor)
     * @param object obj - DOM-iframe
     * @return none
     */
    registerFrame: function(obj){
        //if (!FrameManager.id) {
        //    FrameManager.boot(obj);
        //}
        FrameManager.id = obj.id;
        FrameManager.url = obj.src.split('/')[2];
        obj.scrolling = 'no';
        obj.style.overflow = 'hidden';
        obj.style.overflowX = 'hidden';
        obj.style.overflowY = 'hidden';


    }
};

// Check height
setInterval('FrameManager.request()', 1000);

// All browsers except IE before version 9
if (window.addEventListener) {
    window.addEventListener ("message", FrameManager.init, false);
// IE before version 9
} else if (window.attachEvent) {
    window.attachEvent("onmessage", FrameManager.init);
// Others
} else {
    window.onmessage = function(event) {
        FrameManager.init(event);
    };
}