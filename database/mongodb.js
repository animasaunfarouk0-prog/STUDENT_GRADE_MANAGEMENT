import mongoose from "mongoose";
import { DATABASE_URL, NODE_ENV } from "../config/env.js";

const connectTODatabase = async () => {
    if (!DATABASE_URL) {
        console.warn("No database URL found. Skipping database connection.");
        return;
    }

    try {
        await mongoose.connect(DATABASE_URL, {
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`Successfully connected to the database in ${NODE_ENV} mode.`);
    } catch (error) {
        console.error("Error connecting to the database:", error.message);
        console.warn("Continuing without database connection for now.");
    }
};

export default connectTODatabase;