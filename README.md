NT模板引擎
=========

NT 是一个高效、轻量的前端 (Javascript) 模板引擎，使用 NT 可以使你的代码实现数据和视图模型的分离(MVC)。

> 介于以前的NT太丑的原因，现增加NT命名

## NT 的引入

```
<script type="text/javascript" src="nTpl.min.js></script>
```

## nodejs

```
npm install n-tpl
```

## 使用方法

编译模板并根据所给的数据立即渲染出结果.

```
NT.tpl(tpl, data);
```

仅编译模版暂不渲染，它会返回一个可重用的编译后的函数.

```
var compiled = NT.compile(tpl);
var html = compiled(data);
```

自定义模板语法边界符

```
NT.openTag = '<#'
NT.closeTag = '#>'
```
### 一个比较复杂的实例

<pre>
//字体渲染
var fontFamily = {
    tpl: function(){
        var tpl = '&lt;% for(var i=0; i&lt;data.length; i++){ %&gt;'+
                '&lt;div class="familyName"&gt;'+
                    '&lt;span&gt;&lt;%= data[i].name %&gt;&lt;/span&gt;'+
                    '&lt;dl&gt;'+
                    '&lt;% for(var j=0, family=data[i].family; j&lt;family.length; j++){ %&gt;'+
                        '&lt;dd class="&lt;%= family[j].type %&gt;"&gt;&lt;%= family[j].name %&gt;&lt;/dd&gt;'+
                    '&lt;% } %&gt;'+
                    '&lt;/dl&gt;'+
                '&lt;/div&gt;'+
            '&lt;% } %&gt;';
        return tpl;
    },
    data: [
        {
            name: '姓名',
            family: [
                {
                    name: '宋体',
                    type: '宋体'
                },
                {
                    name: '宋体+粗',
                    type: '宋体 bold'
                },
                {
                    name: '微软雅黑',
                    type: '微软雅黑'
                },
                {
                    name: 'Arial',
                    type: 'Arial'
                },
                {
                    name:  'Arial Bold',
                    type: 'Arial bold'
                },
                {
                    name: 'Arial Bold Italic',
                    type: 'Arial bold italic'
                },
                {
                    name: 'Arial Italic',
                    type: 'Arial italic'
                }
            ]
        }
    ]
};
var familyTpl = NTpl.tpl(fontFamily.tpl(),fontFamily);
document.getElementById('result').innerHTML = familyTpl;
</pre>


## 使用项目

+ [360支付中心](https://pay.360.cn)
