export default function BarcodeContainer({ showBarcode, playerId }) {
  return (
    <div id="barcode-container" className={showBarcode ? "show-barcode" : ""}>
      {playerId != null ? (
        <img src={`${import.meta.env.BASE_URL}barcodes/${playerId}.png`} alt="Your barcode" />
      ) : (
        <h2 id="warning">Join a room to get your barcode</h2>
      )}
    </div>
  );
}
