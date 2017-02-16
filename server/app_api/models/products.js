/**
 * 产品
 */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const specContentSchema = Schema({
  spec_id: Number,
  spec_name: String,
  sort_order: Number,
  spec_option: [{
    opt_id: Number,
    opt_name: String
  }]
})
const productContentSchema = Schema({
  specs: [{
    spec_id: Number,
    spec_name: String,
    opt_id: Number,
    opt_name: String,
  }],
  image: String,
  product_id: Number,
  product_price: Number,
  sku: String,
  status: String,
  stock_qty: Number
})

const productSchema = Schema({
  product_id: Number,
  product_name: {type: String, default: ''},
  second_title: {type: String, default: ''},
  product_specification: {type: String, default: ''}, // 产品规格
  product_specification_draft: {type: String, default: ''},
  sales_support: {type: String, default: ''}, // 包装售后
  sales_support_draft: {type: String, default: ''},
  description: {type: String, default: ''}, // 产品图文介绍
  description_draft: {type: String, default: ''},
  baseImage: {type: String, default: ''}, // 产品主要图片
  thumbnail: {type: String, default: ''}, // 产品缩略图，根据产品主要图片生成
  // brand: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Brand'
  // }, // 产品分类
  brandId: {type: String, default: ''}, // 所属品牌
  brandName: {type: String, default: ''},
  goodsId: {type: String, default: ''}, // 所属货品
  goodsName: {type: String, default: ''},
  categoryId: {type: String, default: ''}, // 所属分类
  categoryName: {type: String, default: ''},
  images: [{
    type: String
  }], // 产品详情轮播图
  is_saleable: {type: Boolean, default: true}, // 标记是否可卖
  price: {type: Number, default: 0},
  sku: {type: String, default: ''},
  status: {type: String, default: ''},

  // 产品规格／库存选项
  options: {
    spec_content: [specContentSchema],
    product_content: [productContentSchema]
  },

  // 如下字段待补充功能后添加
  // is_presale: Boolean, // 是否预售
  // is_in_stock: Boolean,
  // presale_description: String,
  // product_type: String,
  // promotion_desc: String,
  // properties: [{
  //     type: String
  // }],
  // restriction_desc: String,
  // stock: String,
  // stock_qty: Number,
})
productSchema.plugin(mongoosePaginate)

const Counter = mongoose.model('Counter')

productSchema.pre('save', function (next) {
  let doc = this
  if (this.isNew) {
    Counter.findByIdAndUpdate({_id: 'product_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error) {
        return next(error)
      }
      doc.product_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})
productSchema.pre('save', function (next) {
  let doc = this
  if (this.isNew) {
    doc.sku = `${doc.categoryId}-${doc.brandId}-${doc.product_id}`
    doc.options = {
      spec_content: [],
      product_content: []
    }
  }
  return next()
})
productContentSchema.pre('save', function (next) {
  let doc = this
  if (doc.product_id == 0) {
    Counter.findByIdAndUpdate({_id: 'product_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error) {
        return next(error)
      }
      doc.product_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})
productContentSchema.pre('save', function (next) {
  let doc = this
  if (doc.sku === '') {
    doc.sku = `${doc.parent().sku}|${doc.product_id}`
  }
  return next()
})

mongoose.model('Product', productSchema)