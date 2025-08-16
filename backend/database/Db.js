// Robust Mongo connect (works for dev & prod and retries)
import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const uri =
  process.env.MONGO_URI ||
  `mongodb://${process.env.DB_HOST || "db"}:27017/${process.env.DB_NAME || "crud"}`;

async function connectWithRetry() {
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Mongo connected →", uri);
  } catch (err) {
    console.error("Mongo connect failed, retrying in 5s…", err.message);
    setTimeout(connectWithRetry, 5000);
  }
}

export default connectWithRetry;
