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







import PassAttraction from '../models/pass.attaction.model.js';
import Pass from '../models/passes.model.js';
import Attraction from '../models/attraction.model.js';


export const getBestMatchingPasses = async (req, res) => {
  const { attractionIds } = req.body;
  const lang = req.query.lang?.toLowerCase() === 'de' ? 'de' : 'en';

  if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
    return res.status(400).json({
      error: lang === 'de'
        ? "Bitte geben Sie eine Liste von Attraktionen an."
        : "Please provide a non-empty array of attractionIds."
    });
  }

  try {
    const validAttractions = await Attraction.find({
      attractionId: { $in: attractionIds }
    });

    if (validAttractions.length === 0) {
      return res.status(404).json({
        error: lang === 'de'
          ? "Keine passenden Attraktionen gefunden."
          : "No attractions found for the provided IDs."
      });
    }

    const allPassLinks = await PassAttraction.find();
    const allPasses = await Pass.find();

    const attractionToPassesMap = {};
    for (const link of allPassLinks) {
      for (const attraction of link.attractions) {
        if (!attractionToPassesMap[attraction]) {
          attractionToPassesMap[attraction] = new Set();
        }
        attractionToPassesMap[attraction].add(link.passId);
      }
    }

    const passSupportCount = {};
    for (const id of attractionIds) {
      const supportedPasses = attractionToPassesMap[id];
      if (supportedPasses) {
        for (const pid of supportedPasses) {
          passSupportCount[pid] = (passSupportCount[pid] || 0) + 1;
        }
      }
    }

    const sortedPassTypes = Object.entries(passSupportCount).sort((a, b) => b[1] - a[1]);

    const evaluatePassVariant = async (pass, coveredAttractions) => {
      const quantityMatch = pass.passId.match(/--(\d+)$/);
      const limit = quantityMatch ? parseInt(quantityMatch[1], 10) : 0;

      const included = coveredAttractions.slice(0, limit);
      const extra = attractionIds.filter(id => !included.includes(id));

      const includedData = await Attraction.find({ attractionId: { $in: included } });
      const extraData = await Attraction.find({ attractionId: { $in: extra } });

      const extraCost = extraData.reduce((sum, a) => sum + (a.pass_price_adult || 0), 0);
      const totalWithExtras = (pass.priceAdult || 0) + extraCost;

      const allData = [...includedData, ...extraData];
      const totalFullPrice = allData.reduce((sum, a) => sum + (a.pass_price_adult || 0), 0);

      const percentageSaved = totalFullPrice > 0 ? Number(((totalFullPrice - totalWithExtras) / totalFullPrice * 100).toFixed(1)) : 0;
      const formattedSavings = lang === 'de'
        ? `Du sparst ${percentageSaved.toString().replace('.', ',')}%`
        : `You save ${percentageSaved.toFixed(1)}%`;

      return {
        type: 'pass',
        passId: pass.passId,
        passName: lang === 'de' ? pass.de_passName || pass.en_passName : pass.en_passName,
        affiliateLink: lang === 'de' ? pass.de_passaffilated_link || pass.en_passaffilated_link : pass.en_passaffilated_link,
        priceAdult: pass.priceAdult || 0,
        matchedCount: included.length,
        includedAttractions: includedData.map(attr => ({
          id: attr.attractionId,
          name: lang === 'de' ? attr.de_attraction_name : attr.en_attraction_name,
          price: attr.pass_price_adult
        })),
        missingAttractions: extraData.map(attr => ({
          id: attr.attractionId,
          name: lang === 'de' ? attr.de_attraction_name : attr.en_attraction_name,
          price: attr.pass_price_adult
        })),
        extraTicketPrice: extraCost,
        totalPrice: pass.priceAdult,
        totalPriceWithExtras: totalWithExtras,
        totalAttractionsPrice: totalFullPrice,
        percentageSaved,
        formattedSavings
      };
    };

    const getAllCombinations = (arr) => {
      const results = [];
      const generate = (prefix, rest) => {
        for (let i = 0; i < rest.length; i++) {
          const newCombo = [...prefix, rest[i]];
          results.push(newCombo);
          generate(newCombo, rest.slice(i + 1));
        }
      };
      generate([], arr);
      return results;
    };

    const allEvaluatedOptions = [];

    for (const [passTypeId] of sortedPassTypes) {
      const allPossible = attractionIds.filter(id => (attractionToPassesMap[id]?.has(passTypeId)));
      const passVariants = allPasses.filter(p => p.passId.startsWith(`${passTypeId}--`));

      const sortedVariants = passVariants.sort((a, b) => {
        const aNum = parseInt(a.passId.split('--')[1]);
        const bNum = parseInt(b.passId.split('--')[1]);
        return aNum - bNum;
      });

      const attractionCombos = getAllCombinations(allPossible);

      for (const subset of attractionCombos) {
        for (const pass of sortedVariants) {
          const quantityMatch = pass.passId.match(/--(\d+)$/);
          const limit = quantityMatch ? parseInt(quantityMatch[1], 10) : 0;
          if (limit >= subset.length) {
            const evaluated = await evaluatePassVariant(pass, subset);
            allEvaluatedOptions.push(evaluated);
          }
        }
      }
    }

    allEvaluatedOptions.sort((a, b) => a.totalPriceWithExtras - b.totalPriceWithExtras);
    const bestMatch = allEvaluatedOptions[0];

    const allRequestedAttractionData = await Attraction.find({ attractionId: { $in: attractionIds } });
    const fullPrice = allRequestedAttractionData.reduce((sum, attr) => sum + (attr.pass_price_adult || 0), 0);

    const allMatchingPassAttractions = await PassAttraction.find(
      {
        attractions: { $all: attractionIds },
        passId: { $regex: /day/, $options: 'i' }
      },
      { passId: 1, _id: 0 }, {
      passType: 'day' // ✅ Ensure only day-type passes are matched
    }
    );
    console.log(allMatchingPassAttractions, "Hello")
    // const dayPasses = await Pass.find({
    //   $or: allMatchingPassAttractions.map(p => ({
    //     passId: { $regex: `^${p.passId}--\\d+$`, $options: 'i' },

    //   }))
    // });
    const projection = {
      passId: 1,
      priceAdult: 1,
      [`${lang}_passName`]: 1,
      [`${lang}_passaffilated_link`]: 1,
      _id: 0
    };


    // const dayPasses = await Pass.find(
    //   {
    //     $and: [
    //       {
    //         $or: allMatchingPassAttractions.map(p => ({
    //           passId: { $regex: /^.*day.*--\d+$/i, $options: 'i' }
    //         }))
    //       },
    //       {
    //         priceAdult: { $lt: bestMatch.totalPrice }
    //       }
    //     ]
    //   },
    //   projection
    // );

    // ✅ Find the lowest-priced pass from those
    // const cheapestDayPass = dayPasses.reduce((min, pass) => {
    //   const days = parseInt(pass.passId.split('--')[1] || '0', 10);
    //   const minDays = min ? parseInt(min.passId.split('--')[1] || '0', 10) : 0;

    //   if (!min) return pass;

    //   // Prefer lower price
    //   if (pass.priceAdult < min.priceAdult) return pass;

    //   // If price is same, prefer more days
    //   if (pass.priceAdult === min.priceAdult && days > minDays) return pass;

    //   return min;
    // });

    const dayPasses = await Pass.find(
      {
        $and: [
          {
            $or: allMatchingPassAttractions.map(p => ({
              passId: { $regex: `^${p.passId}--\\d+$`, $options: 'i' }
            }))
          },
          {
            priceAdult: { $lt: bestMatch.totalPrice }
          },
          {
            passId: { $regex: /day/i }  // Ensures it's a "day" pass
          }
        ]
      },
      projection
    );

    console.log(dayPasses, "hello")

    const bestDayPass = dayPasses?.reduce((best, current) => {
      const currentDays = parseInt(current.passId.split('--')[1] || '0', 10);
      const bestDays = best ? parseInt(best.passId.split('--')[1] || '0', 10) : 0;

      if (!best) return current;

      // Prefer more days first
      if (currentDays > bestDays) return current;

      // If same number of days, pick cheaper one
      if (currentDays === bestDays && current.priceAdult < best.priceAdult) return current;

      return best;
    });



    const allDayPassesWithAllAttractions = bestDayPass;
    // console.log(allDayPassesWithAllAttractions, "Days all passes", bestDayPass)
    if (!bestMatch || fullPrice < bestMatch.totalPriceWithExtras) {
      return res.status(200).json({
        type: 'individual',
        message: lang === 'de' ? 'Einzeltickets sind günstiger.' : 'Buying attractions individually is cheaper.',
        ...(lang === 'de'
          ? { GesamtAttraktionenPreis: fullPrice }
          : { totalAttractionsPrice: fullPrice }),
        attractions: allRequestedAttractionData.map(attr => ({
          id: attr.attractionId,
          name: lang === 'de' ? attr.de_attraction_name : attr.en_attraction_name,
          price: attr.pass_price_adult
        })),
        dayPasses: allDayPassesWithAllAttractions
      });
    }

    return res.status(200).json({
      ...bestMatch,
      dayPasses: allDayPassesWithAllAttractions
    });

  } catch (error) {
    console.error("❌ Error in best pass matching:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};




