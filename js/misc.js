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

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
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

var getData = {
    getNearbyParks: function(currentLocation) {
        var deferred = $.Deferred();
        $.ajax("https://parks.api.codefornrv.org/rpc/get_radius_miles",{
            dataType:"json",
            contentType:"application/json",
            method:"post",
            data:JSON.stringify({ latitude: parseFloat(currentLocation[1]), radius_size: 5, longitude: parseFloat(currentLocation[0]) }),
            success:function(data) {
                deferred.resolve(data);
            },
            error:function() {
                deferred.reject(new Error('ajax request failed'));
            }
        });
        return deferred.promise();
    },
    getAmenities: function() {
        var deferred = $.Deferred();
        $.ajax("https://parks.api.codefornrv.org/amenity_type",{
        //$.ajax("amenity_type_placeholder",{
            dataType:"json",
            success:function(data) {
                deferred.resolve(data);
            },
            error:function() {
                deferred.reject(new Error('ajax request failed'));
            }
        });
        return deferred.promise();
    },
    getParkAmenities: function() {
        var deferred = $.Deferred();
        $.ajax("https://parks.api.codefornrv.org/amenities",{
            dataType:"json",
            contentType:"application/json",
            success:function(data) {
                deferred.resolve(data);
            },
            error:function() {
                deferred.reject(new Error('ajax request failed'));
            }
        });
        return deferred.promise();
    },
    getParks: function() {
        var deferred = $.Deferred();
        $.ajax("https://parks.api.codefornrv.org/parks_with_geojson",{
            dataType:"json",
            contentType:"application/json",
            success:function(data) {
                deferred.resolve(data);
            },
            error:function() {
                deferred.reject(new Error('ajax request failed'));
            }
        });
        return deferred.promise();
    }
};

function getParksDef(latitude, longitude, amenitiesRequired, radius) {
    var parks = $.ajax("https://parks.api.codefornrv.org/rpc/get_radius_miles",{
        dataType:"json",
        contentType:"application/json",
        method:"post",
        data:JSON.stringify({ latitude: parseFloat(currentLocation[1]), radius_size: 5, longitude: parseFloat(currentLocation[0]) })
    });
    var amenities = $.ajax("https://parks.api.codefornrv.org/amenities",{
        dataType:"json",
        contentType:"application/json"
    });
    $.when(parks, amenities).done(function(parkData, amenitiesData) {
        console.log("when complete");
        console.log(parkData);
        console.log(amenitiesData);
        console.log("when data complete");
    });
}

// https://api.jquerymobile.com/loader/
/*$(document).on( "click", ".show-page-loading-msg", function() {
    var $this = $( this ),
    theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
    msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
    textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
    textonly = !!$this.jqmData( "textonly" );
    html = $this.jqmData( "html" ) || "";
$.mobile.loading( 'show', {
    text: msgText,
    textVisible: textVisible,
    theme: theme,
    textonly: textonly,
    html: html
    });
});

$( document ).ajaxStart(function() {
    $.mobile.loading( "show" );
});
$( document ).ajaxComplete(function() {
    $.mobile.loading( "hide" );
});
$( document ).ajaxError(function() {
    $.mobile.loading( "hide" );
});*/