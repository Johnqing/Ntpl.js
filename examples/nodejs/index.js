var NT = require('./../../nTpl');
var data={
    "curr_page": 1,
    pages: 0,
    "record":[
        {
            finish_time: '2010-1-1',
            amount: '12',
            channel: '网银',
            order_id: 'xsd123552385'
        }
    ],
    result_code: "0000",
    total: 0
}


var TMP = '<% if(record.length <= 0) { %>'+
    '<div class="details_tips"><a href="/deposit/recharge">充值</a></div>'+
    '<% }else{ %>'+
        '<table class="tb_list" border="0" cellspacing="0" cellpadding="0">'+
            '<tr>'+
                '<th>时间</th>'+
                '<th>充值数量</th>'+
                '<th>充值方式</th>'+
                '<th>订单号</th>'+
            '</tr>'+
            '<% for(var i=0; i<record.length; i++){ %>'+
                '<tr>'+
                    '<td><%= record[i].finish_time %></td>'+
                    '<td><%= record[i].amount %></td>'+
                    '<td><%= record[i].channel %></td>'+
                    '<td><%= record[i].order_id %></td>'+
                '</tr>'+
            '<% } %>'+
        '</table>'+
    '<% } %>';



console.log(NT.tpl(TMP, data));