/* 
 * Automatically parses query string of the current page into an object and attaches it to window.location
 * The significant thing about this is it handles array syntax in the query string as well:
 * ?nested[0][1]=test&nested[0][2]=test12&layers[something]&unnested
 * Becomes:
 * {nested:{0:{1:"test", 2:"test12"}, something: true}, unnested: true}
 * 
 */

(function(str){
 	if(str[0] == '?' || str[0] == '#') str=str.substring(1);
  	var vals = str.split('&'),
      	args={},
      	kre = /([^\[\]]+)/g;
  	for(var i=0; i<vals.length; i++){
    		var parts = vals[i].split('='),
		    val = (parts.length == 1) ? true : parts[1],
    		    pntr=args,
    		    keys=[];
    		while ((m = kre.exec(parts[0])) !== null) {
      			if (m.index === kre.lastIndex) kre.lastIndex++;
      			keys.push(m[0]);
    		}
    		for(var j=0; j<keys.length; j++){
    			if(j+1 == keys.length){
      				pntr[keys[j]]=val;
      			}else{
      				if(typeof pntr[keys[j]] == 'undefined') pntr[keys[j]] = {};
      				pntr=pntr[keys[j]];
      			}
    		}
  	}
	window.location.args = args;
})(window.location.search);
//testArgs = parseArgs("?nested[0][1]=test&nested[0][2]=test12&layers[something]&unnested");
//console.log(testArgs.layers[0]);

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

/*
 * Basically adds some Array.prototype methods. This is not added to the object prototype for obvious reasons.
 */

class TomExt{
    constructor(d){
        if(!d) return;
        if(d.constructor == Object) d = Object.entries(d);
        if(d.constructor == Array) d.forEach(e => this[e[0]] = e[1]);
    }
    forEach(f){
        Object.entries(this).forEach(e => f(...e.reverse()));
        return this;
    }
    map(f){
        this.forEach((v, k) => {
            this[k] = f(v, k);
        });
        return this;
    }
    filter(f){
        this.forEach((v, k) => {
            if(!f(v, k)) delete this[k];
        });
        return this;
    }
}
