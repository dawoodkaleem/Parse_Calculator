// import PassAttraction from '../models/pass.attaction.model.js';

// export const getBestMatchingPasses = async (req, res) => {
//   const { attractionIds } = req.body;

//   // ⚠️ Validate input
//   if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
//     return res.status(400).json({
//       error: "Please provide a non-empty array of attractionIds."
//     });
//   }

//   try {
//     // 1. Get all passes with linked attractions
//     const allPasses = await PassAttraction.find();

//     // 2. Match count logic
//     const passMatches = allPasses.map(pass => {
//       const matchedCount = attractionIds.filter(id =>
//         pass.attractions.includes(id)
//       ).length;

//       return {
//         passId: pass.passId,
//         matchedCount,
//         totalAvailable: pass.attractions.length
//       };
//     });

//     // 3. Sort by most matched
//     const sortedPasses = passMatches
//       .filter(p => p.matchedCount > 0)
//       .sort((a, b) => b.matchedCount - a.matchedCount);

//     return res.status(200).json({
//       totalMatches: sortedPasses.length,
//       results: sortedPasses
//     });

//   } catch (error) {
//     console.error("❌ Matching error:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// import PassAttraction from '../models/pass.attaction.model.js';

// export const getBestMatchingPasses = async (req, res) => {
//   const { attractionIds } = req.body;

//   // ⚠️ Validate input
//   if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
//     return res.status(400).json({
//       error: "Please provide a non-empty array of attractionIds."
//     });
//   }

//   try {
//     // 1. Get all passes with linked attractions
//     const allPasses = await PassAttraction.find();

//     // 2. Match + breakdown logic
//     const passMatches = allPasses.map(pass => {
//       const includedAttractions = attractionIds.filter(id =>
//         pass.attractions.includes(id)
//       );

//       const missingAttractions = attractionIds.filter(id =>
//         !pass.attractions.includes(id)
//       );

//       return {
//         passId: pass.passId,
//         matchedCount: includedAttractions.length,
//         totalAvailable: pass.attractions.length,
//         includedAttractions,
//         missingAttractions
//       };
//     });

//     // 3. Sort by most matches
//     const sortedPasses = passMatches
//       .filter(p => p.matchedCount > 0)
//       .sort((a, b) => b.matchedCount - a.matchedCount);

//     // 4. Send response
//     return res.status(200).json({
//       totalMatches: sortedPasses.length,
//       results: sortedPasses
//     });

//   } catch (error) {
//     console.error("❌ Matching error:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };



// import PassAttraction from '../models/pass.attaction.model.js';

// export const getBestMatchingPasses = async (req, res) => {
//   const { attractionIds } = req.body;

//   if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
//     return res.status(400).json({
//       error: "Please provide a non-empty array of attractionIds."
//     });
//   }

//   try {
//     const allPasses = await PassAttraction.find();

//     const passMatches = allPasses.map(pass => {
//       const includedAttractions = attractionIds.filter(id =>
//         pass.attractions.includes(id)
//       );

//       const missingAttractions = attractionIds.filter(id =>
//         !pass.attractions.includes(id)
//       );

//       return {
//         passId: pass.passId,
//         matchedCount: includedAttractions.length,
//         totalAvailable: pass.attractions.length,
//         includedAttractions,
//         missingAttractions
//       };
//     });

//     const matchedPasses = passMatches.filter(p => p.matchedCount > 0);

//     if (matchedPasses.length === 0) {
//       return res.status(404).json({ message: "No matching passes found." });
//     }

//     const highestMatchCount = Math.max(...matchedPasses.map(p => p.matchedCount));

//     // ✅ Top 2–3 passes with same max count
//     const topMatchingPasses = matchedPasses
//       .filter(p => p.matchedCount === highestMatchCount)
//       .slice(0, 3); // limit to 3 if more than that

//     return res.status(200).json({
//       highestMatchCount,
//       topMatches: topMatchingPasses,
//       bestMatch: topMatchingPasses[0] // just the first one (most relevant)
//     });

//   } catch (error) {
//     console.error("❌ Matching error:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };




import PassAttraction from '../models/pass.attaction.model.js';
import Pass from '../models/passes.model.js';
import Attraction from '../models/attraction.model.js';



// export const getBestMatchingPasses = async (req, res) => {
//   const { attractionIds } = req.body;

//   if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
//     return res.status(400).json({
//       error: "Please provide a non-empty array of attractionIds."
//     });
//   }

//   try {
//     const allPassLinks = await PassAttraction.find(); // Base passId → attractionIds
//     const allPasses = await Pass.find(); // All actual passes with --3, --5, etc.

//     let bestMatch = null;

//     for (const link of allPassLinks) {
//       const includedAttractions = attractionIds.filter(id =>
//         link.attractions.includes(id)
//       );
//       const matchedCount = includedAttractions.length;

//       if (matchedCount === 0) continue;

//       const matchingPassInstances = allPasses.filter(p =>
//         p.passId.startsWith(`${link.passId}--`)
//       );

//       const validPasses = matchingPassInstances.filter(p => {
//         const quantityMatch = p.passId.match(/--(\d+)$/);
//         const attractionLimit = quantityMatch ? parseInt(quantityMatch[1], 10) : 0;
//         return attractionLimit >= matchedCount;
//       });

//       if (validPasses.length === 0) continue;

//       const bestForThisType = validPasses.reduce((min, curr) => {
//         return (!min || (curr.priceAdult < min.priceAdult)) ? curr : min;
//       }, null);

//       const current = {
//         passId: bestForThisType.passId,
//         passName: bestForThisType.en_passName,
//         priceAdult: bestForThisType.priceAdult || 0,
//         matchedCount,
//         includedAttractions
//       };

