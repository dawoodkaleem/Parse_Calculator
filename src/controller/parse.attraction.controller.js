
import {
  importAttractionsService, getAttractionsService, getAttractionByIdService,
  createAttractionService, updateAttractionService, deleteAttractionService
} from '../services/attraction.services.js';


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




// export const getAttractionById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const lang = req.query.lang?.toLowerCase() === 'de' ? 'de' : 'en';

//     const attraction = await ParseAttraction.findOne({ attractionId: id }).populate('category');

//     if (!attraction) {
//       return res.status(404).json({ error: 'Attraction not found' });
//     }

//     const response = {
//       attractionId: attraction.attractionId,
//       attraction_name: lang === 'en' ? attraction.en_attraction_name : attraction.de_attraction_name,
//       pass_price_adult: attraction.pass_price_adult,
//       Imagelink: attraction.Imagelink,
//       gocity_day_pass: attraction.gocity_day_pass,
//       gocity_flex_pass: attraction.gocity_flex_pass,
//       sightseeing_day_pass: attraction.sightseeing_day_pass,
//       sightseeing_flex_pass: attraction.sightseeing_flex_pass,
//       sightseeing_economy_pay_day_pass: attraction.sightseeing_economy_pay_day_pass,
//       sightseeing_economy_pay_flex_pass: attraction.sightseeing_economy_pay_flex_pass,
//       pass_affiliate_link: lang === 'en' ? attraction.en_pass_affiliate_link : attraction.de_pass_affiliate_link,
//       category: {
//         _id: attraction.category?._id,
//         name: lang === 'en' ? attraction.category?.en_name : attraction.category?.de_name
//       }
//     };

//     res.status(200).json(response);
//   } catch (err) {
//     console.error('Error getting attraction by ID:', err.message);
//     res.status(500).json({ error: 'Server error while fetching attraction' });
//   }
// };

// export const createAttraction = async (req, res) => {
//   const { attractionId,
//     en_attraction_name,
//     de_attraction_name,
//     pass_price_adult,
//     Imagelink,
//     gocity_day_pass,
//     gocity_flex_pass,
//     sightseeing_day_pass,
//     sightseeing_flex_pass,
//     sightseeing_economy_pay_day_pass,
//     sightseeing_economy_pay_flex_pass,
//     en_pass_affiliate_link,
//     de_pass_affiliate_link,
//     category
//   } = req.body;

//   if (!attractionId || !en_attraction_name || !de_attraction_name || !category) {
//     return res.status(400).json({
//       error: 'Missing required fields: attractionId, en_attraction_name, de_attraction_name, category'
//     });
//   }
//   try {

//     const existingAttraction = await ParseAttraction.findOne({ attractionId });
//     if (existingAttraction) {
//       return res.status(409).json({ error: 'Attraction with this ID already exists' });
//     }
//     const categoryExists = await Category.findById(category);
//     if (!categoryExists) {
//       return res.status(400).json({ error: 'Category not found. Please provide a valid category ID.' });
//     }
//     const newAttraction = new ParseAttraction({
//       attractionId,
//       en_attraction_name,
//       de_attraction_name,
//       pass_price_adult: pass_price_adult,
//       Imagelink: Imagelink || '',
//       gocity_day_pass: gocity_day_pass || false,
//       gocity_flex_pass: gocity_flex_pass || false,
//       sightseeing_day_pass: sightseeing_day_pass || false,
//       sightseeing_flex_pass: sightseeing_flex_pass || false,
//       sightseeing_economy_pay_day_pass: sightseeing_economy_pay_day_pass || false,
//       sightseeing_economy_pay_flex_pass: sightseeing_economy_pay_flex_pass || false,
//       en_pass_affiliate_link: en_pass_affiliate_link || '',
//       de_pass_affiliate_link: de_pass_affiliate_link || '',
//       category: category
//     });
//     const savedAttraction = await newAttraction.save();


//     await savedAttraction.populate('category');


//     const lang = req.query.lang?.toLowerCase() === 'de' ? 'de' : 'en';


//     const response = {
//       attractionId: savedAttraction.attractionId,
//       en_attraction_name: savedAttraction.en_attraction_name,
//       de_attraction_name: savedAttraction.de_attraction_name,
//       pass_price_adult: savedAttraction.pass_price_adult,
//       Imagelink: savedAttraction.Imagelink,
//       gocity_day_pass: savedAttraction.gocity_day_pass,
//       gocity_flex_pass: savedAttraction.gocity_flex_pass,
//       sightseeing_day_pass: savedAttraction.sightseeing_day_pass,
//       sightseeing_flex_pass: savedAttraction.sightseeing_flex_pass,
//       sightseeing_economy_pay_day_pass: savedAttraction.sightseeing_economy_pay_day_pass,
//       sightseeing_economy_pay_flex_pass: savedAttraction.sightseeing_economy_pay_flex_pass,
//       pass_affiliate_link: lang === 'en' ? savedAttraction.en_pass_affiliate_link : savedAttraction.de_pass_affiliate_link,
//       category: {
//         _id: savedAttraction.category?._id,
//         name: lang === 'en' ? savedAttraction.category?.en_name : savedAttraction.category?.de_name
//       }
//     };

//     res.status(201).json(response);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error while creating attraction' });
//   }
// }

