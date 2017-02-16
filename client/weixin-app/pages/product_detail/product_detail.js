const product = require('../../api/product.js')

var wxParse = require('../../components/wxParse/wxParse.js')

Page({
    data: {
        product: {},
        tabActiveIndex: "tab0",
    },
    onLoad: function (params) {
        var id = params.id
        var that = this;

        product.productReadOne(id, function(result){
            var data = result.data 
            that.setData({
                'product': data,
            })
            wxParse.wxMoreParse('wx_description', 'html', data.description, that)
            wxParse.wxMoreParse('wx_product_specification', 'html', data.product_specification, that)
            wxParse.wxMoreParse('wx_sales_support', 'html', data.sales_support, that)
        });
    },
    tabClick: function (e) {
        this.setData({
            tabActiveIndex: e.currentTarget.id
        });
    }
})