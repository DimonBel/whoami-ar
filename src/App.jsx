import { useState, useRef, useCallback } from "react";
import notie from "notie";
import { heroes } from "./assets.js";
import { useAuth } from "./AuthContext.jsx";
import { leaveRoom } from "./api.js";
import Menu from "./components/Menu.jsx";
import BarcodeContainer from "./components/BarcodeContainer.jsx";
import ARScene from "./components/ARScene.jsx";
import AuthScreen from "./components/AuthScreen.jsx";
import RoomBrowser from "./components/RoomBrowser.jsx";

function promiseNotieConfirm(options) {
  return new Promise((resolve, reject) => {
    notie.confirm(options, resolve, reject);
  })
    .then(() => true)
    .catch(() => false);
}

export default function App() {
  const { user } = useAuth();
  const [playerId, setPlayerId] = useState(undefined);
  const [scanning, setScanning] = useState(false);
  const [showBarcode, setShowBarcode] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const idsInGame = useRef(new Set());
  const showHowToPlayRef = useRef(true);

  function showAbout() {
    notie.force({
      type: "info",
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
      `,
      position: "bottom",
    });
  }

  function howToPlay() {
    if (!showHowToPlayRef.current) return;
    showHowToPlayRef.current = false;
    notie.select(
      {
        text: `
          <h2>WHO AM I</h2>
          <h3>Augmented Reality edition</h3>
          <p>This is a multiplayer game.</p>
          <p>
            Join a room, then show the Barcode to other players.
          </p>
          <h4>
            After all players have shown Barcodes, you can start asking
            <i>YES</i> or <i>NO</i> questions.
          </h4>
          <p>If answer to your question about the character is <b>YES</b> you can ask again.</p>
          <p>If answer is <b>NO</b> then next player asks questions.</p>
        `,
        cancelText: "Close",
        position: "bottom",
        choices: [
          {
            type: "neutral",
            text: "About",
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

  async function handleEnterRoom(roomId, heroIndex) {
    setCurrentRoomId(roomId);
    setPlayerId(heroIndex);
    setScanning(false);
    setShowBarcode(false);

    notie.alert({
      type: "success",
      text: `<b>Character selected, show Barcode for others to join</b>`,
      time: 5,
      position: "bottom",
    });
  }

  async function handleLeaveRoom() {
    if (currentRoomId) {
      try {
        await leaveRoom(currentRoomId);
      } catch (e) {}
    }
    setCurrentRoomId(null);
    setPlayerId(undefined);
    setScanning(false);
    setShowBarcode(false);
  }

  function joinGame() {
    const nowScanning = !scanning;

    if (nowScanning) {
      setScanning(true);
      setShowBarcode(false);
      idsInGame.current.clear();

      notie.alert({
        type: "info",
        text: "<b>Scan other players Barcodes, then press 'Finish Scanning' button</b>",
        stay: true,
        position: "bottom",
      });
    } else {
      if (idsInGame.current.size === 0) {
        notie.alert({
          type: "error",
          text: "<b>No Barcodes scanned, try scanning other players Barcodes.</b>",
          time: 5,
          position: "bottom",
        });
        return;
      }

      setScanning(false);
      notie.alert({
        type: "success",
        text: "<b>Scanning complete, show your Barcode to other players</b>",
        position: "bottom",
      });
    }
  }

  function toggleBarcode() {
    setShowBarcode((prev) => !prev);
  }

  const handleMarkerFound = useCallback(
    (markerValue) => {
      idsInGame.current.add(markerValue);
      if (scanning) {
        notie.alert({
          type: "success",
          text: "<b>Character scanned, scan other players Barcode or Finish scanning</b>",
          time: 5,
          position: "bottom",
        });
      }
    },
    [scanning]
  );

  if (!user) {
    return <AuthScreen />;
  }

  if (!currentRoomId) {
    return <RoomBrowser onEnterRoom={handleEnterRoom} />;
  }

  return (
    <>
      <Menu
        onHowToPlay={howToPlay}
        onCreateGame={null}
        onJoinGame={joinGame}
        onToggleBarcode={toggleBarcode}
        scanning={scanning}
        showBarcode={showBarcode}
        inRoom={true}
      />
      <button className="game-back-btn" onClick={handleLeaveRoom}>
        Leave Room
      </button>
      <BarcodeContainer showBarcode={showBarcode} playerId={playerId} />
      <ARScene onMarkerFound={handleMarkerFound} />
    </>
  );
}
