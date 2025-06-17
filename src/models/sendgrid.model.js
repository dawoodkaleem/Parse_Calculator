import mongoose from 'mongoose'

const SendgridSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: false,
  }
}, { timestamps: true });

const Sendgrid = mongoose.model('Sendgrid', SendgridSchema); // its should be send email

export default Sendgrid;