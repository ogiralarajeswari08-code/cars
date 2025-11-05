const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  inOutStatus: { type: String, enum: ['IN', 'OUT'], default: 'IN' },
  inOutDateTime: { type: Date, default: Date.now },
  regNo: { type: String, required: true, index: true },
  make: String,
  model: String,
  variant: String,
  year: Number,
  colour: String,
  kmp: Number,
  personName: String,
  cellNo: String,
  price: Number,
  photos: [String],
  video: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Indexes for faster queries and text search
carSchema.index({ regNo: 1 });
carSchema.index({ personName: 1 });
carSchema.index({ make: 1, model: 1 });
carSchema.index({ inOutDateTime: 1 });
// text index for generic search across several fields
carSchema.index({ regNo: 'text', make: 'text', model: 'text', personName: 'text' });

module.exports = mongoose.model('Car', carSchema);
