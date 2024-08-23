import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
	{
		content: String,
		important: Boolean,
	},
	{ timestamps: true }
);

const Notes = mongoose.model("note", notesSchema);

export default Notes;
