# MaruChat 🗣️

**MaruChat** is a browser-based voice transcription application that captures and transcribes speech in real time using the Web Speech API, then stores transcripts for later retrieval. The frontend is built with React, while the backend uses Node.js and Express, with transcript data persisted in MongoDB via Mongoose.

---

## 📁 Project Structure

```
MaruChat/
│
├── backend/
|   ├── app.js      # Express app startpoint and API endpoints
|   
|
├── frontend/
|   ├── src/
|   |   ├── components/
|   |   ├── RecordingSection.jsx    # Handles Speech recogntion and logic
|   |   ├── SaveTranscripts.jsx     # Saves Transcript
|   |   ├── TranscriptList.jsx      # Dashboard display and logic
|   |
|   ├── App.css     # Styling Sheet
|   ├── App.jsx     # Main application component
|   ├── main.jsx    # Bootstarps React
|   ├── index.html  # Root HTML entry point
|   ├── vite.config.js      # Build and development configuration
|                
└── README.md       # Project documentation
```

---

## 💡 Features

- Live Transcription - Uses the Web Speech API to transcribe speech in real time
- Safe Restarts - Handle start/stop wihtout losing data
- Save Transcripts - Store transcripts in MongoDB database via Node.js/Express API endpoints

---

## 📌 Future Enhancements

- Delete transcripts
- Collapsed preview for long transcripts 
- Integrate OpenAI Whisper for higher speech to text accuracy

---

## 🧑‍💻 Author

Angel Mejia Martinez  
Computer Science Major, NYU  
[LinkedIn](https://www.linkedin.com/in/angel-mejia-martinez-3b0a09252/) · [GitHub](https://github.com/AngelMM26)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).