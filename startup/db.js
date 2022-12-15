import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.set('strictQuery', true);

export default function connectToDB() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to the DB..."))
    .catch((err) => {
      console.error(err.message);
    });
}
