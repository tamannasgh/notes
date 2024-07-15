import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const app = express();
const corsOptions = {
	origin: "http://localhost:5173",
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(express.json());
app.use(cors(corsOptions));

let notes = [
	{
		id: 1,
		content: "HTML is easy",
		important: true,
	},
	{
		id: 2,
		content: "Browser can execute only JavaScript",
		important: false,
	},
	{
		id: 3,
		content: "GET and POST are the most important methods of HTTP protocol",
		important: true,
	},
];

//get

app.get("/", (req, res) => {
	res.send("<h1>yooo</h1>");
});

app.get("/api/notes", (req, res) => {
	res.json(notes);
});

app.get("/api/notes/:id", (req, res) => {
	const data = notes.find((note) => note.id === Number(req.params.id));
	if (data) res.json(data);
	else {
		res.status(404).send("<h1>there is no note here yet.</h1>");
	}
});

//delete

app.delete("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id);
	notes = notes.filter((note) => note.id !== id);
	// console.log(notes, id, typeof id);
	res.status(200).json({ msg: "successfuly deleted" });
});

//post
app.post("/api/notes", (req, res) => {
	const note = req.body;

	if (!note.content) {
		return res.status(400).send("content not found!");
	}

	note.id =
		notes.length < 1 ? 1 : Math.max(...notes.map((note) => note.id)) + 1;
	note.important = note.important || false;

	notes.push(note);

	res.status(200).json(note);
});

//patch
app.patch("/api/notes/:id", (req, res) => {
	const id = Number(req.params.id);
	let note = notes.find((note) => note.id === id);
	note = { ...req.body };
	console.log(req.body);
	notes = notes.map((n) => (n.id === id ? note : n));
	console.log(note);
	res.status(200).json(note);
});

const handleUnknownRoute = (req, res, next) => {
	res.status(404).json({
		error: "Unknown route " + req.path,
	});
	next();
};

app.use(handleUnknownRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log("server is up and running on port ", PORT);
});
