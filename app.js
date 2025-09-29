const path = require("path");
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

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

app.post("/api/save", async (req, res) => {
    const { title, transcript } = req.body;
    const doc = await Transcript.create({
        title: title,
        date: undefined,
        transcript: transcript
    })
    res.status(200).send({ // Upon sucessful creation send back the docID
        docID: doc._id,
    });
})

