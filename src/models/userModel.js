const { default: mongoose } = require("mongoose");
const db  = require("../configs/connectDb")

const UserSchema = new mongoose.Schema({
  fullname: {
    type: String,
  },
  givenName:{
    type: String
  },
  familyName:{
    type: String
  },
  photoUrl:{
    type: String
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
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

const UserModel = db.model("users", UserSchema);

module.exports = UserModel;
