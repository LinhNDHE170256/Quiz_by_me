import React, { useState } from 'react';
import Home from './components/Home.js';
import Quiz from './components/Quiz';

function App() {
  const [session, setSession] = useState(false);

  return (
    <div className="App">
      {session ? <Quiz endSession={() => setSession(false)} /> : <Home startSession={() => setSession(true)} />}
    </div>
  );
}

export default App;
