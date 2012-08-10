/********************************
 ********** GET VARS ************
 ********************************/

// from: http://stackoverflow.com/questions/439463/how-to-get-get-and-post-variables-with-jquery

// parses get variables PHP style

var $_GET = {};

document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
    function decode(s) {
        return decodeURIComponent(s.split("+").join(" "));
    }

    $_GET[decode(arguments[1])] = decode(arguments[2]);
});

/********************************
 *** GENERIC LOCALSTORAGE *******
 ********************************/

 // FROM: https://developer.mozilla.org/en-US/docs/DOM/Storage

if (!window.localStorage) {
  window.localStorage = {
    getItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) { return null; }
      return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
    },
    key: function (nKeyId) {
      return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
    },
    setItem: function (sKey, sValue) {
      if(!sKey) { return; }
      document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      this.length = document.cookie.match(/\=/g).length;
    },
    length: 0,
    removeItem: function (sKey) {
      if (!sKey || !this.hasOwnProperty(sKey)) { return; }
      document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      this.length--;
    },
    hasOwnProperty: function (sKey) {
      return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    }
  };
  window.localStorage.length = (document.cookie.match(/\=/g) || window.localStorage).length;
}

/********************************
 ******* LOOKBACK CODE **********
 ********************************/

$(document).ready(function (){
    if (wgAction == 'view' && wgIsArticle && typeof($_GET['oldid']) === 'undefined' && wgCanonicalNamespace == ''){
        // get base and API Location
        var RSDURL = $('head link[rel="EditURI"]').attr('href');
        window.lookback_APIURL = RSDURL.split("?")[0];
        // Create UI
        $("body").append(
            "<div style='position:fixed; font-size:10px; right:0; bottom:0; padding:5px; background-color:#FFFEA8; border-width:0; border-color:#FFFC5C; border-style:solid; border-top-width:1px; border-left-width:1px; -webkit-border-top-left-radius: 5px; -moz-border-radius-topleft: 5px; border-top-left-radius: 5px;'>" +
                "<label for='lookback_input'>Revert To:</label> " +
                "<input type='text' id='lookback_input' style='border:1px solid #000000' placeholder='MM/DD/YYYY HH:MM:SS' />" + 
                "<a style='margin-left:5px' href='" + wgArticlePath.replace(/\$1/, 'Special:Preferences#mw-prefsection-gadgets') +  "'>[Disable]</a>" + 
            "</div>"
        );

        // Functions needed for finding old revisions
        window.lookback_getRevisions = function (from, targetDateArgument){
            // construct request
            var dataObj = {
                'format': 'json',
                'action': 'query',
                'prop': 'revisions',
                'titles': wgPageName,
                'rvlimit': 500,
                'rvprop': 'ids|timestamp',
                'rvdir': 'older'
            }
            if (typeof(from) !== undefined){
                dataObj['rvstartid'] = from;
            }
            // get revisions
            $.ajax({
                url: window.lookback_APIURL,
                method: 'POST',
                dataType: 'json',
                data: dataObj,
                success: (function (targetDate){
                    return (function (data){
                        // get actual revisions
                        var pageHolder = data['query']['pages'];
                        var revisions = pageHolder[Object.getOwnPropertyNames(pageHolder)[0]]['revisions'];
                        // go through each one
                        for (var i = 0; i < revisions.length; i++){
                            revision = revisions[i];
                            // convert date to timestamp
                            var revisionTimestamp = Date.parse(revision['timestamp']) / 1000;
                            // compare to date
                            if (revisionTimestamp <= targetDate){
                                // on success get data and send to foundRevision
                                $.ajax({
                                    url: '',
                                    dataType: 'html',
                                    method: 'GET',
                                    data: {
                                        'oldid': revision['revid']
                                    },
                                    success: window.lookback_foundRevision
                                });
                                // prevent any other actions
                                return;
                            }
                        }
                        if (typeof(data['query-continue']) !== 'undefined'){
                            // on failure recurse
                            window.lookback_getRevisions(data['query-continue']['revisions']['rvstartid'], targetDate);
                        }
                        else {
                            // nothing left to recurse 
                            $("#content").html("<em>This page didn't exist then...</em>");
                        }
                    });
                })(targetDateArgument)
            });
        }
        window.lookback_foundRevision = function (revisionHTML){
            // get element
            var doc = document.createElement('html');
            doc.innerHTML = revisionHTML;
            // parse part we need
            contentHTML = $(doc).find("#content")[0].innerHTML;
            // replace
            $("#content").html(contentHTML);
        }
        // Actually bind events
        $('#lookback_input').bind('change', function (){
            // check if empty
            if (this.value == ''){
                // change border color
                $(this).css('border-color', '#000000');
                // store
                window.localStorage.removeItem("lookbackDate");
                // get current text
                $.ajax({
                    url: '',
                    dataType: 'html',
                    success: window.lookback_foundRevision
                });
                return;
            }
            // make sure new value is valid
            var validtext = /^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4}) ([0-9]{1,2})\:([0-9]{1,2})\:([0-9]{1,2})$/;
            if (validtext.test(this.value)){
                // change border color
                $(this).css('border-color', '#000000');
                // convert to timestamp
                var dateParts = this.value.match(validtext);
                var timestamp = Date.UTC(
                    dateParts[3], 
                    dateParts[1] - 1, 
                    dateParts[2], 
                    dateParts[4], 
                    dateParts[5], 
                    dateParts[6],
                    0
                ) / 1000;
                // make sure not past future
                if (timestamp > ((new Date()).getTime() / 1000)){
                    $(this).css('border-color', '#FF0000');
                    return;
                }
                // store
                window.localStorage.setItem("lookbackDate", timestamp);
                // Invoke the recursion through the revisions
                window.lookback_getRevisions(undefined, timestamp);
            }
            else {
                // change border color
                $(this).css('border-color', '#FF0000');
            }
        });
        // Load Prefs - from storage, ignore if empty
        var pastTimestamp = window.localStorage.getItem('lookbackDate');
        if (pastTimestamp != null){
            // convert to format
            var pastDate = new Date(pastTimestamp * 1000);
            var pastDateStr = (
                (pastDate.getUTCMonth() + 1) + 
                "/" + 
                pastDate.getUTCDate() + 
                "/" + 
                pastDate.getUTCFullYear() + 
                " " +
                pastDate.getUTCHours() + 
                ":" +
                pastDate.getUTCMinutes() + 
                ":" + 
                pastDate.getUTCSeconds()
            );
            // set it
            $('#lookback_input')[0].value = pastDateStr;
            // trigger change
            $('#lookback_input').trigger('change');
        }
    }
});
