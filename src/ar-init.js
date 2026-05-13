import { heroes } from "./assets.js";

const BASE = import.meta.env.BASE_URL;

AFRAME.registerComponent("markerhandler", {
  init() {
    const marker = this.el;
    marker.addEventListener("markerFound", () => {
      window.dispatchEvent(
        new CustomEvent("arMarkerFound", {
          detail: Number(marker.getAttribute("value")),
        })
      );
    });
  },
});

const scene = document.getElementById("ar-scene");
heroes.forEach((hero, i) => {
  const { rotation, scale, gltfModel, width, height, src } = hero;
  const marker = document.createElement("a-marker");
  marker.setAttribute("type", "barcode");
  marker.setAttribute("markerhandler", "");
  marker.setAttribute("value", i);
  if (src) {
    marker.innerHTML = `<a-image rotation="-90 0 0" width="${width}" height="${height}" src="${BASE}${src}"></a-image>`;
  } else {
    const binScale = scale
      .split(" ")
      .map((n) => String(Number(n) * 2))
      .join(" ");
    marker.innerHTML = `<a-entity rotation="${rotation}" scale="${binScale}" gltf-model="${gltfModel}"></a-entity>`;
  }
  scene.appendChild(marker);
});
