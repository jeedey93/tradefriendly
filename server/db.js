import mongoose from "mongoose";

// Use environment variable or default URI
const dbURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/tradefriendly";

// Connect to MongoDB
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
  });

// Export the Mongoose instance
export default mongoose;
