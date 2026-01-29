import { useEffect, useState } from "react";

function TranscriptList({ }) {
    const [transcripts, setTranscriptList] = useState([]);
    const [status, setStatus] = useState("");
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        loadTranscripts();
    }, [])

    // Fetch transcripts
    const loadTranscripts = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/transcripts");
            if (!res.ok) {
                setLoading(false);
                setStatus("Could not load transcripts.");
                return;
            }

            const data = await res.json();
            setTranscriptList(data);

            if (data.length === 0) {
                setStatus("Start recording and save your first transcript.");
            }
            else {
                setStatus("");
            }

            setLoading(false);

        } catch (err) {
            console.error(err);
            setStatusMessage("Error loading transcripts.");
            setIsLoading(false);
        }
    }

    // Render individual transcript card
    const TranscriptCard = ({ transcript }) => {
        const date = new Date(transcript.date).toLocaleString(); // Reformat date

        return (
            <div className="transcript-card">
                <div className="transcript-header">
                    <div>{transcript.title}</div>
                    <div>{date}</div>
                </div>
                <p>{transcript.transcript}</p>
            </div>
        );
    };

    return <>
        <h3>Transcript List</h3>
        <div className="general-section">
            <button id="refresh" onClick={loadTranscripts}>Refresh</button>

            <div className="status">{status}</div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <div id="transcriptList">
                    {transcripts.map((transcript, index) => (
                        <TranscriptCard key={index} transcript={transcript} />
                    ))}
                </div>
            )}
        </div>
    </>
}

export default TranscriptList