import app from "./app.js";
import connectDB from "./config/db.js";
import ENV from "./config/env.js";

// Connect to database
connectDB();

// Start the server
app.listen(ENV.PORT, () => {
  console.log(`Server running in ${ENV.NODE_ENV} mode on port ${ENV.PORT}`);
});
