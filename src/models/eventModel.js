const { default: mongoose } = require("mongoose");
const db = require("../configs/connectDb");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  titleAddress: {
    type: String,
    required: true,
  },
  location: {
    type: Object,
    required: true,
  },
  users: {
    type: [String],
  },
  authorId: {
    type: String,
    required: true,
  },
  photoUrl: {
    type: String,
    required: true,
  },
  startAt: {
    type: Number,
    required: true,
  },
  endAt: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    default: Date.now(),
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

const EventModel = db.model("events", EventSchema);

module.exports = EventModel;
