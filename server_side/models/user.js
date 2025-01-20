const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      trim: true,
      required: true,
      max: 16,
      // unique: true,
      // index: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      trim: true,
      required: true,
      max: 100,
    },
    email: {
      type: String,
      // unique: true,
      trim: true,
      lowercase: true,
    },
    hashedPassword: {
      type: String,
      required: true,
      default: "abcdefj",
    },
    salt: String,
    role: {
      type: String,
      default: "Staff",
    },
    rolesHistory: [
      {
        roleName: String, 
        dateStart: Date, 
        dateEnd: Date 
      },
    ],
    resetPasswordLink: {
      data: String,
      default: "",
    },
  },
  { timestamps: true }
);

//Virtual fields
userSchema
  .virtual("password")
  .set(function (password) {
    //Creating a temporaly variable called _password
    this._password = password;

    //Generate salt
    this.salt = this.makeSalt();
    //Encrypt password
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });
//Methods > authenticate, encryptPassword, makeSalt
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  encryptPassword: function (password) {
    if (!password) {
      return "";
    }
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (error) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
};
//Export user model
module.exports = mongoose.model("User", userSchema);
