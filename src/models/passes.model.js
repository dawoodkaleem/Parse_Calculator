// import mongoose from 'mongoose'

// const PassesSchema = new mongoose.Schema({
//   passId: {
//     type: String,
//     required: true,
//   },
//   en_passName: {
//     type: String,

//   },
//   de_passName: {
//     type: String,

//   },
//   parsePriceAdult: {
//     type: Number,
//     required: true,
//   },
//   en_passaffilated_link: {
//     type: String,
//     // required: false,
//   },
//   de_passaffilated_link: {
//     type: String,
//     // required: false,
//   },
//   parseImagelink: {
//     type: String,
//     // required: false,
//   }
// },);

// const ParsePasses = mongoose.model('ParsePasses', PassesSchema);

// export default ParsePasses;


import mongoose from 'mongoose';

const PassSchema = new mongoose.Schema({
  passId: {
    type: String,
    required: true,
    unique: true,
  },
  en_passName: {
    type: String,
  },
  de_passName: {
    type: String,
  },
  priceAdult: {
    type: Number,
    required: true,
  },
  en_passaffilated_link: {
    type: String,
  },
  de_passaffilated_link: {
    type: String,
  },
  imageLink: {
    type: String,
  }
});

const Pass = mongoose.model('Pass', PassSchema);
export default Pass;
