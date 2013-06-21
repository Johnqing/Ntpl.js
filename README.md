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
<!--textarea作为容器的好处是浏览器不会解析-->
<textarea id="tpl" style="display:none">
    <h1>title:<%= title %></h1>
        <% if(list.length>1) { %>
            <h2>输出list，共有<%= list.length %>个元素</h2>
            <ul>
                <% for(var i=0;i<5;i++){ %>
                    <li><%= list[i] %></li>
                <% } %>
            </ul>
        <% }else{ %>
            <h2>没有list数据</h2>
        <% } %>
</textarea>
</pre>
3. 模板也可以直接存储在一个变量中（下面的例子：可以在[这里](https://github.com/Johnqing/SocialCard/blob/master/assets/js/controller.js)找到）
<pre>
 var tpl = '<% for(var i=0; i<data.length; i++){ %>'+
              '<div class="familyName">'+
                  '<span><%= data[i].name %></span>'+
                  '<dl>'+
                  '<% for(var j=0, family=data[i].family; j<family.length; j++){ %>'+
                      '<dd class="<%= family[j].type %>"><%= family[j].name %></dd>'+
                  '<% } %>'+
                  '</dl>'+
              '</div>'+
          '<% } %>';
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
NTpl.tpl('<div><%= name %></div>', data);
</pre>
5. 插入容器
<pre>
document.getElementById('result').innerHTML = res;
</pre>

##模板语法##

分隔符为&lt;%%&gt;

判断语句：
<pre>
<%if(list.length){%>
    <h2><%=list.length%></h2>
<%}else{%>
    <h2>list长度为0<h2>
<%}%>

循环语句：

<pre>
<% for(var i=0;i<5;i++){ %>
    <li><%= list[i] %></li>
<% } %>
</pre>


