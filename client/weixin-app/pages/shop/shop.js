var sliderWidth = 80; // 需要设置slider的宽度，用于计算中间位置

const app = getApp()
const category = require('../../api/category.js')
const product = require('../../api/product.js')

Page({
    data: {
        categories: [],
        category_products: [],
        activeIndex: "0",
        sliderOffset: 0,
        sliderLeft: 0
    },
    onLoad: function () {
        var that = this;

        category.categoryList(function(result){
            var data = result.data; 
            that.setData({
                'categories': data,
                'sliderLeft': (app.globalData.windowWidth / data.length - sliderWidth) / 2
            })
            // 默认加载第一个分类的产品列表
            if(data.length > 0){
                product.productListByCategory(data[0].category_id, function(resultProducts){
                    var dataProduct = resultProducts.data;
                    that.setData({
                        'category_products': dataProduct
                    })
                })
            }
        });
    },
    tabClick: function (e) {
        //调用应用实例的方法获取全局数据
        app.getUserInfo(function(userInfo){
            //更新数据
            console.log(userInfo);
        })
        var that = this;
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
        product.productListByCategory(e.currentTarget.dataset.value, function(result){
            var data = result.data;
            that.setData({
                'category_products': data
            })
        })
    },
    bindShowProductDetail: function (e) {
        wx.navigateTo({
            url: `../product_detail/product_detail?id=${e.currentTarget.dataset.id}`
        })
    }
});