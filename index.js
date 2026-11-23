require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

// Notes routes
const noteRoutes = require("./routes/noteRoutes");

app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT || 5000;

// Connect database before starting server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
