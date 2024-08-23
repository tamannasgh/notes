import express from "express";
import mongoose from "mongoose";
import Notes from "./notes.model.js";

const app = express();
app.use(express.json());

app.listen(3001, () => {
	console.log("app running on port 3001");
	mongoose
		.connect(
			"mongodb+srv://tamanna:Admin%40123@cluster0.wn3i7.mongodb.net/NotesApp?retryWrites=true&w=majority&appName=Cluster0"
		)
		.then(() => {
			console.log("db is connected");
		})
		.catch((error) => {
			console.log(error.message);
		});
});

app.get("/api/notes", async (req, res) => {
	const notes = await Notes.find({});
	console.log(notes);

	res.status(200).json(notes);
});

app.get("/api/notes/:id", async (req, res) => {
	const { id } = req.params; //haha im a cool dev now...

	try {
		const note = await Notes.findById(id);
		res.status(200).json(note);
	} catch (err) {
		res.status(500).json(err);
	}
});

app.post("/api/notes", async (req, res) => {
	let note = req.body;

	if (!note.content) {
		res.json({ msg: "content not found" });
		return;
	}

	note.important = note.important || false;

	// console.log(note);

	note = await Notes.create(note);
	res.status(200).json(note);
});

app.delete("/api/notes/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await Notes.findByIdAndDelete(id);
		res.status(200).json({ msg: "successefully deleted" });
	} catch (err) {
		res.status(404).json(err.message);
	}
});

app.patch("/api/notes/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const updatedNote = await Notes.findByIdAndUpdate(id, req.body, {
			new: true,
		});
		res.status(200).json({ msg: "note updated successfully", updatedNote });
	} catch (err) {
		res.status(404).json(err.message);
	}
});
