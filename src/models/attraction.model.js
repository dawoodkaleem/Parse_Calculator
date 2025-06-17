import mongoose from "mongoose";

const AttractionSchema = new mongoose.Schema(
  {
    attractionId: {
      type: String,
      required: true,
      unique: true,
    },
    en_attraction_name: {
      type: String,
    },
    de_attraction_name: {
      type: String,
    },
    pass_price_adult: {
      type: Number
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    gocity_day_pass: {
      type: Boolean,
    },
    gocity_flex_pass: {
      type: Boolean,
    },

    sightseeing_day_pass: {
      type: Boolean,
    },
    sightseeing_flex_pass: {
      type: Boolean,
    },
    sightseeing_economy_pay_day_pass: {
      type: Boolean,
    },
    sightseeing_economy_pay_flex_pass: {
      type: Boolean,
    },
    de_pass_affiliate_link:
    {
      type: String
    },
    en_pass_affiliate_link:
    {
      type: String
    },
    Imagelink: {
      type: String,
      required: false,
    },

  },
);

const Attraction = mongoose.model(
  "Attraction",
  AttractionSchema
);

export default Attraction;
