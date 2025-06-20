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
import PassAttraction from '../models/pass.attaction.model.js';

export const getBestMatchingPasses = async (req, res) => {
  const { attractionIds } = req.body;

  if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
    return res.status(400).json({
      error: "Please provide a non-empty array of attractionIds."
    });
  }

  try {
    const allPasses = await PassAttraction.find();

    const passMatches = allPasses.map(pass => {
      const includedAttractions = attractionIds.filter(id =>
        pass.attractions.includes(id)
      );

      const missingAttractions = attractionIds.filter(id =>
        !pass.attractions.includes(id)
      );

      return {
        passId: pass.passId,
        matchedCount: includedAttractions.length,
        totalAvailable: pass.attractions.length,
        includedAttractions,
        missingAttractions
      };
    });

    const matchedPasses = passMatches.filter(p => p.matchedCount > 0);

    if (matchedPasses.length === 0) {
      return res.status(404).json({ message: "No matching passes found." });
    }

    const highestMatchCount = Math.max(...matchedPasses.map(p => p.matchedCount));

    // ✅ Top 2–3 passes with same max count
    const topMatchingPasses = matchedPasses
      .filter(p => p.matchedCount === highestMatchCount)
      .slice(0, 3); // limit to 3 if more than that

    return res.status(200).json({
      highestMatchCount,
      topMatches: topMatchingPasses,
      bestMatch: topMatchingPasses[0] // just the first one (most relevant)
    });

  } catch (error) {
    console.error("❌ Matching error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
