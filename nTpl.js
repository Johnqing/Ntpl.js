/**
 * @param str{String} dom结点ID，或者模板string
 * @param data{Object} 需要渲染的json对象，可以为空。当data为{}时，仍然返回html。
 * @return 如果无data，直接返回编译后的函数；如果有data，返回html。
*/
(function(win, undefined){
    var NTpl = win.NTpl = win.NTpl || {},
        doc = win.document;
    /**
     * 数据解析
     * @param data
     * @returns {string}
     */
    var dataCmd = function(data){
        var _data = '\nvar helper = this,\n';
        for(title in data){
            _data += (title+' = $data["'+title+'"],\n');
        };
        _data += '$out=0;'
        return _data;
    };
    /**
     * 编译器
     * @param str
     * @param data
     * @returns {Function}
     * @private
     */
    var _compile  = function(str, data){
        var fnBody = "var _tpl_array=[];\nvar fn=(function(){"+dataCmd(data)+"\n_tpl_array.push('"+_analysisStr(str)+"');\n_tplName=null;\n})();\nfn = null;\nreturn _tpl_array.join('');";
        return new Function('$data', fnBody);
    };

    /**
     * 对外接口函数
     * @param str id
     * @param data 数据
     * @returns {*}
     */
    NTpl.tpl = function(str, data){
        data = typeof data === 'object' ? data : null;
        var fn = (function(){
            var elem = doc.getElementById(str);
            if(elem){
                if(nt.cache[str]){
                    return nt.cache[str];
                }
                var html = /^(textarea|input)$/i.test(elem.nodeName) ? elem.value : elem.innerHTML;
                return _compile(html, data);
            }else{
                return _compile(str, data);
            }
        })();
        //console.log(fn);
        var result =  fn( data );
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
