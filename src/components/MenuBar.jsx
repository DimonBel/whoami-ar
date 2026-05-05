export default function MenuBar({
  scanning,
  barcodeVisible,
  onCreateGame,
  onJoinGame,
  onToggleBarcode,
}) {
  return (
    <div id="menu">
      <button id="how-to-play" onClick={onCreateGame}>
        <img src="icons/reconnect-icon_how-to-play.svg" />
      </button>
      <button id="create" onClick={onCreateGame}>
        Create Game
      </button>
      <button
        id="join"
        onClick={onJoinGame}
        style={{ color: scanning ? 'red' : 'white' }}
      >
        {scanning ? 'Finish Scanning' : 'Join Game'}
      </button>
      <button id="barcodebtn" onClick={onToggleBarcode}>
        <img
          src={
            barcodeVisible
              ? 'icons/reconnect-icon_camera.svg'
              : 'icons/reconnect-icon_barcode.svg'
          }
        />
      </button>
    </div>
  );
}