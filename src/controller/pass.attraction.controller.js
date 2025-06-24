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


// export const getBestMatchingPasses = async (req, res) => {
//   const { attractionIds } = req.body;

//   if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
//     return res.status(400).json({
//       error: "Please provide a non-empty array of attractionIds."
//     });
//   }

//   try {
//     // ✅ Check if any attraction actually exists
//     const validAttractions = await Attraction.find({
//       attractionId: { $in: attractionIds }
//     });

//     if (validAttractions.length === 0) {
//       return res.status(404).json({
//         error: "No attractions found for the provided IDs."
//       });
//     }

//     const allPassLinks = await PassAttraction.find();
//     const allPasses = await Pass.find();

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

//     return res.status(200).json({
//       type: 'pass',
//       ...bestMatch,
//       missingAttractions: missingAttractionsData.map(attr => ({
//         id: attr._id,
//         name: attr.en_attraction_name,
//         price: attr.pass_price_adult,
//       })),
//       extraTicketPrice,
//       totalPriceWithExtras: bestMatch.priceAdult + extraTicketPrice,
//       IncludedAttractions: attractionIds
//     });

//   } catch (error) {
//     console.error("❌ Error in best pass matching:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getBestMatchingPasses = async (req, res) => {
//   const { attractionIds } = req.body;

//   if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
//     return res.status(400).json({
//       error: "Please provide a non-empty array of attractionIds."
//     });
//   }

//   try {
//     // ✅ Check if any attraction actually exists
//     const validAttractions = await Attraction.find({
//       attractionId: { $in: attractionIds }
//     });

//     if (validAttractions.length === 0) {
//       return res.status(404).json({
//         error: "No attractions found for the provided IDs."
//       });
//     }

//     const allPassLinks = await PassAttraction.find();
//     const allPasses = await Pass.find();

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

//     const totalAttractionsPrice = totalIncludedPrice + extraTicketPrice;
//     const passPriceWithExtras = bestMatch.priceAdult + extraTicketPrice;

//     const percentageSaved = totalAttractionsPrice > 0
//       ? Number(((totalAttractionsPrice - passPriceWithExtras) / totalAttractionsPrice * 100).toFixed(1))
//       : 0;

//     // ✅ Return if individual is cheaper
//     if (totalAttractionsPrice < bestMatch.priceAdult) {
//       return res.status(200).json({
//         type: 'individual',
//         message: 'Buying attractions individually is cheaper.',
//         totalAttractionsPrice,
//         attractions: [...includedAttractionsData, ...missingAttractionsData].map(attr => ({
//           id: attr._id,
//           name: attr.en_attraction_name,
//           price: attr.pass_price_adult
//         }))
//       });
//     }

//     // ✅ Return best pass option
//     return res.status(200).json({
//       type: 'pass',
//       passId: bestMatch.passId,
//       passName: bestMatch.passName,
//       priceAdult: bestMatch.priceAdult,
//       matchedCount: bestMatch.matchedCount,
//       requestedAttractions: attractionIds,
//       includedAttractions: includedAttractionsData.map(attr => ({
//         id: attr._id,
//         name: attr.en_attraction_name,
//         price: attr.pass_price_adult
//       })),
//       missingAttractions: missingAttractionsData.map(attr => ({
//         id: attr._id,
//         name: attr.en_attraction_name,
//         price: attr.pass_price_adult
//       })),
//       extraTicketPrice,
//       totalAttractionsPrice,
//       totalPriceWithExtras: passPriceWithExtras,
//       percentageSaved
//     });

//   } catch (error) {
//     console.error("❌ Error in best pass matching:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// export const getBestMatchingPasses = async (req, res) => {
//   const { attractionIds } = req.body;
//   const lang = req.query.lang?.toLowerCase() === 'de' ? 'de' : 'en';

//   if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
//     return res.status(400).json({
//       error: lang === 'de'
//         ? "Bitte geben Sie eine Liste von Attraktionen an."
//         : "Please provide a non-empty array of attractionIds."
//     });
//   }

//   try {
//     const validAttractions = await Attraction.find({
//       attractionId: { $in: attractionIds }
//     });

//     if (validAttractions.length === 0) {
//       return res.status(404).json({
//         error: lang === 'de'
//           ? "Keine passenden Attraktionen gefunden."
//           : "No attractions found for the provided IDs."
//       });
//     }

//     const allPassLinks = await PassAttraction.find();
//     const allPasses = await Pass.find();

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

//       const bestForThisType = validPasses.reduce((min, curr) =>
//         (!min || curr.priceAdult < min.priceAdult) ? curr : min, null
//       );

//       const current = {
//         passId: bestForThisType.passId,
//         // passName: lang === 'de' ? bestForThisType.de_passName : bestForThisType.en_passName,
//         passName: lang === 'de'
//           ? bestForThisType.de_passName || bestForThisType.en_passName
//           : bestForThisType.en_passName,

