/**
 * 商品品牌
 */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const brandSchema = Schema({
  brand_id: Number,
  name: String,
  logo: String,
  description: String
})
brandSchema.plugin(mongoosePaginate)

const Counter = mongoose.model('Counter')
brandSchema.pre('save', function (next) {
  let doc = this;
  if (this.isNew) {
    Counter.findByIdAndUpdate({_id: 'brand_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error)
        return next(error)
      doc.brand_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})

mongoose.model('Brand', brandSchema)