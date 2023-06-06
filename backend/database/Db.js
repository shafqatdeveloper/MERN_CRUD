import mongoose from "mongoose";

const connection = async () => {
  const URL = "mongodb://0.0.0.0:27017/crud";
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Connected to Mongo Database Successfully");
  } catch (error) {
    console.log("An Error occured while connecting to database", error);
  }
};

export default connection;