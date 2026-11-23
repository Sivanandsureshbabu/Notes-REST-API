const Note = require("../models/Note");

// GET all notes with optional category filtering
const getAllNotes = async (req, res) => {
  try {
    const { category } = req.query;

    const validCategories = ["General", "Work", "Personal", "Ideas"];

    if (category && !validCategories.includes(category)) {
      return res.status(400).json({
        message: "Invalid category. Use General, Work, Personal, or Ideas",
      });
    }

    const filter = category ? { category } : {};

    const notes = await Note.find(filter);

    res.status(200).json(notes);
  } catch (error) {
    console.error("Get notes error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// GET note by ID
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    console.error("Get note error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// CREATE a new note
const createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const newNote = new Note({
      title: title.trim(),
      content: content.trim(),
      category,
    });

    const savedNote = await newNote.save();

    res.status(201).json({
      message: "Note created successfully",
      note: savedNote,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Create note error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// UPDATE a note
const updateNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (
      ("title" in req.body && (typeof title !== "string" || !title.trim())) ||
      ("content" in req.body &&
        (typeof content !== "string" || !content.trim()))
    ) {
      return res.status(400).json({
        message: "Title and content cannot be empty",
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title: title.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(category !== undefined && { category }),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        message: error.message,
      });
    }

    console.error("Update note error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// DELETE a note
const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid note ID",
      });
    }

    console.error("Delete note error:", error.message);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
