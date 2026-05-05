import { useEffect, useRef, memo } from 'react';
import { heroes } from '../assets.js';
import '../aframe-setup.js';

const ARScene = memo(function ARScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const scene = document.createElement('a-scene');
    scene.setAttribute('embedded', '');
    scene.setAttribute(
      'arjs',
      'sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;'
    );
    scene.setAttribute('vr-mode-ui', 'enabled: false');
    scene.setAttribute('renderer', 'antialias: true; alpha: true');

    const hiroMarker = document.createElement('a-marker');
    hiroMarker.setAttribute('preset', 'hiro');
    const trex = document.createElement('a-entity');
    trex.setAttribute('position', '0 -1 0');
    trex.setAttribute('scale', '0.05 0.05 0.05');
    trex.setAttribute('gltf-model', 'trex/scene.gltf');
    hiroMarker.appendChild(trex);
    scene.appendChild(hiroMarker);

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

    const camera = document.createElement('a-entity');
    camera.setAttribute('camera', '');
    scene.appendChild(camera);

    container.appendChild(scene);

    return () => {
      container.removeChild(scene);
    };
  }, []);

  return <div ref={containerRef} />;
});

export default ARScene;