// export const updateAttraction = async (req, res) => {
//   const {
//     en_attraction_name,
//     de_attraction_name,
//     pass_price_adult,
//     Imagelink,
//     gocity_day_pass,
//     gocity_flex_pass,
//     sightseeing_day_pass,
//     sightseeing_flex_pass,
//     sightseeing_economy_pay_day_pass,
//     sightseeing_economy_pay_flex_pass,
//     en_pass_affiliate_link,
//     de_pass_affiliate_link,
//     category
//   } = req.body;

//   const { id } = req.params; // attractionId from URL params

//   // Check if request body is empty
//   if (Object.keys(req.body).length === 0) {
//     return res.status(400).json({ error: 'No update data provided' });
//   }

//   try {
//     // Check if attraction exists
//     const existingAttraction = await ParseAttraction.findOne({ attractionId: id });
//     if (!existingAttraction) {
//       return res.status(404).json({ error: 'Attraction not found' });
//     }

//     // If category is being updated, validate it exists
//     if (category) {
//       const categoryExists = await Category.findById(category);
//       if (!categoryExists) {
//         return res.status(400).json({ error: 'Category not found. Please provide a valid category ID.' });
//       }
//     }

//     // Prepare update data (only include fields that are provided)
//     const updateData = {};

//     if (en_attraction_name !== undefined) updateData.en_attraction_name = en_attraction_name;
//     if (de_attraction_name !== undefined) updateData.de_attraction_name = de_attraction_name;
//     if (pass_price_adult !== undefined) updateData.pass_price_adult = pass_price_adult;
//     if (Imagelink !== undefined) updateData.Imagelink = Imagelink;
//     if (gocity_day_pass !== undefined) updateData.gocity_day_pass = gocity_day_pass;
//     if (gocity_flex_pass !== undefined) updateData.gocity_flex_pass = gocity_flex_pass;
//     if (sightseeing_day_pass !== undefined) updateData.sightseeing_day_pass = sightseeing_day_pass;
//     if (sightseeing_flex_pass !== undefined) updateData.sightseeing_flex_pass = sightseeing_flex_pass;
//     if (sightseeing_economy_pay_day_pass !== undefined) updateData.sightseeing_economy_pay_day_pass = sightseeing_economy_pay_day_pass;
//     if (sightseeing_economy_pay_flex_pass !== undefined) updateData.sightseeing_economy_pay_flex_pass = sightseeing_economy_pay_flex_pass;
//     if (en_pass_affiliate_link !== undefined) updateData.en_pass_affiliate_link = en_pass_affiliate_link;
//     if (de_pass_affiliate_link !== undefined) updateData.de_pass_affiliate_link = de_pass_affiliate_link;
//     if (category !== undefined) updateData.category = category;

//     // Update the attraction
//     const updatedAttraction = await ParseAttraction.findOneAndUpdate(
//       { attractionId: id },
//       { $set: updateData },
//       {
//         new: true, // Return updated document
//         runValidators: true // Run schema validators
//       }
//     );

//     // Populate category
//     await updatedAttraction.populate('category');

//     // Get language preference
//     const lang = req.query.lang?.toLowerCase() === 'de' ? 'de' : 'en';

//     // Format response similar to create function
//     const response = {
//       attractionId: updatedAttraction.attractionId,
//       attraction_name: lang === 'en' ? updatedAttraction.en_attraction_name : updatedAttraction.de_attraction_name,
//       pass_price_adult: updatedAttraction.pass_price_adult,
//       Imagelink: updatedAttraction.Imagelink,
//       gocity_day_pass: updatedAttraction.gocity_day_pass,
//       gocity_flex_pass: updatedAttraction.gocity_flex_pass,
//       sightseeing_day_pass: updatedAttraction.sightseeing_day_pass,
//       sightseeing_flex_pass: updatedAttraction.sightseeing_flex_pass,
//       sightseeing_economy_pay_day_pass: updatedAttraction.sightseeing_economy_pay_day_pass,
//       sightseeing_economy_pay_flex_pass: updatedAttraction.sightseeing_economy_pay_flex_pass,
//       pass_affiliate_link: lang === 'en' ? updatedAttraction.en_pass_affiliate_link : updatedAttraction.de_pass_affiliate_link,
//       category: {
//         _id: updatedAttraction.category?._id,
//         name: lang === 'en' ? updatedAttraction.category?.en_name : updatedAttraction.category?.de_name
//       }
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Error updating attraction:', error.message);
//     res.status(500).json({ error: 'Server error while updating attraction' });
//   }
// };

// export const deleteAttraction = async (req, res) => {
//   const { id } = req.params; // attractionId from URL params

//   try {
//     // Check if attraction exists
//     const existingAttraction = await ParseAttraction.findOne({ attractionId: id });
//     if (!existingAttraction) {
//       return res.status(404).json({ error: 'Attraction not found' });
//     }

//     // Delete the attraction
//     await ParseAttraction.findOneAndDelete({ attractionId: id });

//     // Return success response
//     res.status(200).json({
//       success: true,
//       message: 'Attraction deleted successfully',
//       attractionId: id
//     });
//   } catch (error) {
//     console.error('Error deleting attraction:', error.message);
//     res.status(500).json({
//       error: 'Server error while deleting attraction',
//       details: error.message
//     });
//   }
// };

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
