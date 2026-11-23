require("dotenv").config();

const mongoose = require("mongoose");
const Note = require("./models/Note");

const sampleNotes = [
  {
    title: "Learn JavaScript",
    content: "Practice JavaScript every day",
    category: "General",
  },
  {
    title: "Complete Assignment",
    content: "Finish MongoDB assignment",
    category: "Work",
  },
  {
    title: "Buy Groceries",
    content: "Buy vegetables and fruits",
    category: "Personal",
  },
  {
    title: "Project Idea",
    content: "Build a task management application",
    category: "Ideas",
  },
  {
    title: "Learn Express",
    content: "Practice Express and Node.js",
    category: "Work",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected for seeding");

    await Note.deleteMany({});

    await Note.insertMany(sampleNotes);

    console.log("5 sample notes added successfully");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
