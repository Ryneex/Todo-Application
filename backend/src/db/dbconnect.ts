import chalk from "chalk";
import mongoose from "mongoose";

export default async function dbconnect() {
    await mongoose.connect(process.env.MONGODB_URI!, {
        dbName: "Todo",
    });
    return { success: chalk.blueBright("MongoDB Connected") };
}
