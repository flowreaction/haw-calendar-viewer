const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const courseEventSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  lecturer: {
    type: String,
    required: false,
  },
  room: {
    type: String,
    required: false,
  },
  dstart: {
    type: String,
    required: true,
  },
  dend: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CourseEvent", courseEventSchema);