//         affiliateLink: lang === 'de'
//           ? bestForThisType.de_passaffilated_link || bestForThisType.en_passaffilated_link
//           : bestForThisType.en_passaffilated_link,

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
//       return res.status(404).json({
//         message: lang === 'de'
//           ? "Kein passender Pass gefunden."
//           : "No matching pass found."
//       });
//     }

//     const missingAttractions = attractionIds.filter(id =>
//       !bestMatch.includedAttractions.includes(id)
//     );

//     const includedAttractionsData = await Attraction.find({
//       attractionId: { $in: bestMatch.includedAttractions }
//     });

//     const missingAttractionsData = await Attraction.find({
//       attractionId: { $in: missingAttractions }
//     });

//     const totalIncludedPrice = includedAttractionsData.reduce((sum, attr) =>
//       sum + (attr.pass_price_adult || 0), 0
//     );

//     const extraTicketPrice = missingAttractionsData.reduce((sum, attr) =>
//       sum + (attr.pass_price_adult || 0), 0
//     );

//     const totalAttractionsPrice = totalIncludedPrice + extraTicketPrice;
//     const totalPriceWithExtras = bestMatch.priceAdult + extraTicketPrice;

//     const percentageSaved = totalAttractionsPrice > 0
//       ? Number(((totalAttractionsPrice - totalPriceWithExtras) / totalAttractionsPrice * 100).toFixed(1))
//       : 0;

//     const formattedPercentage = lang === 'de'
//       ? percentageSaved.toString().replace('.', ',')
//       : percentageSaved.toFixed(1);

//     const formattedSavings = lang === 'de'
//       ? `Du sparst ${formattedPercentage}%`
//       : `You save ${formattedPercentage}%`;

//     // ✅ If individual tickets are cheaper
//     if (totalAttractionsPrice < bestMatch.priceAdult) {
//       return res.status(200).json({
//         type: 'individual',
//         message: lang === 'de'
//           ? 'Einzeltickets sind günstiger.'
//           : 'Buying attractions individually is cheaper.',
//         ...(lang === 'de'
//           ? { GesamtAttraktionenPreis: totalAttractionsPrice }
//           : { totalAttractionsPrice }),
//         attractions: [...includedAttractionsData, ...missingAttractionsData].map(attr => ({
//           id: attr._id,
//           name: lang === 'de' ? attr.de_attraction_name : attr.en_attraction_name,
//           price: attr.pass_price_adult
//         }))
//       });
//     }

//     // ✅ If pass is better
//     return res.status(200).json({
//       type: 'pass',
//       passId: bestMatch.passId,
//       passName: bestMatch.passName,
//       affiliateLink: bestMatch.affiliateLink,
//       priceAdult: bestMatch.priceAdult,
//       matchedCount: bestMatch.matchedCount,
//       requestedAttractions: attractionIds,
//       includedAttractions: includedAttractionsData.map(attr => ({
//         id: attr._id,
//         name: lang === 'de' ? attr.de_attraction_name : attr.en_attraction_name,
//         price: attr.pass_price_adult
//       })),
//       missingAttractions: missingAttractionsData.map(attr => ({
//         id: attr._id,
//         name: lang === 'de' ? attr.de_attraction_name : attr.en_attraction_name,
//         price: attr.pass_price_adult
//       })),
//       extraTicketPrice,
//       ...(lang === 'de'
//         ? {
//           GesamtAttraktionenPreis: totalAttractionsPrice,
//           GesamtpreisMitExtras: totalPriceWithExtras,
//           formattedSavings,
//           percentageSaved
//         }
//         : {
//           totalAttractionsPrice,
//           totalPriceWithExtras,
//           formattedSavings,
//           percentageSaved
//         })
//     });

//   } catch (error) {
//     console.error("❌ Error in best pass matching:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// export const getBestMatchingPasses = async (req, res) => {
//   const { attractionIds } = req.body;
//   const lang = req.query.lang?.toLowerCase() === 'de' ? 'de' : 'en';

//   if (!Array.isArray(attractionIds) || attractionIds.length === 0) {
//     return res.status(400).json({
//       error: lang === 'de'
//         ? "Bitte geben Sie eine Liste von Attraktionen an."
//         : "Please provide a non-empty array of attractionIds."
//     });
//   }

//   try {
//     const validAttractions = await Attraction.find({
//       attractionId: { $in: attractionIds }
//     });

//     if (validAttractions.length === 0) {
//       return res.status(404).json({
//         error: lang === 'de'
//           ? "Keine passenden Attraktionen gefunden."
//           : "No attractions found for the provided IDs."
//       });
//     }

//     const allPassLinks = await PassAttraction.find();
//     const allPasses = await Pass.find();

//     const attractionToPassesMap = {};
//     for (const link of allPassLinks) {
//       for (const attraction of link.attractions) {
//         if (!attractionToPassesMap[attraction]) {
//           attractionToPassesMap[attraction] = new Set();
//         }
//         attractionToPassesMap[attraction].add(link.passId);
//       }
//     }

