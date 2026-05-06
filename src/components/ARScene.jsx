import React, { useEffect, useRef } from 'react';
import { heroes } from '../utils/assets';

function ARScene({ onMarkerFound }) {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const markers = heroes.map((hero, i) => {
      const { rotation, scale, gltfModel, width, height, src } = hero;
      const marker = document.createElement('a-marker');
      marker.setAttribute('type', 'barcode');
      marker.setAttribute('markerhandler', true);
      marker.setAttribute('value', i);
      if (src) {
        marker.innerHTML = `<a-image rotation="-90 0 0" width="${width}" height="${height}" src="${src}"></a-image>`;
      } else {
        const binScale = scale
          .split(' ')
          .map((n) => n * 2)
          .join(' ');
        marker.innerHTML = `<a-entity rotation="${rotation}" scale="${binScale}" gltf-model="${gltfModel}"></a-entity>`;
      }
      return marker;
    });
    scene.prepend(...markers);

    window.AFRAME.registerComponent('markerhandler', {
      init: function () {
        const marker = this.el;
        marker.addEventListener('markerFound', function () {
          const markerValue = marker.getAttribute('value');
          onMarkerFound(+markerValue);
        });
      },
    });
  }, [onMarkerFound]);

  return (
    <a-scene
      ref={sceneRef}
      embedded
      arjs='sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;'
    >
      <a-marker preset="hiro">
        <a-entity position="0 -1 0" scale="0.05 0.05 0.05" gltf-model="trex/scene.gltf"></a-entity>
      </a-marker>
      <a-entity camera></a-entity>
    </a-scene>
  );
}

export default ARScene;