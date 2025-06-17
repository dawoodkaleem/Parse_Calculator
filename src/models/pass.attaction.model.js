import mongoose from 'mongoose';

const passAttractionSchema = new mongoose.Schema({
  passId: {
    type: String,
    required: true,
  },
  attractionId: {
    type: String,
    required: true,
  }
},);

const PassAttraction = mongoose.model('PassAttraction', passAttractionSchema);

export default PassAttraction;
