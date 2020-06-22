var mongoose = require('mongoose');
  const { Schema } = mongoose;

  var logEntrySchema = new Schema({
    title:  {
       type : String,
       required : true,
    }, 
    description: String,
    comments:   String,
    image: String,
    rating: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },
    visitDate: {
        type: Date,
    },
    latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
    },
    longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
    }}, {timestamps: true,
  });

  const LogEntry = mongoose.model('logEntry',logEntrySchema);

  module.exports = LogEntry;