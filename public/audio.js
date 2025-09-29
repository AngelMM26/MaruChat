const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = document.getElementById("mic");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
const interim = document.getElementById("interim-results");

let finalTranscript = "";
let recognizing = false;
let shouldRestart = false;

let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true; // Return results that are not yet final
    recognition.continuous = true; // General continuous listening 

    mic.addEventListener("click", () => {
        if (!recognizing) {
            shouldRestart = true;
            recognition.start();
            mic.textContent = "Pause⏸️";
        }
        else {
            shouldRestart = false;
            recognition.stop();
            mic.textContent = "Start🎙️";
        }

    })

    clearButton.addEventListener("click", () => {
        output.textContent = "";
        interim.textContent = "";
        finalTranscript = "";
    })

    recognition.onresult = (event) => {
        let interimChunk = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i];
            const text = res[0].transcript;
            if (res.isFinal) {
                finalTranscript += text + " ";
            } else {
                interimChunk += text + " ";
            }
        }
        output.textContent = finalTranscript;
        interim.textContent = interimChunk;
    }

    recognition.onstart = () => {
        recognizing = true;
        console.log("Speech Recognition Service has Connected");
    }

    recognition.onend = () => {
        recognizing = false;
        console.log("Speech Recognition Service Disconnected, attempting to reconnect");
        interim.innerHTML = "";
        if (shouldRestart) { // Checks if user explicitly stopped Speech Recognition
            setTimeout(() => { try { recognition.start(); } catch (error) { console.log(error); } }, 250)
        }
    }

}
else {
    console.warn("SpeechRecognition API is not available for this Browser");
}

document.getElementById("saveForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevents the page from refreshing 

    shouldRestart = false;
    if (recognition) {
        recognition.stop();
    }
    mic.textContent = "Start🎙️";

    if (finalTranscript === "") {
        console.warn("Need a transcript");
        return;
    }
    const title = document.getElementById("title").value;

    try {
        const res = await fetch("/api/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, transcript: finalTranscript })
        });

        if (res.ok) {
            const data = await res.json();
            const isSuccess = document.getElementById("status");
            isSuccess.textContent = "Successfully saved '" + title + "'.";
        }

    } catch (err) {
        console.error(err);
    }
});
