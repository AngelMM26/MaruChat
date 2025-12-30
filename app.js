const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
/*
By default, Express does not automatically serve any files from server's file system,
so must explicity enable this functionality
*/
app.use(express.static(path.join(__dirname, "public"))); // contents served directly to the browser

app.listen(3000, () => console.log(`Server running at http://localhost:3000`));

mongoose.connect("mongodb://localhost:27017/MaruChat");

const transcriptSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    transcript: {
        type: String,
        required: true,
        trim: true
    }
})

const Transcript = mongoose.model("Transcript", transcriptSchema);


app.get("/api/transcripts", async (req, res) => {
    try {
        const transcripts = await Transcript.find().sort({ date: -1 });
        res.status(200).json(transcripts); // Return an array of transcripts sorted by descending order (JSON object)
    } catch (err) {
        console.error("Error fetching transcripts:", err);
        res.status(500).send({ error: "Failed to fetch transcripts" });
    }
});

app.post("/api/save", async (req, res) => {
    const { title, transcript } = req.body;
    const doc = await Transcript.create({
        title: title,
        date: undefined,
        transcript: transcript
    })
    res.status(200).send({ // Upon sucessful creation send back the docID, revist this
        docID: doc._id,
    });
})


