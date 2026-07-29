import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({
    adapter,
    log:
        process.env.NODE_ENV === "development" 
        ? ["query", "info", "warn", "error"] 
        : ["error"],
});


const connectDB = async () => {
    try{
        await prisma.$connect();
        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
};


const disconnectDB = async () => {
    await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };