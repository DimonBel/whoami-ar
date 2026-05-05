import { useState, useRef } from 'react';
import MenuBar from './components/MenuBar.jsx';
import BarcodeContainer from './components/BarcodeContainer.jsx';
import ARScene from './components/ARScene.jsx';

export default function App() {
  const [scanning, setScanning] = useState(false);
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const [playerId, setPlayerId] = useState(undefined);

  return (
    <>
      <MenuBar
        scanning={scanning}
        barcodeVisible={barcodeVisible}
        onCreateGame={() => {}}
        onJoinGame={() => {}}
        onToggleBarcode={() => setBarcodeVisible(prev => !prev)}
      />
      <BarcodeContainer visible={barcodeVisible} playerId={playerId} />
      <ARScene />
    </>
  );
}