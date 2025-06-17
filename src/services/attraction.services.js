import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { fileURLToPath } from 'url';
import ParseAttraction from '../models/attraction.model.js';
import Category from '../models/attraction.categorie.js';

const toBoolean = (value) => String(value).trim().toLowerCase() === 'true';

export const importAttractionsService = () => {
  return new Promise((resolve, reject) => {
    const results = [];

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, '..', 'assets', 'ATTRACTIONS.csv');

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        try {
          for (let row of results) {
            const enCategoryName = row['en-attractionCategory']?.trim();
            const deCategoryName = row['de-attractionCategory']?.trim();

            if (!enCategoryName && !deCategoryName) {
              console.warn('No category names found in row:', row);
              continue;
            }

            let category = await Category.findOne({
              $or: [
                { en_name: enCategoryName },
                { de_name: deCategoryName },
              ],
            });

            if (!category) {
              category = new Category({
                en_name: enCategoryName || 'Unknown EN',
                de_name: deCategoryName || 'Unknown DE',
              });
              await category.save();
              console.log(`Created new category: EN="${category.en_name}", DE="${category.de_name}"`);
            }

            const exists = await ParseAttraction.findOne({ attractionId: row.attractionId });
            if (!exists) {
              const rawPrice = row.attractionPriceAdult?.replace('$', '').trim();
              const priceAdult = rawPrice && !isNaN(rawPrice) ? parseFloat(rawPrice) : 0;

              const newAttraction = new ParseAttraction({
                attractionId: row.attractionId,
                en_attraction_name: row.en_attractionName,
                de_attraction_name: row.de_attractionName,
                pass_price_adult: priceAdult, // ✅ Corrected line
                category: category._id,
                gocity_day_pass: toBoolean(row.gocityDayPass),
                gocity_flex_pass: toBoolean(row.gocityFlexPass),
                sightseeing_day_pass: toBoolean(row.sightseeingDayPass),
                sightseeing_flex_pass: toBoolean(row.sightseeingFlexPass),
                sightseeing_economy_pay_day_pass: toBoolean(row.sightseeingEconomyDayPass),
                sightseeing_economy_pay_flex_pass: toBoolean(row.sightseeingEconomyflexPass),
                de_pass_affiliate_link: row.de_attractionAffiliateLink,
                en_pass_affiliate_link: row.en_attractionAffiliateLink,
                Imagelink: row.attractionImageLink,
              });

              await newAttraction.save();
              console.log(`Inserted attraction: ${row.attractionId}`);
            }
          }

          console.log('✅ CSV import completed');
          resolve('CSV data imported successfully');
        } catch (err) {
          console.error('❌ Error inserting attractions:', err.message);
          reject(err);
        }
      })
      .on('error', (err) => {
        console.error('❌ CSV read error:', err.message);
        reject(err);
      });
  });
};



export const getAttractionsService = async (lang = 'en') => {
  const language = lang.toLowerCase() === 'de' ? 'de' : 'en';
  const attractions = await ParseAttraction.find().populate('category');

  return attractions.map((attr) => ({
    attractionId: attr.attractionId,
    attraction_name: language === 'en' ? attr.en_attraction_name : attr.de_attraction_name,
    pass_price_adult: attr.pass_price_adult,
    Imagelink: attr.Imagelink,
    gocity_day_pass: attr.gocity_day_pass,
    gocity_flex_pass: attr.gocity_flex_pass,
    sightseeing_day_pass: attr.sightseeing_day_pass,
    sightseeing_flex_pass: attr.sightseeing_flex_pass,
    sightseeing_economy_pay_day_pass: attr.sightseeing_economy_pay_day_pass,
    sightseeing_economy_pay_flex_pass: attr.sightseeing_economy_pay_flex_pass,
    pass_affiliate_link: language === 'en' ? attr.en_pass_affiliate_link : attr.de_pass_affiliate_link,
    category: {
      _id: attr.category?._id,
      name: language === 'en' ? attr.category?.en_name : attr.category?.de_name,
    },
  }));
};


export const getAttractionByIdService = async (id, lang = 'en') => {
  const language = lang.toLowerCase() === 'de' ? 'de' : 'en';

  const attraction = await ParseAttraction.findOne({ attractionId: id }).populate('category');

  if (!attraction) return null;

  return {
    attractionId: attraction.attractionId,
    attraction_name: language === 'en' ? attraction.en_attraction_name : attraction.de_attraction_name,
    pass_price_adult: attraction.pass_price_adult,
    Imagelink: attraction.Imagelink,
    gocity_day_pass: attraction.gocity_day_pass,
    gocity_flex_pass: attraction.gocity_flex_pass,
    sightseeing_day_pass: attraction.sightseeing_day_pass,
    sightseeing_flex_pass: attraction.sightseeing_flex_pass,
    sightseeing_economy_pay_day_pass: attraction.sightseeing_economy_pay_day_pass,
    sightseeing_economy_pay_flex_pass: attraction.sightseeing_economy_pay_flex_pass,
    pass_affiliate_link: language === 'en' ? attraction.en_pass_affiliate_link : attraction.de_pass_affiliate_link,
    category: {
      _id: attraction.category?._id,
      name: language === 'en' ? attraction.category?.en_name : attraction.category?.de_name
    }
  };
};

