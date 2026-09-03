import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedDefaultData } from "./utils/seedData.js";

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

const startServer = async () => {
  await connectDB();
  await seedDefaultData();

  app.listen(PORT, () => {
    console.log(`Pacxone backend running on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
