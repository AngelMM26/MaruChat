const transcriptList = document.getElementById("transcriptList");
const refreshBtn = document.getElementById("refresh");

// Load transcripts when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadTranscripts();
});

// Refresh button listener
refreshBtn.addEventListener("click", () => {
    loadTranscripts();
});

// Fetch and display all transcripts
async function loadTranscripts() {
    try {
        const res = await fetch("/api/transcripts");
        if (!res.ok) {
            isSuccess.textContent = "Could not load transcripts.";
            return
        }

        const transcripts = await res.json();

        if (transcripts.length === 0) {
            isSuccess.textContent = "Start recording and save your first transcript"
            return;
        }

        // Display transcripts
        transcriptList.innerHTML = transcripts.map(transcript => createTranscriptCard(transcript)).join("");
    } catch (err) {
        console.error(err);
    }
}

// Create HTML for a transcript card
function createTranscriptCard(transcript) {
    const date = new Date(transcript.date).toLocaleString();

    return `
        <div class="transcript-card">
            <div class="transcript-header">
                <div>
                    <div class="transcript-title">${transcript.title}</div>
                    <div class="transcript-date">${date}</div>
                </div>
            </div>
            <div class="transcript-text">${transcript.transcript}</div>
        </div>
    `;
}