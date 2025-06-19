
import {
  importAttractionsService, getAttractionsService, getAttractionByIdService,
  createAttractionService, updateAttractionService, deleteAttractionService
} from '../services/attraction.services.js';

import Category from '../models/attraction.categorie.js';
import Attraction from '../models/attraction.model.js';
export const importAttractions = async (req, res) => {
  try {
    const result = await importAttractionsService();
    res.status(200).json(result);  // use .json instead of .send
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to import attractions',
    });
  }
};





export const getAttractions = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const response = await getAttractionsService(lang);
    res.status(200).json(response);
  } catch (err) {
    console.error('Error getting attractions:', err.message);
    res.status(500).json({ error: 'Server error while fetching attractions' });
  }
};



export const getAttractionById = async (req, res) => {
  try {
    const { id } = req.params;
    const lang = req.query.lang || 'en';

    const result = await getAttractionByIdService(id, lang);

    if (!result) {
      return res.status(404).json({ error: 'Attraction not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    console.error('Error getting attraction by ID:', err.message);
    res.status(500).json({ error: 'Server error while fetching attraction' });
  }
};

export const createAttraction = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const result = await createAttractionService(req.body, lang);

    if (result?.error) {
      return res.status(result.status || 400).json({ error: result.error });
    }

    res.status(201).json(result);
  } catch (err) {
    console.error('Error creating attraction:', err.message);
    res.status(500).json({ error: 'Server error while creating attraction' });
  }
};


export const updateAttraction = async (req, res) => {
  const { id } = req.params;
  const lang = req.query.lang || 'en';

  const result = await updateAttractionService(id, req.body, lang);
  if (result?.error) return res.status(result.status || 400).json({ error: result.error });

  res.status(200).json(result);
};

export const deleteAttraction = async (req, res) => {
  const { id } = req.params;

  const result = await deleteAttractionService(id);
  if (result?.error) return res.status(result.status || 400).json({ error: result.error });

  res.status(200).json(result);
};

export const getAttractionsByCategorySearch = async (req, res) => {
  let { lang, search } = req.query;
  lang = lang?.toLowerCase() || 'en';
  if (!lang || !['en', 'de'].includes(lang)) {
    return res.status(400).json({ error: 'Invalid or missing language. Use "en" or "de"' });
  }

  if (!search || typeof search !== 'string') {
    return res.status(400).json({ error: 'Search query is required and must be a string' });
  }

  try {
    // Find category by language name
    const category = await Category.findOne({
      [lang === 'en' ? 'en_name' : 'de_name']: { $regex: new RegExp(search, 'i') }
    });


    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find attractions by category _id
    const allAttractions = await Attraction.find({ category: category._id });

    const attractions = allAttractions.map(attraction => ({
      attractionId: attraction.attractionId,
      name: lang === 'en' ? attraction.en_attraction_name : attraction.de_attraction_name,
      pass_price_adult: attraction.pass_price_adult,
      Imagelink: attraction.Imagelink,
      pass_link: lang === 'en' ? attraction.en_pass_affiliate_link : attraction.de_pass_affiliate_link,
      gocity_day_pass: attraction.gocity_day_pass,
      gocity_flex_pass: attraction.gocity_flex_pass,
      sightseeing_day_pass: attraction.sightseeing_day_pass,
      sightseeing_flex_pass: attraction.sightseeing_flex_pass,
      sightseeing_economy_pay_day_pass: attraction.sightseeing_economy_pay_day_pass,
      sightseeing_economy_pay_flex_pass: attraction.sightseeing_economy_pay_flex_pass

    }));
    res.status(200).json({ category: category[lang === 'en' ? 'en_name' : 'de_name'], attractions });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// export const getAttractions = async (req, res) => {

//   try {
//     const lang = req.query.lang?.toLowerCase() === 'de' ? 'de' : 'en';

//     const attractions = await ParseAttraction.find().populate('category');

//     const response = attractions.map((attr) => {
//       return {
//         attractionId: attr.attractionId,
//         attraction_name: lang === 'en' ? attr.en_attraction_name : attr.de_attraction_name,
//         pass_price_adult: attr.pass_price_adult,
//         Imagelink: attr.Imagelink,
//         gocity_day_pass: attr.gocity_day_pass,
//         gocity_flex_pass: attr.gocity_flex_pass,
//         sightseeing_day_pass: attr.sightseeing_day_pass,
//         sightseeing_flex_pass: attr.sightseeing_flex_pass,
//         sightseeing_economy_pay_day_pass: attr.sightseeing_economy_pay_day_pass,
//         sightseeing_economy_pay_flex_pass: attr.sightseeing_economy_pay_flex_pass,
//         pass_affiliate_link: lang === 'en' ? attr.en_pass_affiliate_link : attr.de_pass_affiliate_link,
//         category: {
//           _id: attr.category?._id,
//           name: lang === 'en' ? attr.category?.en_name : attr.category?.de_name
//         }
//       };
//     });

//     res.status(200).json(response);
//   } catch (err) {
//     console.error('Error getting attractions:', err.message);
//     res.status(500).json({ error: 'Server error while fetching attractions' });
//   }
// };

// const toBoolean = (value) => String(value).trim().toLowerCase() === 'true';
// export const importAttractions = (req, res) => {
//   const results = [];

//   const __filename = fileURLToPath(import.meta.url);
//   const __dirname = path.dirname(__filename);

//   // Go one level up to access `src/assets`
//   const filePath = path.join(__dirname, '..', 'assets', 'ATTRACTIONS.csv');

//   fs.createReadStream(filePath)
//     .pipe(csv())
//     .on('data', (row) => {
//       results.push(row);
//     })
//     .on('end', async () => {
//       for (let row of results) {
//         try {
//           const enCategoryName = row['en-attractionCategory']?.trim();
//           const deCategoryName = row['de-attractionCategory']?.trim();

//           if (!enCategoryName && !deCategoryName) {
//             console.warn('No category names found in row:', row);
//             continue;
//           }

//           // Try to find existing category by en_name or de_name
//           let category = await Category.findOne({
//             $or: [
//               { en_name: enCategoryName },
//               { de_name: deCategoryName }
//             ]
//           });

//           // If category not found, create and save it
//           if (!category) {
//             category = new Category({
//               en_name: enCategoryName || 'Unknown EN',
//               de_name: deCategoryName || 'Unknown DE',
//             });
//             await category.save();
//             console.log(`Created new category: EN="${category.en_name}", DE="${category.de_name}"`);
//           }

//           // Then check if attraction already exists
//           const exists = await ParseAttraction.findOne({ attractionId: row.attractionId });

//           if (!exists) {
//             const newAttraction = new ParseAttraction({
//               attractionId: row.attractionId,
//               en_attraction_name: row.en_attractionName,
//               de_attraction_name: row.de_attractionName,
//               pass_price_adult: parseFloat(row.attractionPriceAdult.replace('$', '')),
//               category: category._id,
//               gocity_day_pass: toBoolean(row.gocityDayPass),
//               gocity_flex_pass: toBoolean(row.gocityFlexPass),
//               sightseeing_day_pass: toBoolean(row.sightseeingDayPass),
//               sightseeing_flex_pass: toBoolean(row.sightseeingFlexPass),
//               sightseeing_economy_pay_day_pass: toBoolean(row.sightseeingEconomyDayPass),
//               sightseeing_economy_pay_flex_pass: toBoolean(row.sightseeingEconomyflexPass),
//               de_pass_affiliate_link: row.de_attractionAffiliateLink,
//               en_pass_affiliate_link: row.en_attractionAffiliateLink,
//               Imagelink: row.attractionImageLink
//             });

//             await newAttraction.save();
//             console.log(`Inserted attraction: ${row.attractionId}`);
//           }
//         } catch (err) {
//           console.error('Error inserting attraction:', err.message);
//         }
//       }

//       res.send('CSV data imported successfully');
//     });
// }

