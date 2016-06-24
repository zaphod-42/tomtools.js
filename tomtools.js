/* 
 * Automatically parses query string of the current page into an object and attaches it to window.location
 * The significant thing about this is it handles array syntax in the query string as well:
 * ?arg[0]=val1&arg[1]=val2
 * Become:
 * {arg:{0:"val1", 1:"val2"}}
 * 
 */

(function (qstring){
    if(qstring == '') return;
    var m,
      args = {}, 
      re = /([^\[\=\&\?]+)(?:\[{1}([^\]]+)\]{1})?\={1}([^\&]+)/g;
    while ((m = re.exec(qstring)) !== null) {
        if (m.index === re.lastIndex) re.lastIndex++;
        if(typeof m[2] != 'undefined'){
            if(typeof args[m[1]] == 'undefined') args[m[1]] = {};
            args[m[1]][m[2]] = m[3];
        }else{
            args[m[1]] = m[3];
        }
    }
    window.location.args = args;
})(window.location.search);

/*
 * Simple event handler to help determine if a mouse or touchscreen is being used.
 * This is by no means foolproof (on a touchscreen laptop it has no idea a mouse may be involved if the touch is triggered first)
 * Usage:
 * $('body').on('uiDetected', function(){
 *     if($(this).data('using-mouse')){
 *         console.log("A mouse was used first");
 *     }else{
 *         console.log("A touchscreen was used first");
 *     }
 * })
 * 
 */
(function($){
    $('body').on('mousemove touchstart', function(e){
	    $('body').off(e).data('using-mouse', (e.type === 'mousemove')).trigger('uiDetected');
    });
})(jQuery)

/*
 * Creates an event for the method, if "addClass" is sent in, an even named "addClass" 
 * will be fired every time that method is used. 
 */

(function($){
    $.methodEvent = function(m){
        if($.fn[m].isEvent) return;
        var om=$.fn[m];
        $.fn[m] = function(){
            var r=om.apply(this, arguments);
            $(this).trigger(m, arguments);
            return r;
        }
        $.fn[m].isEvent = true;
    }
    //$.methodEvent('addClass');
    //$('.post-wrapper').on('addClass', function(e){console.log('A class has been added!'});
})(jQuery);
