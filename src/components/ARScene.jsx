import { useEffect, useRef, memo } from 'react';

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