import React from 'react';

function Menu({ onHowToPlay, onCreateGame, onJoinGame, onToggleBarcode }) {
  return (
    <div id="menu">
      <button id="how-to-play" onClick={onHowToPlay}>
        <img src="icons/reconnect-icon_how-to-play.svg" alt="How to play" />
      </button>
      <button id="create" onClick={onCreateGame}>Create Game</button>
      <button id="join" onClick={onJoinGame}>Join Game</button>
      <button id="barcodebtn" onClick={onToggleBarcode}>
        <img src="icons/reconnect-icon_barcode.svg" alt="Barcode" />
      </button>
    </div>
  );
}

export default Menu;