const mongoose = require("mongoose");

const { Schema } = mongoose;

const ContactSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ["male", "female"] },
  portalOwnerId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
});

module.exports = mongoose.model("Contacts", ContactSchema);
