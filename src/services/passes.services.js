// services/pass.service.js
import Pass from '../models/passes.model.js';

export const getAllPassesService = async () => {
  const passes = await Pass.find().sort(); // optional sort
  return passes;
};