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
    await seedDefaultData();
    console.log("Database initialization completed.");
  } catch (error) {
    console.error("Database initialization failed:", error.message);
  }
};

void initializeDatabase();
