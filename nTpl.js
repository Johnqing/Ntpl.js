/**
 * @author johnqing
 * @blog http://johnqing.github.io/
 * @param str{String} dom结点ID，或者模板string
 * @param data{Object} 需要渲染的json对象，可以为空。当data为{}时，仍然返回html。
 * @return 如果无data，直接返回编译后的函数；如果有data，返回html。
 * @up: 模板拼接改为字符串拼接，提升高版本浏览器模板拼接速度
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
        var fnBody = "var _t='',_tn,fn=(function(d){\n_tn='';\nfor(n in d){\n_tn+=('var '+n+'=d[\"'+n+'\"];');\n};\neval(_tn);\n_t +='"+_analysisStr(str)+"';\n_tn=null;\n})(tplObj);\nfn = null;\nreturn _t;";
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
                //缓存编译后的函数模板
                if(nt.cache[str]){
                    return nt.cache[str];
                }
                var html = /^(textarea|input)$/i.test(elem.nodeName) ? elem.value : elem.innerHTML;
                return nt.cache[str] = _compile(html);
            }else{
                return _compile(str);
            }
        })();
        //有数据则返回HTML字符串，没有数据则返回函数
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
            .replace(lit2, "'+$1+'")
            .split("\t")
            .join("';")
            .split(NTpl.rightDelimiter)
            .join("_t += '")
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
