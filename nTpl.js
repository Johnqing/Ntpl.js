/**
 * @param str{String} dom结点ID，或者模板string
 * @param data{Object} 需要渲染的json对象，可以为空。当data为{}时，仍然返回html。
 * @return 如果无data，直接返回编译后的函数；如果有data，返回html。
*/
(function(window, undefined){
    var NTpl = window.NTpl = window.NTpl || {},
        doc = window.document;
        
    /**
     * 编译器
     * @param str
     * @returns {Function} 返回模板拼接函数
     * @private
     */
    var _compile  = function(str){
        var fnBody = "var _tpl_array=[];\nvar fn=(function(__data__){\nvar _tplName='';\nfor(name in __data__){\n_tplName+=('var '+name+'=__data__[\"'+name+'\"];');\n};\neval(_tplName);\n_tpl_array.push('"+_analysisStr(str)+"');\n_tplName=null;\n})(tplObj);\nfn = null;\nreturn _tpl_array.join('');";
        return new Function('tplObj', fnBody);
    };

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
                if(nt.cache[str]){
                    return nt.cache[str];
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
    /**
     * 分隔符
     * @type {string}
     */
    NTpl.leftDelimiter =  NTpl.leftDelimiter || '<%';
    NTpl.rightDelimiter = NTpl.rightDelimiter || '%>';
    /**
     * 解析器
     * @param str
     * @returns {string} 返回模板
     * @private
     */
    var _analysisStr = function(str){
        var lit = new RegExp("((^|"+NTpl.rightDelimiter+")[^\t]*)'","g"),
            lit2 = new RegExp("\t=(.*?)"+NTpl.rightDelimiter,"g");
        var tpl = str.replace(/[\r\t\n]/g, " ")
            .replace(/=\s/g,'=')
            .split(NTpl.leftDelimiter).join("\t")
            .replace(lit, "$1\r")
            .replace(lit2, "',$1,'")
            .split("\t")
            .join("');")
            .split(NTpl.rightDelimiter)
            .join("_tpl_array.push('")
            .split("\r")
            .join("\\'");
        return tpl;
    };
    /**
     * 命名空间
     * @type {*}
     */
    var nt = NTpl.tpl;
    /**
     * 缓存
     */
    nt.cache = {};
}(this));
