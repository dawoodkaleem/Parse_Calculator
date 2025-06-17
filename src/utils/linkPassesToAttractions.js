import Attraction from '../models/attraction.model.js';
import Pass from '../models/passes.model.js';
import PassAttraction from '../models/pass.attaction.model.js';

export const linkPassesToAttractions = async () => {
  const flagToPassPrefix = {
    gocity_day_pass: 'gocity-day',
    gocity_flex_pass: 'gocity-flex',
    sightseeing_day_pass: 'sightseeing-pass-day',
    sightseeing_flex_pass: 'sightseeing-pass-flex',
    sightseeing_economy_pay_day_pass: 'sightseeing-pass-day-economy',
    sightseeing_economy_pay_flex_pass: 'sightseeing-pass-flex-economy',
  };

  const attractions = await Attraction.find();
  const passes = await Pass.find();

  let linkCount = 0;

  for (const attraction of attractions) {
    for (const [flagField, passPrefix] of Object.entries(flagToPassPrefix)) {
      if (attraction[flagField] === true) {
        const matchingPasses = passes.filter(pass => pass.passId.startsWith(passPrefix));

        for (const pass of matchingPasses) {
          const alreadyExists = await PassAttraction.findOne({
            passId: pass.passId,
            attractionId: attraction.attractionId,
          });

          if (!alreadyExists) {
            await PassAttraction.create({
              passId: pass.passId,
              attractionId: attraction.attractionId,
            });
            console.log(`🔗 Linked ${pass.passId} → ${attraction.attractionId}`);
            linkCount++;
          }
        }
      }
    }
  }

  console.log(`✅ Linked ${linkCount} pass-attraction pairs`);
};
