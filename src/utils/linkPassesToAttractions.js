// import Attraction from '../models/attraction.model.js';
// import Pass from '../models/passes.model.js';
// import PassAttraction from '../models/pass.attaction.model.js';

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


import Pass from '../models/passes.model.js';
import Attraction from '../models/pass.attaction.model.js';
import PassAttraction from '../models/pass.attaction.model.js';

// const flagToPassIdMap = {
//   gocity_day_pass: 'gocity-day-pass',
//   gocity_flex_pass: 'gocity-flex-pass',
//   sightseeing_day_pass: 'sightseeing-day-pass',
//   sightseeing_flex_pass: 'sightseeing-flex-pass',
//   sightseeing_economy_pay_day_pass: 'sightseeing-economy-pay-day-pass',
//   sightseeing_economy_pay_flex_pass: 'sightseeing-economy-pay-flex-pass',
// };

// export const linkPassesToAttractions = async () => {
//   try {
//     const attractions = await Attraction.find();
//     const passLinks = {}; // { passId: Set of attractionIds }

//     for (const attraction of attractions) {
//       for (const [flag, passId] of Object.entries(flagToPassIdMap)) {
//         if (attraction[flag] === true) {
//           if (!passLinks[passId]) {
//             passLinks[passId] = new Set();
//           }
//           passLinks[passId].add(attraction.attractionId); // use attractionId (string)
//         }
//       }
//     }

//     for (const [passId, attractionSet] of Object.entries(passLinks)) {
//       const attractionIds = Array.from(attractionSet);

//       await PassAttraction.updateOne(
//         { passId },
//         { $addToSet: { attractions: { $each: attractionIds } } },
//         { upsert: true }
//       );

//       console.log(`✅ Linked ${passId} → ${attractionIds.length} attractions`);
//     }

//     console.log("🎉 Pass-attraction linking complete!");
//   } catch (error) {
//     console.error("❌ Error generating links:", error);
//   }
// };



// export const linkPassesToAttractions = async () => {
//   try {
//     const passes = await Pass.find();
//     const attractions = await Attraction.find();

//     for (const pass of passes) {
//       const baseId = pass.passId.split('--')[0]; // e.g., sightseeing-pass-flex

//       const matchingFlag = baseIdToFlagMap[baseId];

//       if (!matchingFlag) {
//         console.warn(`⚠️ No matching flag for passId: ${pass.passId}`);
//         continue;
//       }

//       const matchingAttractions = attractions.filter(attr => attr[matchingFlag] === true);

//       const attractionIds = matchingAttractions.map(attr => attr.attractionId); // use attractionId (string)

//       await PassAttraction.updateOne(
//         { passId: baseId },
//         { $addToSet: { attractions: { $each: attractionIds } } },
//         { upsert: true }
//       );

//       console.log(`✅ Linked ${baseId} → ${attractionIds.length} attractions`);
//     }

//     console.log("🎉 PassAttraction linking completed!");
//   } catch (error) {
//     console.error("❌ Error during linking:", error);
//   }
// };




// const baseIdToFlagMap = {
//   'gocity-day': 'gocity_day_pass',
//   'gocity-flex': 'gocity_flex_pass',
//   'sightseeing-pass-day': 'sightseeing_day_pass',
//   'sightseeing-pass-flex': 'sightseeing_flex_pass',
//   'sightseeing-pass-day-economy': 'sightseeing_economy_pay_day_pass',
//   'sightseeing-pass-flex-economy': 'sightseeing_economy_pay_flex_pass',
// };

// export const linkPassesToAttractions = async () => {
try {
  const passes = await Pass.find();
  const attractions = await Attraction.find();

  // ✅ DEBUG CHECK: Is the sightseeing_day_pass flag working?
  const test = await Attraction.find({ sightseeing_day_pass: true });
  console.log("🔍 [DEBUG] Matched attractions for sightseeing_day_pass:", test.length);
  if (test.length > 0) console.log("🧪 Sample:", test[0].attractionId);



  for (const pass of passes) {
    const baseId = pass.passId.split('--')[0]; // e.g., sightseeing-pass-flex
    const matchingFlag = baseIdToFlagMap[baseId];

    console.log(`\n🔍 Checking Pass: ${pass.passId}`);
    console.log(`➡️ Base ID: ${baseId}`);
    console.log(`🧩 Matching Flag: ${matchingFlag}`);

    if (!matchingFlag) {
      console.warn(`⚠️ No matching flag found for passId: ${pass.passId}`);
      continue;
    }

    const matchingAttractions = attractions.filter(attr => attr[matchingFlag] === true);
    const attractionIds = matchingAttractions.map(attr => attr.attractionId);

    if (attractionIds.length === 0) {
      console.warn(`⚠️ No attractions matched for flag: ${matchingFlag}`);
    } else {
      console.log(`✅ ${attractionIds.length} attractions matched for ${pass.passId}`);
      console.log(`🔗 Sample attraction IDs:`, attractionIds.slice(0, 5)); // show first 5
    }

    await PassAttraction.updateOne(
      { passId: baseId },
      { $addToSet: { attractions: { $each: attractionIds } } },
      { upsert: true }
    );

    console.log(`📌 Saved ${attractionIds.length} linked attractions for "${baseId}"`);
  }

  console.log("\n🎉 PassAttraction linking completed!");
} catch (error) {
  console.error("❌ Error during linking:", error);
}
// };

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
    const passes = await Pass.find();
    const attractions = await Attraction.find();

    for (const pass of passes) {
      const baseId = pass.passId.split('--')[0];
      const matchingFlag = baseIdToFlagMap[baseId];

      console.log(`\n🔍 Checking Pass: ${pass.passId}`);
      console.log(`➡️ Base ID: ${baseId}`);
      console.log(`🧩 Matching Flag: ${matchingFlag}`);

      if (!matchingFlag) {
        console.warn(`⚠️ No matching flag for passId: ${pass.passId}`);
        continue;
      }

      // 🛠️ Debug flag types for all attractions
      for (const attr of attractions) {
        console.log(`🔎 Attraction: ${attr.attractionId} → ${matchingFlag}:`, attr[matchingFlag], '| Type:', typeof attr[matchingFlag]);
      }

      const matchingAttractions = attractions.filter(attr => attr[matchingFlag] === true);
      const attractionIds = matchingAttractions.map(attr => attr.attractionId);

      if (attractionIds.length === 0) {
        console.warn(`⚠️ No attractions matched for flag: ${matchingFlag}`);
      } else {
        console.log(`✅ ${attractionIds.length} attractions matched`);
        console.log(`🔗 Sample attraction IDs:`, attractionIds.slice(0, 5));
      }

      await PassAttraction.updateOne(
        { passId: baseId },
        { $addToSet: { attractions: { $each: attractionIds } } },
        { upsert: true }
      );

      console.log(`📌 Saved ${attractionIds.length} linked attractions for "${baseId}"`);
    }

    console.log("\n🎉 PassAttraction linking completed!");
  } catch (error) {
    console.error("❌ Error during linking:", error);
  }
};
