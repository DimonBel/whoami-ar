import React from 'react';

function Menu({ onHowToPlay, onCreateGame, onJoinGame, onToggleBarcode, scanning, showBarcode }) {
  return (
    <div id="menu">
      <button id="how-to-play" onClick={onHowToPlay}>
        <img src="icons/reconnect-icon_how-to-play.svg" alt="How to play" />
      </button>
      <button id="create" onClick={onCreateGame}>Create Game</button>
      <button
        id="join"
        onClick={onJoinGame}
        style={{ color: scanning ? 'red' : 'white' }}
      >
        {scanning ? 'Finish Scanning' : 'Join Game'}
      </button>
      <button id="barcodebtn" onClick={onToggleBarcode}>
        <img src={showBarcode ? "icons/reconnect-icon_camera.svg" : "icons/reconnect-icon_barcode.svg"} alt="Barcode" />
      </button>
    </div>
  );
}

export default Menu;