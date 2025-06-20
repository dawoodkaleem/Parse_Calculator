import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import parseAttractionRoutes from './routes/attraction.route.js';
import parsePassesRoutes from './routes/passes.route.js'
import CategoryRoute from './routes/attraction.category.route.js'
import PassAttrction from "./routes/pass.attraction.route.js"
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/attractions', parseAttractionRoutes);
app.use('/api/passes', parsePassesRoutes)
app.use('/api/category', CategoryRoute)
app.use('/api/pass-attraction', PassAttrction)
connectDB();



export default app;
