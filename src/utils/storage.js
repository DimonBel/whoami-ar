export function getPickedHeroes(heroes) {
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

export function setPlayerIdInPickedHeroes(id) {
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