const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = document.getElementById("mic");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");
const interim = document.getElementById("interim-results");

let finalTranscript = "";
let recognizing = false;
let shouldRestart = false;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
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
                finalTranscript += text;
            } else {
                interimChunk += text;
            }
        }
        output.textContent = finalTranscript;
        interim.textContent = interimChunk;
        console.log(finalTranscript);

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
    console.log("SpeechRecognition API is not available for this Browser");
}
