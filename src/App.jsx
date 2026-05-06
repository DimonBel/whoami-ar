import React, { useState } from 'react';
import './App.css';
import Menu from './components/Menu';
import BarcodeView from './components/BarcodeView';
import ARScene from './components/ARScene';
import HowToPlayModal from './components/HowToPlayModal';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [showBarcode, setShowBarcode] = useState(false);
  const { playerId, createGame, joinGame, onMarkerFound } = useGameLogic();

  const handleToggleBarcode = () => {
    setShowBarcode((prev) => !prev);
    const barcodeBtn = document.getElementById('barcodebtn');
    if (barcodeBtn) {
      barcodeBtn.innerHTML = showBarcode
        ? '<img src="icons/reconnect-icon_barcode.svg">'
        : '<img src="icons/reconnect-icon_camera.svg">';
    }
  };

  return (
    <>
      <Menu
        onHowToPlay={() => setShowHowToPlay(true)}
        onCreateGame={createGame}
        onJoinGame={joinGame}
        onToggleBarcode={handleToggleBarcode}
      />
      <BarcodeView playerId={playerId} show={showBarcode} />
      <ARScene onMarkerFound={onMarkerFound} />
      <HowToPlayModal
        show={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
        onShowQRCode={() => {
          window.notie.force({
            type: 'info',
            text: '<h2>Let other players join by scanning the QR code</h2><img id="app-url" src="app-url.png">',
            position: 'bottom',
          });
        }}
        onShowAbout={() => {
          window.notie.force({
            type: 'info',
            text: `
              <p>This app was developed during BEST Hackathon 2021</p>
              <hr/>
              <p><b>Team:</b></p>
              <ul>
                <li><a href="http://strdr4605.github.io" target="_blank">Dragoș Străinu</a></li>
                <li><a href="https://www.behance.net/cazacucostel" target="_blank">Costel Cazacu</a></li>
                <li><a href="https://www.linkedin.com/in/chebac-grigore-378524223/" target="_blank">Grigore Chebac</a></li>
                <li><a href="https://www.instagram.com/kstaty.art/" target="_blank">Nikita Dobrovenco</a></li>
              </ul>
              <iframe
                  src="https://ghbtns.com/github-btn.html?user=strdr4605&repo=whoami-ar&type=star&count=true"
                  frameBorder="0"
                  scrolling="0"
                  width="110"
                  height="20"
                  title="GitHub"
                ></iframe>
            `,
            position: 'bottom',
          });
        }}
      />
    </>
  );
}

export default App;