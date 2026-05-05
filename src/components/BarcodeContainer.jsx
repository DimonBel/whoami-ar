export default function BarcodeContainer({ visible, playerId }) {
  return (
    <div id="barcode-container" className={visible ? 'show-barcode' : ''}>
      {playerId !== undefined ? (
        <img
          id="barcode-img"
          src={`barcodes/${playerId}.png`}
          alt="If barcode is not loaded, recreate or rejoin a game"
        />
      ) : (
        <h2 id="warning">Create or join a game</h2>
      )}
    </div>
  );
}