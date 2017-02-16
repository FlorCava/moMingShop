/**
 * 商品属性
 */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const propertyOptionSchema = Schema({
  name: String,
  description: String
})

const propertySchema = Schema({
  prop_id: Number,
  name: String,
  categoryId: String,
  categoryName: String,
  sort_order: Number,
  description: String,
  options: [propertyOptionSchema]
})
propertySchema.plugin(mongoosePaginate)

propertySchema.pre('save', function (next) {
  let doc = this
  if (this.isModified('categoryId') || this.isNew) {
    if (doc.categoryId !== '') {
      var Category = mongoose.model('Category');
      Category.findOne({category_id: doc.categoryId})
        .exec(function (err, category) {
          if (err) {
            return next(err)
          } else {
            doc.categoryName = category.name
            next()
          }
        })
    } else {
      doc.categoryName = ''
      next()
    }
  } else {
    return next()
  }
})

const Counter = mongoose.model('Counter')
propertySchema.pre('save', function (next) {
  let doc = this
  if (this.isNew) {
    Counter.findByIdAndUpdate({_id: 'property_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error)
        return next(error)
      doc.prop_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})

mongoose.model('Property', propertySchema)