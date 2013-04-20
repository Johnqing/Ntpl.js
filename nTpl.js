/**
 * @param str{String} dom结点ID，或者模板string
 * @param data{Object} 需要渲染的json对象，可以为空。当data为{}时，仍然返回html。
 * @return 如果无data，直接返回编译后的函数；如果有data，返回html。
*/
(function(win, undefined){
    var NTpl = win.NTpl = win.NTpl || {},
        doc = win.document;
    /**
     * 编译器
     * @param str
     * @returns {Function} 返回模板拼接函数
     * @private
     */
    var _compile  = function(str){
        var fnBody = "var _tpl_array=[];\nvar fn=(function(__data__){\nvar _tplName='';\nfor(name in __data__){\n_tplName+=('var '+name+'=__data__[\"'+name+'\"];');\n};\neval(_tplName);\n_tpl_array.push('"+_analysisStr(str)+"');\n_tplName=null;\n})(tplObj);\nfn = null;\nreturn _tpl_array.join('');";
        return new Function('tplObj', fnBody);
    }
    /**
     * 解析器
     * @param str
     * @returns {string} 返回模板
     * @private
     */
    var _analysisStr = function(str){
        var tpl = str.replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t")
            .join("');")
            .split("%>")
            .join("_tpl_array.push('")
            .split("\r")
            .join("\\'");
        return tpl;
    }
    /**
     * 对外接口函数
     * @param str id
     * @param data 数据
     * @returns {*}
     */
    NTpl.tpl = function(str, data){
        var fn = (function(){
            var elem = doc.getElementById(str);
            if(elem){
                if(Nt.cache[str]){
                    return Nt.cache[str];
                }
                var html = /^(textarea|input)$/i.test(elem.nodeName) ? elem.value : elem.innerHTML;
                return _compile(html);
            }else{
                return _compile(str);
            }
        })();
        var result = typeof data === 'object' ? fn( data ) : fn;
        fn = null;
        return result;
    };

    var Nt = NTpl.tpl;
    /**
     * 缓存
     */
    Nt.cache = {};
}(this));
