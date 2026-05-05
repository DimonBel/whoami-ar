export const gameState = {
  scanning: false,
  idsInGame: new Set(),
};

if (typeof AFRAME !== 'undefined' && !AFRAME.components['markerhandler']) {
  AFRAME.registerComponent('markerhandler', {
    init: function () {
      const marker = this.el;
      marker.addEventListener('markerFound', function () {
        const markerValue = marker.getAttribute('value');
        gameState.idsInGame.add(+markerValue);
        if (gameState.scanning) {
          window.notie.alert({
            type: 'success',
            text: '<b>Character scanned, scan other players Barcode or Finish scanning</b>',
            time: 5,
            position: 'bottom',
          });
        }
      });
    },
  });
}