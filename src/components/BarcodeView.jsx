import React from 'react';

function BarcodeView({ playerId, show }) {
  return (
    <div id="barcode-container" className={show ? 'show-barcode' : ''}>
      <img
        id="barcode-img"
        src={playerId !== undefined ? `barcodes/${playerId}.png` : ''}
        alt="If barcode is not loaded, recreate or rejoin a game"
        style={{ display: playerId !== undefined ? 'block' : 'none' }}
      />
      <h2 id="warning" style={{ display: playerId !== undefined ? 'none' : 'block' }}>
        Create or join a game
      </h2>
    </div>
  );
}

export default BarcodeView;