//     const passSupportCount = {};
//     for (const id of attractionIds) {
//       const supportedPasses = attractionToPassesMap[id];
//       if (supportedPasses) {
//         for (const pid of supportedPasses) {
//           passSupportCount[pid] = (passSupportCount[pid] || 0) + 1;
//         }
//       }
//     }

//     const sortedPassTypes = Object.entries(passSupportCount).sort((a, b) => b[1] - a[1]);

//     const evaluatePassVariant = async (pass, coveredAttractions) => {
//       const quantityMatch = pass.passId.match(/--(\d+)$/);
//       const limit = quantityMatch ? parseInt(quantityMatch[1], 10) : 0;

//       const included = coveredAttractions.slice(0, limit);
//       const extra = attractionIds.filter(id => !included.includes(id));

//       const includedData = await Attraction.find({ attractionId: { $in: included } });
//       const extraData = await Attraction.find({ attractionId: { $in: extra } });

//       const extraCost = extraData.reduce((sum, a) => sum + (a.pass_price_adult || 0), 0);
//       const totalWithExtras = (pass.priceAdult || 0) + extraCost;

//       const allData = [...includedData, ...extraData];
//       const totalFullPrice = allData.reduce((sum, a) => sum + (a.pass_price_adult || 0), 0);

//       const percentageSaved = totalFullPrice > 0 ? Number(((totalFullPrice - totalWithExtras) / totalFullPrice * 100).toFixed(1)) : 0;
//       const formattedSavings = lang === 'de'
//         ? `Du sparst ${percentageSaved.toString().replace('.', ',')}%`
//         : `You save ${percentageSaved.toFixed(1)}%`;

//       return {
//         type: 'pass',
//         passId: pass.passId,
//         passName: lang === 'de' ? pass.de_passName || pass.en_passName : pass.en_passName,
//         affiliateLink: lang === 'de' ? pass.de_passaffilated_link || pass.en_passaffilated_link : pass.en_passaffilated_link,
//         priceAdult: pass.priceAdult || 0,
//         matchedCount: included.length,
//         includedAttractions: includedData.map(attr => ({
//           id: attr._id,
//           name: lang === 'de' ? attr.de_attraction_name : attr.en_attraction_name,
//           price: attr.pass_price_adult
//         })),
//         missingAttractions: extraData.map(attr => ({
//           id: attr._id,
//           name: lang === 'de' ? attr.de_attraction_name : attr.en_attraction_name,
//           price: attr.pass_price_adult
//         })),
//         extraTicketPrice: extraCost,
//         totalPrice: pass.priceAdult,
//         totalPriceWithExtras: totalWithExtras,
//         totalAttractionsPrice: totalFullPrice,
//         percentageSaved,
//         formattedSavings
//       };
//     };

//     const allEvaluatedOptions = [];

//     for (const [passTypeId] of sortedPassTypes) {
//       const allPossible = attractionIds.filter(id => (attractionToPassesMap[id]?.has(passTypeId)));
//       const passVariants = allPasses.filter(p => p.passId.startsWith(`${passTypeId}--`));

//       for (let i = allPossible.length; i > 0; i--) {
//         const partialIncluded = allPossible.slice(0, i);

//         for (const pass of passVariants) {
//           const evaluated = await evaluatePassVariant(pass, partialIncluded);
//           allEvaluatedOptions.push(evaluated);
//         }
//       }
//     }

//     // sort all evaluated options by total cost (pass + extras)
//     allEvaluatedOptions.sort((a, b) => a.totalPriceWithExtras - b.totalPriceWithExtras);

//     const bestMatch = allEvaluatedOptions[0];

//     const allRequestedAttractionData = await Attraction.find({ attractionId: { $in: attractionIds } });
//     const fullPrice = allRequestedAttractionData.reduce((sum, attr) => sum + (attr.pass_price_adult || 0), 0);

//     if (!bestMatch || fullPrice < bestMatch.totalPriceWithExtras) {
//       return res.status(200).json({
//         type: 'individual',
//         message: lang === 'de' ? 'Einzeltickets sind günstiger.' : 'Buying attractions individually is cheaper.',
//         ...(lang === 'de'
//           ? { GesamtAttraktionenPreis: fullPrice }
//           : { totalAttractionsPrice: fullPrice }),
//         attractions: allRequestedAttractionData.map(attr => ({
//           id: attr._id,
//           name: lang === 'de' ? attr.de_attraction_name : attr.en_attraction_name,
//           price: attr.pass_price_adult
//         }))
//       });
//     }

//     return res.status(200).json(bestMatch);

//   } catch (error) {
//     console.error("❌ Error in best pass matching:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };



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
        }))
      });
    }

    return res.status(200).json(bestMatch);

  } catch (error) {
    console.error("❌ Error in best pass matching:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};






