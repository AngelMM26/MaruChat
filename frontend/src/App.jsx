import { useState } from 'react'
import './App.css'
import './components/RecordingSection'
import RecordingSection from './components/RecordingSection'
import SaveTranscript from './components/SaveTranscript'
import TranscriptList from './components/TranscriptList'


function App() {
  const [transcript, setTranscript] = useState("");

  return (
    <>
      <h1>MaruChat</h1>

      <RecordingSection transcript={transcript} setTranscript={setTranscript} />

      <SaveTranscript transcript={transcript} />

      <TranscriptList />

    </>
  )
}

export default App
