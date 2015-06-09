(function(){
  "use strict";
  $.extend($, {
    /*
      options = {
        url : 'the/path/here',
        type : ('GET', 'POST', PUT, 'DELETE'),
        data : myData,
        async : 'synch' || 'asynch',
        user : username (string),
        password : password (string),
        dataType : ('html', 'json', 'text', 'script', 'xml', 'form'),
        headers : {},
        success : callbackForSuccess,
        error : callbackForError,
        context: null
      }
    */
    ajax: function(options) {
      if (!options) throw('No options where provided to xhr request.');
      if (typeof options !== 'object') throw('Expected an object as argument for options, received something else.');
      var protocol;
      // Default settings:
      var settings = {
        type: 'GET',
        beforeSend: $.noop,
        success: $.noop,
        error: $.noop,
        context: null,
        async: true,
        timeout: 0
      };
      if (options.data) {
        options.data = encodeURIComponent(options.data);
      }
      $.extend(settings, options);
      var dataTypes = {
        script: 'text/javascript, application/javascript',
        json:   'application/json',
        xml:    'application/xml, text/xml',
        html:   'text/html',
        text:   'text/plain'
      };

      // Create a new Promise object:
      return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        var type = settings.type || 'get';
        var async  = settings.async || false;      
        var params = settings.data || null;
        xhr.queryString = params;
        xhr.timeout = settings.timeout ? settings.timeout : 0;
        xhr.open(type, settings.url, async);

        // Setup headers:
        if (!!settings.headers) {  
          for (var prop in settings.headers) { 
            if(settings.headers.hasOwnProperty(prop)) { 
              xhr.setRequestHeader(prop, settings.headers[prop]);
            }
          }
        }
        if (settings.dataType) {
          xhr.setRequestHeader('Content-Type', dataTypes[settings.dataType]);
        }

        // Get the protocol being used:
        protocol = /^([\w-]+:)\/\//.test(settings.url) ? RegExp.$1 : window.location.protocol;
        
        // Handle load success:
        xhr.onload = function() {
          if (xhr.status === 200 && xhr.status < 300 && xhr.readyState === 4 || xhr.status === 304 && xhr.readyState === 4 || (xhr.status === 0 && protocol === 'file:')) {
            // Resolve the promise with the response text:
            resolve(xhr.response);
          } else {
            // Otherwise reject with the status text
            // which will hopefully be a meaningful error:
            reject(new Error(xhr.statusText));
          }
        };

        // Handle error:
        xhr.onerror = function() {
          reject(new Error("There was a network error."));
        };

        // Send request:
        if (async) {
          if (settings.beforeSend !== $.noop) {
            settings.beforeSend(xhr, settings);
          }
          xhr.send(params);
        } else {
          if (settings.beforeSend !== $.noop) {
            settings.beforeSend(xhr, settings);
          }
        }

      });
    }
  });
  $.extend($.ajax, {
    // Parameters: url, data, success, dataType.
    get : function ( url, data, success, dataType ) {
      if (!url) {
        return;
      }
      if (!data) {
        return $.xhr({url : url, type: 'GET'}); 
      }
      if (!dataType) {
        dataType = null;
      }
      if (typeof data === 'function' && !success) {
        return $.xhr({url : url, type: 'GET', success : data});
      } else if (typeof data === 'string' && typeof success === 'function') {
        return $.xhr({url : url, type: 'GET', data : data, success : success, dataType : dataType});
      }
    },
    
    // Parameters: url, data, success.
    getJSON : function ( url, data, success ) {
      if (!url) {
        return;
      }
      if (!data) {
        return;
      }
      if (typeof data === 'function' && !success) {
        $.xhr({url : url, type: 'GET', async: true, success : data, dataType : 'json'});
      } else if (typeof data === 'string' && typeof success === 'function') {
        $.xhr({url : url, type: 'GET', data : data, success : success, dataType : 'json'});
      }
    },

    /*
      // JSONP arguments:
      var options = {
        url: 'http:/whatever.com/stuff/here',
        callback: function() {
           // do stuff here
        },
        callbackType: 'jsonCallback=?',
        timeout: 5000
      }
    */
    JSONP: function(options) {
      var settings = {
        url: null,
        callback: $.noop,
        callbackType: 'callback=?',
        timeout: null
      };
      $.extend(settings, options);
      return new Promise(function(resolve, reject) {
        var fn = 'fn_' + $.uuidNum(),
          script = document.createElement('script'),
          head = $('head')[0];
        script.setAttribute('id', fn);
        var startTimeout = Number(new Date());
        window[fn] = function(data) {
          head.removeChild(script);
          settings.callback(data);
          resolve(data);
          delete window[fn];
        };
        var strippedCallbackStr = settings.callbackType.substr(0, settings.callbackType.length - 1);
        script.src = settings.url.replace(settings.callbackType, strippedCallbackStr + fn);
        head.appendChild(script);
        if (settings.timeout) {
          var waiting = setTimeout(function() {
            if (Number(new Date()) - startTimeout > 0) {
              reject('The request timedout.');
              settings.callback = $.noop;
            }
          }, settings.timeout);
        }
      });
    },
    
    // Parameters: url, data, success, dataType.
    post : function ( url, data, success, dataType ) {
      if (!url) {
        return;
      }
      if (!data) {
        return;
      }
      if (typeof data === 'function' && !dataType) {
        if (typeof success === 'string') {
           dataType = success;
        } else {
          dataType = 'form';
        }
        $.xhr({url : url, type: 'POST', success : data, dataType : dataType});
      } else if (typeof data === 'string' && typeof success === 'function') {
        if (!dataType) {
          dataType = 'form';
        }
        $.xhr({url : url, type: 'POST', data : data, success : success, dataType : dataType});
      }
    }
  });
})();