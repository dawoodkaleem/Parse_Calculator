import mongoose from 'mongoose';

// const passAttractionSchema = new mongoose.Schema({
//   passId: {
//     type: String,
//     required: true,
//   },
//   attractionId: {
//     type: String,
//     required: true,
//   }
// },);

// const PassAttraction = mongoose.model('PassAttraction', passAttractionSchema);

// export default PassAttraction;

const passAttractionSchema = new mongoose.Schema({
  passId: {
    type: String, // baseId like "gocity-pass"
    required: true,
    unique: true,
  },
  attractions: [
    {
      type: String, // or ObjectId if referencing actual place
    }
  ]
});

const PassAttraction = mongoose.model('PassAttraction', passAttractionSchema);
export default PassAttraction;
