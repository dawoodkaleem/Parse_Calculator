// import fs from 'fs';
// import csv from 'csv-parser';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import ParsePasses from '../models/parse.passes.model.js';

// export const importPasses = async (req, res) => {
//   const results = [];

//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   const filePath = path.join(__dirname, '..', 'assets', 'Pass_Calc_PASSES.csv');

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       if (results.length === 0) {
//         console.log('📋 CSV Headers:', Object.keys(row));
//       }
//       results.push(row);
//     })
//     .on('end', async () => {
//       console.log(`✅ CSV loaded. Total rows: ${results.length}`);
//       try {
//         for (const row of results) {
//           try {
//             const parseId = row.passID?.trim();
//             const passName = row.passName?.trim() || '';
//             const rawPrice = row.passPriceAdult || '';
//             const parsePriceAdult = rawPrice ? parseFloat(rawPrice.replace('$', '').trim()) : 0;
//             const dePassLink = row.passAffiliateLink?.trim() || '';
//             const passImage = row.passImageLink?.trim() || '';

//             if (!parseId) {
//               console.warn('⛔ Skipping row: Missing passID', row);
//               continue;
//             }

//             const existing = await ParsePasses.findOne({ parseId });

//             if (!existing) {
//               const pass = new ParsePasses({
//                 parseId,
//                 passName,
//                 parsePriceAdult,
//                 de_passaffilated_link: dePassLink,  // match your schema
//                 parseImagelink: passImage
//               });

//               await pass.save();
//               console.log(`✅ Inserted pass: ${parseId}`);
//             } else {
//               console.log(`⚠️ Pass already exists: ${parseId}`);
//             }
//           } catch (rowError) {
//             console.error('❌ Error processing row:', row, '\nError:', rowError.message);
//           }
//         }

//         res.status(200).send('✅ Passes imported successfully');
//       } catch (err) {
//         console.error('❌ Error during import loop:', err.message);
//         res.status(500).json({ error: 'Failed to import passes' });
//       }
//     });
// };


// import fs from 'fs';
// import csv from 'csv-parser';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import ParsePasses from '../models/passes.model.js';
// import ParseAttraction from '../models/attraction.model.js';


// const passMap = {
//   gocity_day_pass: "Go City Day Pass",
//   gocity_flex_pass: "Go City Flex Pass",
//   sightseeing_day_pass: "Sightseeing Day Pass",
//   sightseeing_flex_pass: "Sightseeing Flex Pass",
//   sightseeing_economy_pay_day_pass: "Sightseeing Economy Day Pass",
//   sightseeing_economy_pay_flex_pass: "Sightseeing Economy Flex Pass"
// };


// export const importPasses = async (req, res) => {
//   const results = [];

//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   const filePath = path.join(__dirname, '..', 'assets', 'Pass_Calc_PASSES.csv');

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       if (results.length === 0) {
//         console.log(' CSV Headers:', Object.keys(row));
//       }
//       results.push(row);
//     })
//     .on('end', async () => {
//       console.log(` CSV loaded. Total rows: ${results.length}`);
//       try {
//         for (const row of results) {
//           try {
//             const parseId = row.passID?.trim();
//             const enPassName = row.en_passName?.trim() || '';
//             const dePassName = row.de_passName?.trim() || '';
//             const rawPrice = row.passPriceAdult;
//             const parsePriceAdult = rawPrice ? parseFloat(rawPrice.replace('$', '').trim()) : 0;
//             const enPassLink = row.en_passAffiliateLink?.trim() || '';
//             const dePassLink = row.de_passAffiliateLink?.trim() || '';
//             const passImage = row.passImageLink?.trim() || '';

//             if (!parseId) {
//               console.warn(' Skipping row: Missing passID', row);
//               continue;
//             }

//             const existing = await ParsePasses.findOne({ parseId });

//             if (!existing) {
//               const pass = new ParsePasses({
//                 parseId,
//                 en_passName: enPassName,
//                 de_passName: dePassName,
//                 parsePriceAdult,
//                 en_passaffilated_link: enPassLink,
//                 de_passaffilated_link: dePassLink,
//                 parseImagelink: passImage
//               });

//               await pass.save();
//               console.log(`✅ Inserted pass: ${parseId}`);
//             } else {
//               console.log(`⚠️ Pass already exists: ${parseId}`);
//             }
//           } catch (rowError) {
//             console.error('❌ Error processing row:', row, '\nError:', rowError.message);
//           }
//         }

//         res.status(200).send('✅ Passes imported successfully');
//       } catch (err) {
//         console.error('❌ Error during import loop:', err.message);
//         res.status(500).json({ error: 'Failed to import passes' });
//       }
//     });
// };


// export const getCheapestPass = async (req, res) => {

//   const { attractionNames } = req.body;

//   if (!Array.isArray(attractionNames) || attractionNames.length === 0) {
//     return res.status(400).json({ error: "Invalid or empty 'attractionNames' array." });
//   }

//   try {
//     const attractions = await ParseAttraction.find({
//       en_attraction_name: { $in: attractionNames }
//     });

//     if (!attractions.length) {
//       return res.status(404).json({ error: 'No attractions found' });
//     }

//     const passTotals = {};
//     for (const flag in passMap) {
//       passTotals[flag] = 0;
//     }

//     for (const attraction of attractions) {
//       for (const flag in passMap) {
//         if (attraction[flag]) {
//           const passDoc = await ParsePasses.findOne({
//             passName: { $regex: passMap[flag], $options: 'i' }
//           });

//           if (passDoc && passDoc.parsePriceAdult) {
//             passTotals[flag] += passDoc.parsePriceAdult;
//           }
//         }
//       }
//     }

//     let cheapest = null;
//     for (const [flag, total] of Object.entries(passTotals)) {
//       if (cheapest === null || total < cheapest.total) {
//         cheapest = {
//           flag,
//           name: passMap[flag],
//           total
//         };
//       }
//     }

//     return res.json({
//       cheapestPass: cheapest.name,
//       totalCost: cheapest.total
//     });

//   } catch (err) {
//     console.error("Error in getCheapestPass:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// export const getCheapestPass = async (req, res) => {
//   const lang = req.query.lang?.toLowerCase()  // 'en' or 'de'
//   const { attractionNames } = req.body;

//   if (!Array.isArray(attractionNames) || attractionNames.length === 0) {
//     return res.status(400).json({ error: "Invalid or empty 'attractionNames' array." });
//   }

//   // Choose field based on selected language
//   const nameField = lang === 'de' ? 'de_attraction_name' : 'en_attraction_name';

//   try {
//     // Find all attractions matching the user's selected names
//     const attractions = await ParseAttraction.find({
//       [nameField]: { $in: attractionNames }
//     });

//     if (attractions.length === 0) {
//       return res.status(404).json({ error: 'No attractions found' });
//     }

//     const passTotals = {};

//     // Initialize each pass total
//     for (const flag in passMap) {
//       passTotals[flag] = 0;
//     }

//     // Loop over attractions to calculate total cost for each pass
//     for (const attraction of attractions) {
//       for (const flag in passMap) {
//         if (attraction[flag]) {
//           // Find the pass document matching the readable name
//           const passDoc = await ParsePasses.findOne({
//             passName: { $regex: passMap[flag], $options: 'i' }
//           });

//           if (passDoc?.parsePriceAdult) {
//             passTotals[flag] += passDoc.parsePriceAdult;
//           }
//         }
//       }
//     }

//     // Determine the cheapest total among the passes
//     let cheapest = null;

//     for (const [flag, total] of Object.entries(passTotals)) {
//       if (cheapest === null || total < cheapest.total) {
//         cheapest = {
//           flag,
//           name: passMap[flag],
//           total
//         };
//       }
//     }

//     return res.json({
//       cheapestPass: cheapest.name,
//       totalCost: cheapest.total
//     });

//   } catch (err) {
//     console.error("❌ Error in getCheapestPass:", err.message);
//     res.status(500).json({ error: "Server error" });
//   }
// };

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';

import Pass from '../models/passes.model.js';
import { linkPassesToAttractions } from '../utils/linkPassesToAttractions.js';
import { getAllPassesService } from '../services/passes.services.js';


export const getCheapestPass = async (req, res) => {
  const lang = req.query.lang?.toLowerCase(); // 'en' or 'de'
  const { attractionNames } = req.body;

  if (!Array.isArray(attractionNames) || attractionNames.length === 0) {
    return res.status(400).json({ error: "Invalid or empty 'attractionNames' array." });
  }

  const nameField = lang === 'de' ? 'de_attraction_name' : 'en_attraction_name';

  try {
    const attractions = await ParseAttraction.find({
      [nameField]: { $in: attractionNames }
    });

    if (!attractions.length) {
      return res.status(404).json({ error: 'No attractions found' });
    }

    // Fetch all passes once
    const passes = await ParsePasses.find({});
    const passPrices = {};
    passes.forEach(pass => {
      // Build lookup by en_passName and de_passName (in case needed later)
      const name = pass.en_passName || pass.de_passName;
      if (name) {
        passPrices[name.toLowerCase()] = pass.parsePriceAdult || 0;
      }
    });

    const passTotals = {};
    for (const flag in passMap) {
      passTotals[flag] = 0;
    }

    for (const attraction of attractions) {
      for (const flag in passMap) {
        if (attraction[flag]) {
          const passName = passMap[flag].toLowerCase();
          passTotals[flag] += passPrices[passName] || 0;
        }
      }
    }

    // Find cheapest
    let cheapest = null;
    for (const [flag, total] of Object.entries(passTotals)) {
      if (cheapest === null || total < cheapest.total) {
        cheapest = {
          flag,
          name: passMap[flag],
          total
        };
      }
    }

    return res.json({
      cheapestPass: cheapest.name,
      totalCost: cheapest.total
    });

  } catch (err) {
    console.error("❌ Error in getCheapestPass:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

export const countPassOccurrences = async (req, res) => {
  const lang = req.query.lang?.toLowerCase();  // 'en' or 'de'
  const { attractionNames } = req.body;

  if (!Array.isArray(attractionNames) || attractionNames.length === 0) {
    return res.status(400).json({ error: "Invalid or empty 'attractionNames' array." });
  }

  const nameField = lang === 'de' ? 'de_attraction_name' : 'en_attraction_name';

  try {
    const attractions = await ParseAttraction.find({
      [nameField]: { $in: attractionNames }
    });

    if (attractions.length === 0) {
      return res.status(404).json({ error: 'No attractions found' });
    }

    const passCounts = {};

    // Initialize count for each pass flag
    for (const flag in passMap) {
      passCounts[flag] = 0;
    }

    // Count how many times each pass is available (flag is true)
    for (const attraction of attractions) {
      for (const flag in passMap) {
        if (attraction[flag]) {
          passCounts[flag]++;
        }
      }
    }

    // Convert to readable output (optional)
    const result = Object.entries(passCounts).map(([flag, count]) => ({
      flag,
      name: passMap[flag],
      count
    }));

    return res.json({ passUsageCounts: result });

  } catch (err) {
    console.error("❌ Error in countPassOccurrences:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};





export const importPasses = async (req, res) => {
  const results = [];

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, '..', 'assets', 'Pass_Calc_PASSES.csv');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => results.push(row))
    .on('end', async () => {
      // console.log(`📥 CSV loaded. Total rows: ${results.length}`);
      // console.log('📄 CSV headers:', Object.keys(results[0]));

      try {
        for (const row of results) {
          const passId = row.passID?.trim();
          if (!passId || (!row.en_passName && !row.de_passName && !row.passPriceAdult)) {
            // console.warn('⚠️ Skipping invalid or empty row:', row);
            continue;
          }

          await Pass.findOneAndUpdate(
            { passId },
            {
              passId,
              en_passName: row.en_passName?.trim() || '',
              de_passName: row.de_passName?.trim() || '',
              priceAdult: parseFloat(row.passPriceAdult?.replace('$', '').trim() || 0),
              en_passaffilated_link: row.en_passAffiliateLink?.trim() || '',
              de_passaffilated_link: row.de_passAffiliateLink?.trim() || '',
              imageLink: row.passImageLink?.trim() || '',
            },
            { upsert: true, new: true }
          );
        }

        // ✅ Automatically link all passes to attractions after import
        await linkPassesToAttractions();

        res.status(200).send('✅ Passes and attraction links imported successfully');
      } catch (err) {
        console.error('❌ Error during import:', err.message);
        res.status(500).json({ error: 'Failed to import passes' });
      }
    });
};



export const getAllPasses = async (req, res) => {
  try {
    const passes = await getAllPassesService();
    res.status(200).json({ success: true, data: passes });
  } catch (error) {
    console.error('❌ Error fetching passes:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch passes' });
  }
};
