//hosted at https://notes-u7b0.onrender.com/api/notes

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Notes from "./notes.model.js";

dotenv.config({ path: "./.env" });

const app = express();
const corsOptions = {
	origin: "http://localhost:5173",
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("dist"));

//get

app.get("/", (req, res) => {
	res.send("yoo"); //it will be just ignored as corresponding file exists in dist folder and we are using static files but just in case so i have put this.
});

app.get("/api/notes", async (req, res) => {
	const notes = await Notes.find({});
	console.log(notes);

	if (!notes || notes.length < 1) {
		res.json([]);
	}

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

//post

app.post("/api/notes", async (req, res) => {
	let note = req.body;

	if (!note.content) {
		res.json({ msg: "content not found" });
		return;
	}

	note.important = note.important || false;

	console.log(note);

	note = await Notes.create(note);
	res.status(200).json(note);
});

//delete

app.delete("/api/notes/:id", async (req, res) => {
	const { id } = req.params;
	try {
		await Notes.findByIdAndDelete(id);
		res.status(200).json({ msg: "successefully deleted" });
	} catch (err) {
		res.status(404).json(err.message);
	}
});

//patch

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

const handleUnknownRoute = (req, res, next) => {
	res.status(404).json({
		error: "Unknown route " + req.path,
	});
	next();
};

app.use(handleUnknownRoute);

const PORT = process.env.PORT || 3001;
const MONGOPASS = process.env.MONGOPASS;
app.listen(PORT, () => {
	console.log("app running on port ", PORT);
	mongoose
		.connect(
			`mongodb+srv://tamanna:${MONGOPASS}@cluster0.wn3i7.mongodb.net/NotesApp?retryWrites=true&w=majority&appName=Cluster0`
		)
		.then(() => {
			console.log("db is connected");
		})
		.catch((error) => {
			console.log(error.message);
		});
});
