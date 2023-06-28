const mongoose = require('mongoose')
const { Schema } = mongoose;

const detailConfig = {
    type: String,
}

const RandomDetailsModel = new Schema({
    fullname: detailConfig,
    user_email: detailConfig
  })

const RandomDetails = mongoose.models.RandomDetails ||  mongoose.model('RandomDetails', RandomDetailsModel)

module.exports = RandomDetails