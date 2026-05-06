import { useState, useCallback } from 'react';
import { heroes } from '../utils/assets';
import { getPickedHeroes, setPlayerIdInPickedHeroes } from '../utils/storage';

export function useGameLogic() {
  const [playerId, setPlayerId] = useState(undefined);
  const [scanning, setScanning] = useState(false);
  const [idsInGame, setIdsInGame] = useState(new Set());

  const createGame = useCallback(async () => {
    if (playerId) {
      const shouldRestart = window.notie.confirm({
        text: "<b>You have a character selected! Are you sure that you want to create a game?</b>",
        position: 'bottom',
      });
      if (!shouldRestart) return;
    }

    const pickedHeroes = getPickedHeroes(heroes);
    const remainingCharacters = heroes
      .map((_, index) => index)
      .filter((id) => !pickedHeroes.includes(id));
    const newPlayerId = remainingCharacters[Math.floor(Math.random() * remainingCharacters.length)];
    setPlayerId(newPlayerId);
    setPlayerIdInPickedHeroes(newPlayerId);

    window.notie.alert({
      type: 'success',
      text: "<b>Character selected, show Barcode for others to join</b>",
      time: 5,
      position: 'bottom',
    });
  }, [playerId]);

  const joinGame = useCallback(async () => {
    setScanning((prev) => !prev);
    if (!scanning) {
      if (playerId) {
        const shouldRestart = window.notie.confirm({
          text: "<b>You have a character selected! Are you sure that you want to start scanning?</b>",
          position: 'bottom',
        });
        if (!shouldRestart) {
          setScanning(false);
          return;
        }
      }

      setPlayerId(undefined);
      window.notie.alert({
        type: 'info',
        text: "<b>Scan other players Barcodes, then press 'Finish Scanning' button</b>",
        stay: true,
        position: 'bottom',
      });
    } else {
      if (idsInGame.size === 0) {
        window.notie.alert({
          type: 'error',
          text: "<b>No Barcodes scanned, try scanning other players Barcodes, or create a game.</b>",
          time: 5,
          position: 'bottom',
        });
        setScanning(true);
        return;
      }
      const pickedHeroes = getPickedHeroes(heroes);
      const remainingCharacters = heroes
        .map((_, index) => index)
        .filter((id) => !idsInGame.has(id) || !pickedHeroes.includes(id));
      const newPlayerId = remainingCharacters[Math.floor(Math.random() * remainingCharacters.length)];
      setPlayerId(newPlayerId);
      setPlayerIdInPickedHeroes(newPlayerId);

      window.notie.alert({
        type: 'success',
        text: "<b>Character selected, show your Barcode to other players</b>",
        position: 'bottom',
      });
    }
  }, [scanning, playerId, idsInGame]);

  const onMarkerFound = useCallback((markerValue) => {
    setIdsInGame((prev) => {
      const newSet = new Set(prev);
      newSet.add(markerValue);
      if (scanning) {
        window.notie.alert({
          type: 'success',
          text: "<b>Character scanned, scan other players Barcode or Finish scanning</b>",
          time: 5,
          position: 'bottom',
        });
      }
      return newSet;
    });
  }, [scanning]);

  return {
    playerId,
    scanning,
    createGame,
    joinGame,
    onMarkerFound,
  };
}