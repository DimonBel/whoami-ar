export default function BarcodeContainer({ showBarcode, playerId }) {
  return (
    <div id="barcode-container" className={showBarcode ? "show-barcode" : ""}>
      {playerId !== undefined ? (
        <img src={`${import.meta.env.BASE_URL}barcodes/${playerId}.png`} alt="Your barcode" />
      ) : (
        <h2 id="warning">Create or join a game</h2>
      )}
    </div>
  );
}
