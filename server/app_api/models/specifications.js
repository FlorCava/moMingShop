/**
 * 商品属性
 */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const specificationOptionSchema = Schema({
  opt_id: Number,
  name: String,
  description: String
})

const specificationSchema = Schema({
  spec_id: Number,
  name: String,
  goodsId: String,
  goodsName: String,
  sort_order: Number,
  description: String,
  options: [specificationOptionSchema]
})
specificationSchema.plugin(mongoosePaginate)

specificationSchema.pre('save', function (next) {
  let doc = this
  if (this.isModified('goodsId') || this.isNew) {
    if (doc.goodsId !== '') {
      var Goods = mongoose.model('Goods');
      Goods.findOne({goods_id: doc.goodsId})
        .exec(function (err, goods) {
          if (err) {
            return next(err)
          } else {
            doc.goodsName = goods.name
            next()
          }
        })
    } else {
      doc.goodsName = ''
      next()
    }
  } else {
    return next()
  }
})

const Counter = mongoose.model('Counter')
specificationOptionSchema.pre('save', function (next) {
  let doc = this
  if (this.isNew) {
    Counter.findByIdAndUpdate({_id: 'specification_option_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error)
        return next(error)
      doc.opt_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})

specificationSchema.pre('save', function (next) {
  let doc = this
  if (this.isNew) {
    Counter.findByIdAndUpdate({_id: 'specification_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error)
        return next(error)
      doc.spec_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})

mongoose.model('Specification', specificationSchema)