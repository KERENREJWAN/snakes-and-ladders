import React, { useState } from 'react';
import Header from './Header';
import Board from './Board';
import Explain from './explain';

function App() {
  const [showExplain, setShowExplain] = useState(true);
  function showGame() {
    setShowExplain(false);
  }

  //disable the start button when the explain screen is shown
  return (
    <div className="App">
      <Explain showExplain={showExplain} showGame={showGame} />
      <Header />
      <Board disableButton={showExplain} />
    </div>
  );
}

export default App;
