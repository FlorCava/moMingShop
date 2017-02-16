/**
 * 货品
 */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const goodsSchema = Schema({
  goods_id: Number,
  name: String,
  description: String,
})
goodsSchema.plugin(mongoosePaginate)

const Counter = mongoose.model('Counter')
goodsSchema.pre('save', function (next) {
  let doc = this
  if (this.isNew) {
    Counter.findByIdAndUpdate({_id: 'goods_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error)
        return next(error)
      doc.goods_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})

mongoose.model('Goods', goodsSchema)