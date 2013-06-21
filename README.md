Ntpl模板引擎
=========

> 既然是js模板引擎，当然使用js的语法去渲染

##描述##

提供一套模板解析语法，用户可以写一个模板块，每次根据传入的数据，
生成对应数据产生的HTML片段，渲染不同的效果。


##优势##

1. 使用Javascript原生语法，学习成本低
2. 变量未定义自动输出为空，防止页面错乱

##用法##

1. 引入ntpl.js是必须的
2. 可以使用任何容器存储模板片段(示例中使用textarea作为容器)
<pre>
&lt;!--textarea作为容器的好处是浏览器不会解析--&gt;
&lt;textarea id="tpl" style="display:none"&gt;
    &lt;h1&gt;title:&lt;%= title %&gt;&lt;/h1&gt;
        &lt;% if(list.length&gt;1) { %&gt;
            &lt;h2&gt;输出list，共有&lt;%= list.length %&gt;个元素&lt;/h2&gt;
            &lt;ul&gt;
                &lt;% for(var i=0;i&lt;5;i++){ %&gt;
                    &lt;li&gt;&lt;%= list[i] %&gt;&lt;/li&gt;
                &lt;% } %&gt;
            &lt;/ul&gt;
        &lt;% }else{ %&gt;
            &lt;h2&gt;没有list数据&lt;/h2&gt;
        &lt;% } %&gt;
&lt;/textarea&gt;
</pre>
3. 模板也可以直接存储在一个变量中（下面的例子：可以在[这里](https://github.com/Johnqing/SocialCard/blob/master/assets/js/controller.js)找到）
<pre>
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
</pre>

##调用##

1. 数据
<pre>
var data={
    "title":'啊哦~这是标题',
    "list":[
        'test1:这是内容',
        'test2:2',
        'test3:3',
        'test4:第五项未定义，模板系统会输出空'
    ]
};
</pre>

2. NTpl是该模板引擎的命名空间
<pre>
NTpl.tpl
</pre>
3. tpl接收容器id
<pre>
NTpl.tpl('id', data);
</pre>
4. tpl也接收字符串
<pre>
NTpl.tpl('&lt;div&gt;&lt;%= name %&gt;&lt;/div&gt;', data);
</pre>
5. 插入容器
<pre>
document.getElementById('result').innerHTML = res;
</pre>

##模板语法##

分隔符为&lt;%%&gt;

判断语句：

<pre>
&lt;%if(list.length){%&gt;
    &lt;h2&gt;&lt;%=list.length%&gt;&lt;/h2&gt;
&lt;%}else{%&gt;
    &lt;h2&gt;list长度为0&lt;h2&gt;
&lt;%}%&gt;
</pre>

循环语句：

<pre>
&lt;% for(var i=0;i&lt;5;i++){ %&gt;
    &lt;li&gt;&lt;%= list[i] %&gt;&lt;/li&gt;
&lt;% } %&gt;
</pre>

###一个比较复杂的实例###

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
var familyTpl = Ntpl.tpl(fontFamily.tpl(),fontFamily);
document.getElementById('result').innerHTML = familyTpl;
</pre>