export const createAttractionService = async (data, lang = 'en') => {
  const {
    attractionId,
    en_attraction_name,
    de_attraction_name,
    pass_price_adult,
    Imagelink,
    gocity_day_pass,
    gocity_flex_pass,
    sightseeing_day_pass,
    sightseeing_flex_pass,
    sightseeing_economy_pay_day_pass,
    sightseeing_economy_pay_flex_pass,
    en_pass_affiliate_link,
    de_pass_affiliate_link,
    category
  } = data;

  // Validate required fields
  if (!attractionId || !en_attraction_name || !de_attraction_name || !category) {
    return { error: 'Missing required fields: attractionId, en_attraction_name, de_attraction_name, category' };
  }

  const existingAttraction = await ParseAttraction.findOne({ attractionId });
  if (existingAttraction) {
    return { error: 'Attraction with this ID already exists', status: 409 };
  }

  const categoryExists = await Category.findById(category);
  if (!categoryExists) {
    return { error: 'Category not found. Please provide a valid category ID.', status: 400 };
  }

  const newAttraction = new ParseAttraction({
    attractionId,
    en_attraction_name,
    de_attraction_name,
    pass_price_adult,
    Imagelink: Imagelink || '',
    gocity_day_pass: gocity_day_pass || false,
    gocity_flex_pass: gocity_flex_pass || false,
    sightseeing_day_pass: sightseeing_day_pass || false,
    sightseeing_flex_pass: sightseeing_flex_pass || false,
    sightseeing_economy_pay_day_pass: sightseeing_economy_pay_day_pass || false,
    sightseeing_economy_pay_flex_pass: sightseeing_economy_pay_flex_pass || false,
    en_pass_affiliate_link: en_pass_affiliate_link || '',
    de_pass_affiliate_link: de_pass_affiliate_link || '',
    category
  });

  const savedAttraction = await newAttraction.save();
  await savedAttraction.populate('category');

  const language = lang.toLowerCase() === 'de' ? 'de' : 'en';

  return {
    attractionId: savedAttraction.attractionId,
    en_attraction_name: savedAttraction.en_attraction_name,
    de_attraction_name: savedAttraction.de_attraction_name,
    pass_price_adult: savedAttraction.pass_price_adult,
    Imagelink: savedAttraction.Imagelink,
    gocity_day_pass: savedAttraction.gocity_day_pass,
    gocity_flex_pass: savedAttraction.gocity_flex_pass,
    sightseeing_day_pass: savedAttraction.sightseeing_day_pass,
    sightseeing_flex_pass: savedAttraction.sightseeing_flex_pass,
    sightseeing_economy_pay_day_pass: savedAttraction.sightseeing_economy_pay_day_pass,
    sightseeing_economy_pay_flex_pass: savedAttraction.sightseeing_economy_pay_flex_pass,
    pass_affiliate_link: language === 'en' ? savedAttraction.en_pass_affiliate_link : savedAttraction.de_pass_affiliate_link,
    category: {
      _id: savedAttraction.category?._id,
      name: language === 'en' ? savedAttraction.category?.en_name : savedAttraction.category?.de_name
    }
  };
};


export const updateAttractionService = async (id, updateData, lang = 'en') => {
  if (Object.keys(updateData).length === 0) {
    return { error: 'No update data provided', status: 400 };
  }

  // Check if attraction exists
  const existingAttraction = await ParseAttraction.findOne({ attractionId: id });
  if (!existingAttraction) {
    return { error: 'Attraction not found', status: 404 };
  }

  // If category is being updated, validate it exists
  if (updateData.category) {
    const categoryExists = await Category.findById(updateData.category);
    if (!categoryExists) {
      return { error: 'Category not found. Please provide a valid category ID.', status: 400 };
    }
  }

  const updatedAttraction = await ParseAttraction.findOneAndUpdate(
    { attractionId: id },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  await updatedAttraction.populate('category');

  const language = lang.toLowerCase() === 'de' ? 'de' : 'en';

  return {
    attractionId: updatedAttraction.attractionId,
    attraction_name: language === 'en' ? updatedAttraction.en_attraction_name : updatedAttraction.de_attraction_name,
    pass_price_adult: updatedAttraction.pass_price_adult,
    Imagelink: updatedAttraction.Imagelink,
    gocity_day_pass: updatedAttraction.gocity_day_pass,
    gocity_flex_pass: updatedAttraction.gocity_flex_pass,
    sightseeing_day_pass: updatedAttraction.sightseeing_day_pass,
    sightseeing_flex_pass: updatedAttraction.sightseeing_flex_pass,
    sightseeing_economy_pay_day_pass: updatedAttraction.sightseeing_economy_pay_day_pass,
    sightseeing_economy_pay_flex_pass: updatedAttraction.sightseeing_economy_pay_flex_pass,
    pass_affiliate_link: language === 'en' ? updatedAttraction.en_pass_affiliate_link : updatedAttraction.de_pass_affiliate_link,
    category: {
      _id: updatedAttraction.category?._id,
      name: language === 'en' ? updatedAttraction.category?.en_name : updatedAttraction.category?.de_name
    }
  };
};

export const deleteAttractionService = async (id) => {
  const existingAttraction = await ParseAttraction.findOne({ attractionId: id });
  if (!existingAttraction) {
    return { error: 'Attraction not found', status: 404 };
  }

  await ParseAttraction.findOneAndDelete({ attractionId: id });

  return {
    success: true,
    message: 'Attraction deleted successfully',
    attractionId: id
  };
};
