/**
 * 商品分类
 */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const categorySchema = Schema({
  category_id: Number,
  name: String,
  parentId: String,
  sort_order: Number,
  description: String
})
categorySchema.plugin(mongoosePaginate)

const Counter = mongoose.model('Counter')
categorySchema.pre('save', function (next) {
  let doc = this
  if (this.isNew) {
    Counter.findByIdAndUpdate({_id: 'category_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error)
        return next(error)
      doc.category_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})

mongoose.model('Category', categorySchema)