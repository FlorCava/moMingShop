const mongoose = require('mongoose')
const Schema = mongoose.Schema

const slideSchema = Schema({
    name: {
        type: String,
        required: true
    },
    img: String,
    url: String,
    type: String
})

mongoose.model('Slide', slideSchema)