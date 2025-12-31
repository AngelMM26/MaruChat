const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = document.getElementById("mic");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
const interim = document.getElementById("interim-results");
const isSuccess = document.getElementById("status");

let finalTranscript = "";
let recognizing = false;
let shouldRestart = false; // Used for safe restarts

let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true; // Return results that are not yet final
    recognition.continuous = true; // General continuous listening 

    /*
    Starts/stops Speech Recognition based on user interaction
    */
    mic.addEventListener("click", () => {
        if (!recognizing) {
            shouldRestart = true;
            recognition.start();
            mic.textContent = "⏸️";
        }
        else {
            shouldRestart = false;
            recognition.stop();
            mic.textContent = "🎙️";
        }

    })

    /*
    Clears transcript on page and text saved to final transcript
    */
    clearButton.addEventListener("click", () => {
        output.textContent = "";
        interim.textContent = "";
        finalTranscript = "";
    })

    /*
    Update final transcript and interim chunks when speech is being recognized 
    and processed by Speech Recognition
    */
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

    /*
    Start Speech Recognition
    */
    recognition.onstart = () => {
        recognizing = true;
        console.log("Speech Recognition Service has Connected");
    }

    /*
    End Speech Recogintion
    */
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
    isSuccess.textContent = "SpeechRecognition is not available for this Browser: Try Google Chrome or Microsoft Edge"
    console.warn("SpeechRecognition is not available for this Browser: Try Google Chrome or Microsoft Edge");
}

document.getElementById("saveForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevents the page from refreshing 

    shouldRestart = false;
    if (recognition) {
        recognition.stop();
    }
    mic.textContent = "Start🎙️";

    if (finalTranscript === "") {
        isSuccess.textContent = "Need a transcript"
        console.warn("Need a transcript");
        return;
    }
    const title = document.getElementById("title").value;

    try {
        // POST request to save transcript
        const res = await fetch("/api/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, transcript: finalTranscript })
        });

        if (res.ok) {
            isSuccess.textContent = "Successfully saved '" + title + "'.";
        } else {
            isSuccess.textContent = "Could not save '" + title + "'.";
        }

    } catch (err) {
        console.error(err);
    }
});
