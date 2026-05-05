import { useState, useRef } from 'react';
import { heroes } from './assets.js';
import { gameState } from './aframe-setup.js';
import MenuBar from './components/MenuBar.jsx';
import BarcodeContainer from './components/BarcodeContainer.jsx';
import ARScene from './components/ARScene.jsx';

const LOCAL_STORAGE_KEY = 'pickedHeroes';
const PICKED_HEROES_TTL_IN_MS = 300000;

function getPickedHeroes() {
  const pickedHeroes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  if (!pickedHeroes) {
    return [];
  }
  if (
    pickedHeroes.expireAt < Date.now() ||
    pickedHeroes.ids.length === heroes.length
  ) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return [];
  }
  return pickedHeroes.ids;
}

function setPlayerIdInPickedHeroes(id) {
  const pickedHeroes = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  if (!pickedHeroes) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({
        expireAt: Date.now() + PICKED_HEROES_TTL_IN_MS,
        ids: [id],
      })
    );
  } else {
    pickedHeroes.ids = [...pickedHeroes.ids, id];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pickedHeroes));
  }
}

function promiseNotieConfirm(options) {
  return new Promise((resolve, reject) => {
    window.notie.confirm(options, resolve, reject);
  })
    .then(() => true)
    .catch(() => false);
}

export default function App() {
  const [scanning, setScanning] = useState(false);
  const [barcodeVisible, setBarcodeVisible] = useState(false);
  const [playerId, setPlayerId] = useState(undefined);
  const showHowToPlayRef = useRef(true);

  function setScanningWithSync(value) {
    gameState.scanning = value;
    setScanning(value);
  }

  async function createGame() {
    if (playerId !== undefined) {
      const shouldRestart = await promiseNotieConfirm({
        text: '<b>You have a character selected! Are you sure that you want to create a game?</b>',
        position: 'bottom',
      });
      if (!shouldRestart) {
        return;
      }
    }

    const pickedHeroes = getPickedHeroes();
    const remainingCharacters = heroes
      .map((_, index) => index)
      .filter((id) => !pickedHeroes.includes(id));
    const newPlayerId =
      remainingCharacters[Math.floor(Math.random() * remainingCharacters.length)];
    setPlayerId(newPlayerId);
    setPlayerIdInPickedHeroes(newPlayerId);

    window.notie.alert({
      type: 'success',
      text: '<b>Character selected, show Barcode for others to join</b>',
      time: 5,
      position: 'bottom',
    });

    setScanningWithSync(false);
    setBarcodeVisible(false);
  }

  async function joinGame() {
    if (!scanning) {
      if (playerId !== undefined) {
        const shouldRestart = await promiseNotieConfirm({
          text: '<b>You have a character selected! Are you sure that you want to start scanning?</b>',
          position: 'bottom',
        });
        if (!shouldRestart) {
          return;
        }
      }

      setPlayerId(undefined);
      setScanningWithSync(true);
      gameState.idsInGame.clear();
      setBarcodeVisible(false);
      window.notie.alert({
        type: 'info',
        text: "<b>Scan other players Barcodes, then press 'Finish Scanning' button</b>",
        stay: true,
        position: 'bottom',
      });
    } else {
      if (gameState.idsInGame.size === 0) {
        window.notie.alert({
          type: 'error',
          text: '<b>No Barcodes scanned, try scanning other players Barcodes, or create a game.</b>',
          time: 5,
          position: 'bottom',
        });
        return;
      }

      setScanningWithSync(false);
      const pickedHeroes = getPickedHeroes();
      const remainingCharacters = heroes
        .map((_, index) => index)
        .filter((id) => !gameState.idsInGame.has(id) || !pickedHeroes.includes(id));
      const newPlayerId =
        remainingCharacters[Math.floor(Math.random() * remainingCharacters.length)];
      setPlayerId(newPlayerId);
      setPlayerIdInPickedHeroes(newPlayerId);

      window.notie.alert({
        type: 'success',
        text: '<b>Character selected, show your Barcode to other players</b>',
        position: 'bottom',
      });
    }
  }

  function howToPlay() {
    if (!showHowToPlayRef.current) {
      return;
    }
    showHowToPlayRef.current = false;
    window.notie.select(
      {
        text: `
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
      `,
        cancelText: 'Close',
        position: 'bottom',
        choices: [
          {
            type: 'success',
            text: 'Show game QR code',
            handler: () => {
              showHowToPlayRef.current = true;
              showGameQRCode();
            },
          },
          {
            type: 'neutral',
            text: 'About',
            handler: () => {
              showHowToPlayRef.current = true;
              showAbout();
            },
          },
        ],
      },
      () => {
        showHowToPlayRef.current = true;
      }
    );
  }

  function showGameQRCode() {
    window.notie.force({
      type: 'info',
      text: `
        <h2>Let other players join by scanning the QR code</h2>
        <img id="app-url" src="app-url.png">
      `,
      position: 'bottom',
    });
  }

  function showAbout() {
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
  }

  function toggleBarcode() {
    setBarcodeVisible((prev) => !prev);
  }

  return (
    <>
      <MenuBar
        scanning={scanning}
        barcodeVisible={barcodeVisible}
        onHowToPlay={howToPlay}
        onCreateGame={createGame}
        onJoinGame={joinGame}
        onToggleBarcode={toggleBarcode}
      />
      <BarcodeContainer visible={barcodeVisible} playerId={playerId} />
      <ARScene />
    </>
  );
}