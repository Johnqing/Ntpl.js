(function(globle, undefined){
    // 防止重复调用
    if(globle.NTpl){
        return;
    }
    if(!globle.exports){
        globle.exports = {};
    }
    // 命名空间
    var NT = globle.NTpl = globle.NT = exports.NT = {
        openTag: '<%',
        closeTag: '%>'
    };

    /*
    * unit
     */
    var logicInTpl = {},
        _cache = {},
        vars = 'var ',
        _isNewEngine = ''.trim,
        codesArr = _isNewEngine ? ['ret = "";', 'ret +=', ';', 'ret;'] : ['ret = [];', 'ret.push(', ')', 'ret.join("");'];

    // 数组迭代方法
    var _forEach = Array.prototype.forEach || function (block, thisObject) {
        var len = this.length >>> 0;

        for (var i = 0; i < len; i++) {
            if (i in this) {
                block.call(thisObject, this[i], i, this);
            }
        }

    };

    // js关键字表
    var _keyWordsMaps = {};

    _forEach.call((
        // 关键字
        'break,case,catch,continue,debugger,default,delete,do,else,false,finally,for,function,if'
        + ',in,instanceof,new,null,return,switch,this,throw,true,try,typeof,var,void,while,with'
        // 保留字
        + ',abstract,boolean,byte,char,class,const,double,enum,export,extends,final,float,goto'
        + ',implements,import,int,interface,long,native,package,private,protected,public,short'
        + ',static,super,synchronized,throws,transient,volatile'

        // ECMA 5 - use strict
        + ',arguments,let,yield'
    ).split(','), function(key){
        _keyWordsMaps[key] = true;
    });
    // 错误处理
    function _debug(e){
        var content = '[template]:\n'
            + e.id
            + '\n\n[name]:\n'
            + e.name;


        if(e.message){
            content += '\n\n[message]:\n'
                    + e.message;
        }

        if(e.line){
            content += '\n\n[line]:\n'
                    + e.line;
        }


        if(e.temp){
            content += '\n\n[temp]:\n'
                + e.temp;
        }

        if(globle.console){
            console.error(content);
        }
    }
    /**
     * 获取字符串缓存，没有则为设置
     * @param {String} id
     * @returns {String}
     * @private
     */
    function _getCache(id){
        var cache = _cache[id];

        if(!cache){
            var elem = document.getElementById(id);
            if(elem){
                exports.compile(id, elem.value || elem.innerHTML);
            }
            return _cache[id];
        }
        return cache;
    }

    /**
     * 数据解析
     * @param v
     * @param $data
     * @returns {*}
     */
    function getValue(v, $data){
        try{
            return $data.hasOwnProperty(v) ? $data[v] : globle[$data];
        } catch (e){
            return;
        }

    }
    /**
     * js逻辑处理
     * @param source
     */
    function dealLogic(source){
        source = source.replace(/\/\*.*?\*\/|'[^']*'|"[^"]*"|\.[\$\w]+/g, '');
        var sArr = source.split(/[^\$\w\d]+/);

        _forEach.call(sArr, function(logic){
            if(!logic || _keyWordsMaps[logic] || /^\d/.test(logic)){
                return;
            }
            if(!logicInTpl[logic]){
                vars += logic + '= $getValue("' + logic + '"),';
                logicInTpl[logic] = 1;
            }
        })
    }
    /**
     * js|html 解析
     * @param source
     * @returns {string}
     * @private
     */
    function _html(source){

        source = source.replace(/('|"\\)/g, '\\$1')
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n');

        source = codesArr[1] + '"' + source + '"' + codesArr[2];

        return source + '\n';
    }
    function _js(source){

        if(/^=/.test(source)){
            source = codesArr[1] + source.substring(1).replace(/[\s;]*$/, '') + codesArr[2];
        }

        dealLogic(source)

        return source;
    }
    /**
     * 解析模板
     * @param source
     * @returns {Function}
     * @private
     */
    function _compile(source){

        var openArr = source.split(NT.openTag),
            tempCode = '';

        _forEach.call(openArr, function(code){
            var codeArr = code.split(NT.closeTag);
            var c0 = codeArr[0],
                c1 = codeArr[1];
            if(codeArr.length == 1){
                tempCode += _html(c0);
            } else{

                tempCode += _js(c0);
                tempCode += c1 ? _html(c1) : '';
            }
        });


        var code = 'function $getValue(key){return $data.hasOwnProperty(key) ? $data[key] : this[$data];};'
            + vars + codesArr[0] + tempCode + 'return '+ codesArr[3];
        try{
            return new Function('$data', code);
        } catch (e){

        }
    }

    /**
     *  globle
     */
    exports.compile = function(id, source){
        // 只传入字符串
        if(typeof source != 'string'){
            source = id;
            id = null
        }


        try{
            var cache = _compile(source);
        } catch (e){
            // 出错时，定位行数和内容
            e.id = e.id || source;
            e.name = 'Syntax Error';
            return _debug(e);
        }

        if(id){
            _cache[id] = cache;
        }
        //console.log(cache);
        return cache;

    }

    // 接口
    NT.tpl = function(id, data, settings){
        var cache = _getCache(id);

        if(cache === undefined){
            return _debug({
                id: id,
                name: 'Rend Error',
                message: 'Not get template'
            });
        }
        return data ? cache(data) : cache;
    }


})(this);