//       if (
//         !bestMatch ||
//         current.matchedCount > bestMatch.matchedCount ||
//         (
//           current.matchedCount === bestMatch.matchedCount &&
//           current.priceAdult < bestMatch.priceAdult
//         )
//       ) {
//         bestMatch = current;
//       }
//     }

//     if (!bestMatch) {
//       return res.status(404).json({ message: "No matching pass found." });
//     }

//     // ✅ Get missing attractions
//     const missingAttractions = attractionIds.filter(id =>
//       !bestMatch.includedAttractions.includes(id)
//     );

//     const includedAttractionsData = await Attraction.find({
//       attractionId: { $in: bestMatch.includedAttractions }
//     });

//     const missingAttractionsData = await Attraction.find({
//       attractionId: { $in: missingAttractions }
//     });

//     const totalIncludedPrice = includedAttractionsData.reduce((sum, attr) => {
//       return sum + (attr.pass_price_adult || 0);
//     }, 0);

//     const extraTicketPrice = missingAttractionsData.reduce((sum, attr) => {
//       return sum + (attr.pass_price_adult || 0);
//     }, 0);

//     // ✅ Compare prices
//     if (totalIncludedPrice + extraTicketPrice < bestMatch.priceAdult) {
//       return res.status(200).json({
//         type: 'individual',
//         message: 'Buying attractions individually is cheaper.',
//         totalAttractionsPrice: totalIncludedPrice + extraTicketPrice,
//         attractions: [...includedAttractionsData, ...missingAttractionsData].map(attr => ({
//           id: attr._id,
//           name: attr.en_attraction_name,
//           price: attr.pass_price_adult
//         }))
//       });
//     }

//     // ✅ Return best pass with extras
//     return res.status(200).json({
//       type: 'pass',
//       ...bestMatch,
//       missingAttractions: missingAttractionsData.map(attr => ({
//         id: attr._id,
//         name: attr.en_attraction_name,
//         price: attr.pass_price_adult,

//       })),
//       extraTicketPrice,
//       IncludedAttractions: attractionIds
//     });

//   } catch (error) {
//     console.error("❌ Error in best pass matching:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };


export const getBestMatchingPasses = async (req, res) => {
  const { attractionIds } = req.body;

  if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
    return res.status(400).json({
      error: "Please provide a non-empty array of attractionIds."
    });
  }

  try {
    // ✅ Check if any attraction actually exists
    const validAttractions = await Attraction.find({
      attractionId: { $in: attractionIds }
    });

    if (validAttractions.length === 0) {
      return res.status(404).json({
        error: "No attractions found for the provided IDs."
      });
    }

    const allPassLinks = await PassAttraction.find();
    const allPasses = await Pass.find();

    let bestMatch = null;

    for (const link of allPassLinks) {
      const includedAttractions = attractionIds.filter(id =>
        link.attractions.includes(id)
      );
      const matchedCount = includedAttractions.length;

      if (matchedCount === 0) continue;

      const matchingPassInstances = allPasses.filter(p =>
        p.passId.startsWith(`${link.passId}--`)
      );

      const validPasses = matchingPassInstances.filter(p => {
        const quantityMatch = p.passId.match(/--(\d+)$/);
        const attractionLimit = quantityMatch ? parseInt(quantityMatch[1], 10) : 0;
        return attractionLimit >= matchedCount;
      });

      if (validPasses.length === 0) continue;

      const bestForThisType = validPasses.reduce((min, curr) => {
        return (!min || (curr.priceAdult < min.priceAdult)) ? curr : min;
      }, null);

      const current = {
        passId: bestForThisType.passId,
        passName: bestForThisType.en_passName,
        priceAdult: bestForThisType.priceAdult || 0,
        matchedCount,
        includedAttractions
      };

      if (
        !bestMatch ||
        current.matchedCount > bestMatch.matchedCount ||
        (
          current.matchedCount === bestMatch.matchedCount &&
          current.priceAdult < bestMatch.priceAdult
        )
      ) {
        bestMatch = current;
      }
    }

    if (!bestMatch) {
      return res.status(404).json({ message: "No matching pass found." });
    }

    const missingAttractions = attractionIds.filter(id =>
      !bestMatch.includedAttractions.includes(id)
    );

    const includedAttractionsData = await Attraction.find({
      attractionId: { $in: bestMatch.includedAttractions }
    });

    const missingAttractionsData = await Attraction.find({
      attractionId: { $in: missingAttractions }
    });

    const totalIncludedPrice = includedAttractionsData.reduce((sum, attr) => {
      return sum + (attr.pass_price_adult || 0);
    }, 0);

    const extraTicketPrice = missingAttractionsData.reduce((sum, attr) => {
      return sum + (attr.pass_price_adult || 0);
    }, 0);

    if (totalIncludedPrice + extraTicketPrice < bestMatch.priceAdult) {
      return res.status(200).json({
        type: 'individual',
        message: 'Buying attractions individually is cheaper.',
        totalAttractionsPrice: totalIncludedPrice + extraTicketPrice,
        attractions: [...includedAttractionsData, ...missingAttractionsData].map(attr => ({
          id: attr._id,
          name: attr.en_attraction_name,
          price: attr.pass_price_adult
        }))
      });
    }

    return res.status(200).json({
      type: 'pass',
      ...bestMatch,
      missingAttractions: missingAttractionsData.map(attr => ({
        id: attr._id,
        name: attr.en_attraction_name,
        price: attr.pass_price_adult,
      })),
      extraTicketPrice,
      totalPriceWithExtras: bestMatch.priceAdult + extraTicketPrice,
      IncludedAttractions: attractionIds
    });

  } catch (error) {
    console.error("❌ Error in best pass matching:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
