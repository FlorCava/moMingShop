/**
 * 订单
 */
const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const orderItemSchema = Schema({
  item_id: Number,
  sku: String,
  product_id: Number,
  price: Number,
  qty: Number,
})

const orderSchema = Schema({
  order_id: Number,
  total_amount: Number,
  discount_amount: Number,
  paid_amount: Number,
  items: [orderItemSchema],
  is_need_pay: Boolean,
  order_status: String,
  total_qty: Number,
  order_description: String,
  address: {
    name: String,
    mobile: String,
    region: String,
    city: String,
    district: String,
    street: String,
    postcode: String
  }
})
orderSchema.plugin(mongoosePaginate)

const Counter = mongoose.model('Counter')

orderSchema.pre('save', function (next) {
  let doc = this
  if (this.isNew) {
    Counter.findByIdAndUpdate({_id: 'order_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error) {
        return next(error)
      }
      doc.order_id = counter.seq
      next()
    })
  } else {
    return next()
  }
})
orderItemSchema.pre('save', function (next) {
  let doc = this
  if (doc.product_id == 0) {
    Counter.findByIdAndUpdate({_id: 'item_id'}, {$inc: {seq: 1}}, {
      new: true,
      upsert: true
    }, function (error, counter) {
      if (error) {
        return next(error);
      }
      doc.item_id = counter.seq;
      next()
    });
  } else {
    return next()
  }
})

mongoose.model('Order', orderSchema)