import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDefaultData } from "./utils/seedData.js";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(`Pacxone backend listening on port ${PORT}`);
});

const initializeDatabase = async () => {
  try {
    await connectDB();

    if (process.env.SEED_DEFAULT_DATA === "true") {
      await seedDefaultData();
      console.log("Default data seeding completed.");
    } else {
      console.log("Default data seeding is disabled.");
    }

    console.log("Database initialization completed.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
  }
};

void initializeDatabase();
