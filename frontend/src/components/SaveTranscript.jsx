import { useState } from "react";

function SaveTranscript({ transcript }) {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("");

    const handleSave = async (event) => {
        event.preventDefault(); // Prevents the page from refreshing 
        if (!transcript.trim()) {
            setStatus("Need a transcript!");
            return;
        }
        if (!title.trim()) {
            setStatus("Need a title!");
            return;
        }

        try {
            // POST request to save transcript
            const res = await fetch("/api/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, transcript })
            });

            if (res.ok) {
                setStatus(`Successfully saved '${title}'.`);
                setTitle("");
            } else {
                setStatus(`Could not save  '${title}'.`);
            }

        } catch (err) {
            console.error(err);
            setStatus("Error saving transcript.")
        }
    }

    return <>
        <h3>Save Transcript</h3>
        <div className="general-section">
            <form id="saveForm" onSubmit={handleSave}>
                <input id="title" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required></input>
                <button type="submit">Save</button>
            </form>
        </div>

        <div className="status">{status}</div>

        <br />
    </>
}

export default SaveTranscript