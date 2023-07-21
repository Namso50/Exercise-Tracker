const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  count: Number,
  log: [{
    _id: false,
    description: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      required: true
    },
    date: Date
  }]
})

module.exports = mongoose.model("User", userSchema)