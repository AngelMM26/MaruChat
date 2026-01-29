import { useEffect } from 'react'
import { useState } from 'react'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true; // Return results that are not yet final
    recognition.continuous = true; // General continuous listening 
}
else {
    console.warn("SpeechRecognition is not available for this Browser: Try Google Chrome or Microsoft Edge");
}

function RecordingSection({ transcript, setTranscript }) {
    const [interimResults, setInterimResult] = useState("");

    const [isRecording, setRecording] = useState(false);
    const [shouldRestart, setRestart] = useState(false); // Used for safe restarts


    const handleMic = () => { // Starts/stops Speech Recognition 
        if (!isRecording) {
            setRestart(true);
            recognition.start();
        }
        else {
            setRestart(false);
            recognition.stop();
        }
    }

    const handleClear = () => {
        setTranscript("");
        setInterimResult("");
    }

    useEffect(() => {
        if (!SpeechRecognition) return;

        /*
        Update transcript interim results when speech is being recognized 
        and processed by Speech Recognition
        */
        recognition.onresult = (event) => {
            let interimChunk = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const res = event.results[i];
                const text = res[0].transcript;
                if (res.isFinal) {
                    setTranscript(prev => prev + text + " ");
                } else {
                    interimChunk += text + " ";
                }
            }
            setInterimResult(interimChunk);
        }

        // Start Speech Recognition
        recognition.onstart = () => {
            setRecording(true);
            console.log("Speech Recognition Service has Connected");
        }

        // End Speech Recognition
        recognition.onend = () => {
            setRecording(false);
            console.log("Speech Recognition Service Disconnected, attempting to reconnect...")
            setInterimResult("");
            if (shouldRestart) { // Checks if user explicitly stopped Speech Recognition
                setTimeout(() => { try { recognition.start(); } catch (error) { console.log(error); } }, 250)
            }
        }

    }, [shouldRestart])

    return <>
        <h3>Start Recording</h3>
        <div className="general-section">
            <div id="output">{transcript}</div> <br />
            <div className="speech-display" id="interim-results">{interimResults}</div> <br />
            <button id="mic" name="mic" onClick={handleMic}>{isRecording ? "⏸️" : "🎙️"}</button>
            <button id="clear" onClick={handleClear}>Clear</button>
        </div>

        <br />
    </>
}

export default RecordingSection