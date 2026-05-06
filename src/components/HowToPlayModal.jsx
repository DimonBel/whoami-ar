import React from 'react';

function HowToPlayModal({ show, onClose, onShowQRCode, onShowAbout }) {
  if (!show) return null;

  return (
    <div className="notie-textbox-inner">
      <h2>WHO AM I</h2>
      <h3>Augmented Reality edition</h3>
      <p>This is a multiplayer game.</p>
      <p>
        You can create or join a game.
        After your character was randomly selected you can show the Barcode to other players.
      </p>
      <h4>
        After all player have generated Barcodes, you can start asking
        <i>YES</i> or <i>NO</i> questions.
      </h4>
      <p>If answer to your question about the character is <b>YES</b> you can ask again.</p>
      <p>If answer is <b>NO</b> then next player asks questions.</p>
      <button onClick={onShowQRCode}>Show game QR code</button>
      <button onClick={onShowAbout}>About</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default HowToPlayModal;