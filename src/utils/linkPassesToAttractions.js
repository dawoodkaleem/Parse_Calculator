
// export const linkPassesToAttractions = async () => {
//   const flagToPassPrefix = {
//     gocity_day_pass: 'gocity-day',
//     gocity_flex_pass: 'gocity-flex',
//     sightseeing_day_pass: 'sightseeing-pass-day',
//     sightseeing_flex_pass: 'sightseeing-pass-flex',
//     sightseeing_economy_pay_day_pass: 'sightseeing-pass-day-economy',
//     sightseeing_economy_pay_flex_pass: 'sightseeing-pass-flex-economy',
//   };

//   const attractions = await Attraction.find();
//   const passes = await Pass.find();

//   let linkCount = 0;

//   for (const attraction of attractions) {
//     // for (const [flagField, passPrefix] of Object.entries(flagToPassPrefix)) {
//     //   if (attraction[flagField] === true) {
//     //     const matchingPasses = passes.filter(pass => pass.passId.startsWith(passPrefix));

//     //     for (const pass of matchingPasses) {
//     //       const alreadyExists = await PassAttraction.findOne({
//     //         passId: pass.passId,
//     //         attractionId: attraction.attractionId,
//     //       });

//     //       if (!alreadyExists) {
//     //         await PassAttraction.create({
//     //           passId: pass.passId,
//     //           attractionId: attraction.attractionId,
//     //         });
//     //         console.log(`🔗 Linked ${pass.passId} → ${attraction.attractionId}`);
//     //         linkCount++;
//     //       }
//     //     }
//     //   }
//     // }
//     for (const [flagField, passPrefix] of Object.entries(flagToPassPrefix)) {
//       if (attraction[flagField] === true) {
//         const matchingPasses = passes.filter(pass => {
//           const basePassId = pass.passId.split('--')[0]; // Handle gocity-flex--2, --3, etc.
//           return basePassId === passPrefix;
//         });

//         for (const pass of matchingPasses) {
//           const alreadyExists = await PassAttraction.findOne({
//             passId: pass.passId,
//             attractionId: attraction.attractionId,
//           });

//           if (!alreadyExists) {
//             await PassAttraction.create({
//               passId: pass.passId,
//               attractionId: attraction.attractionId,
//             });
//             console.log(`🔗 Linked ${pass.passId} → ${attraction.attractionId}`);
//             linkCount++;
//           }
//         }
//       }
//     }

//   }

//   console.log(`✅ Linked ${linkCount} pass-attraction pairs`);
// };

// This One Work but it save all value like passes like --1,2,3,4,5,6

// import Pass from '../models/passes.model.js';
// import Attraction from '../models/attraction.model.js';
// import PassAttraction from '../models/pass.attaction.model.js';

// const baseIdToFlagMap = {
//   'gocity-day': 'gocity_day_pass',
//   'gocity-flex': 'gocity_flex_pass',
//   'sightseeing-pass-day': 'sightseeing_day_pass',
//   'sightseeing-pass-flex': 'sightseeing_flex_pass',
//   'sightseeing-pass-day-economy': 'sightseeing_economy_pay_day_pass',
//   'sightseeing-pass-flex-economy': 'sightseeing_economy_pay_flex_pass',
// };

// export const linkPassesToAttractions = async () => {
//   try {
//     const attractions = await Attraction.find();
//     const passes = await Pass.find();

//     for (const pass of passes) {
//       const fullPassId = pass.passId; // e.g., gocity-flex--2
//       const baseId = fullPassId.split('--')[0]; // e.g., gocity-flex
//       const flagField = baseIdToFlagMap[baseId]; // e.g., gocity_flex_pass

//       if (!flagField) {
//         console.warn(`⚠️ No matching flag for baseId: ${baseId}`);
//         continue;
//       }

//       // Find attractions where that flag is true
//       const matchedAttractions = attractions.filter(attr => attr[flagField] === true);
//       const attractionIds = matchedAttractions.map(attr => attr.attractionId);

//       if (attractionIds.length === 0) {
//         console.warn(`⚠️ No attractions matched for ${fullPassId}`);
//       } else {
//         console.log(`✅ Linked ${fullPassId} with ${attractionIds.length} attractions`);

//         await PassAttraction.updateOne(
//           { passId: fullPassId }, // ✅ save using full ID like gocity-flex--2
//           { $addToSet: { attractions: { $each: attractionIds } } },
//           { upsert: true }
//         );
//       }
//     }

//     console.log("\n🎉 All pass-attraction links created successfully!");
//   } catch (error) {
//     console.error("❌ Error in linking:", error);
//   }
// };


import Pass from '../models/passes.model.js';
import Attraction from '../models/attraction.model.js';
import PassAttraction from '../models/pass.attaction.model.js';

const baseIdToFlagMap = {
  'gocity-day': 'gocity_day_pass',
  'gocity-flex': 'gocity_flex_pass',
  'sightseeing-pass-day': 'sightseeing_day_pass',
  'sightseeing-pass-flex': 'sightseeing_flex_pass',
  'sightseeing-pass-day-economy': 'sightseeing_economy_pay_day_pass',
  'sightseeing-pass-flex-economy': 'sightseeing_economy_pay_flex_pass',
};

export const linkPassesToAttractions = async () => {
  try {
    const attractions = await Attraction.find();
    const passes = await Pass.find();

    for (const pass of passes) {
      const fullPassId = pass.passId; // e.g., sightseeing-pass-flex-economy--2
      const baseId = fullPassId.split('--')[0]; // e.g., sightseeing-pass-flex-economy
      const flagField = baseIdToFlagMap[baseId]; // e.g., sightseeing_economy_pay_flex_pass

      if (!flagField) {
        console.warn(`⚠️ No matching flag for baseId: ${baseId}`);
        continue;
      }

      const matchedAttractions = attractions.filter(attr => attr[flagField] === true);
      const attractionIds = matchedAttractions.map(attr => attr.attractionId);

      if (attractionIds.length === 0) {
        console.warn(`⚠️ No attractions matched for ${baseId}`);
      } else {
        console.log(`✅ Linking ${baseId} with ${attractionIds.length} attractions`);

        await PassAttraction.updateOne(
          { passId: baseId }, // 👈 Changed here!
          { $addToSet: { attractions: { $each: attractionIds } } },
          { upsert: true }
        );
      }
    }

    console.log("\n🎉 PassAttraction linking completed!");
  } catch (error) {
    console.error("❌ Error during linking:", error);
  }
};


