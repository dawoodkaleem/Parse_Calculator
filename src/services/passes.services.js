// services/pass.service.js
import Pass from '../models/passes.model.js';
import Attraction from '../models/attraction.model.js';
export const getAllPassesService = async () => {
  const passes = await Pass.find().sort(); // optional sort
  return passes;
};




export const sumPassPriceAdult = async (attractionIds) => {
  if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
    throw new Error("Attraction IDs must be a non-empty array.");
  }

  const attractions = await Attraction.find({ _id: { $in: attractionIds } });

  const total = attractions.reduce((sum, attraction) => {
    return sum + (attraction.pass_price_adult || 0);
  }, 0);

  return parseFloat(total.toFixed(2));
};