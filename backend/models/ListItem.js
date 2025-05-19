const mongoose = require("mongoose");

const listItemSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: Number, required: true },
  notes: { type: String },
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("ListItem", listItemSchema);
