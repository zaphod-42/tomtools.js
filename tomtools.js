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
