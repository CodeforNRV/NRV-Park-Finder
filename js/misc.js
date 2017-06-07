function getUrlVars() {
    // thanks http://papermashup.com/read-url-get-variables-withjavascript/
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = decodeURIComponent(value.replace(/\+/g," "));
    });
    return vars;
}

// http://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

var geoLocation = {
    getLocation: function() {
        var deferred = $.Deferred();
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(deferred.resolve, deferred.reject, { timeout: 5000 });
            setTimeout(function() { deferred.reject(new Error('Could not get your location.')) }, 7000);
        } else {
            deferred.reject(new Error('Your browser does not support Geo Location.'));
        }
        return deferred.promise();
    } 
};