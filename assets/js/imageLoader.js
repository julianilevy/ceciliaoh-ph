import { createImgElement } from "./utilities.js";
import zoomImage from "./zoomImage.js";

const loadImages = () => {
  const imgArray = new Array();
  const gallery = document.querySelector(".masonry-gallery");
  const fragment = document.createDocumentFragment();
  const pageName = window.location.pathname
    .replace(/\.[^/.]+$/, "")
    .substring(1);

  for (let i = 0; i < 4; i++) {
    const imgName = `foto (${i + 1})`;
    const imgPath = `assets/img/pages/${pageName}/${imgName}.jpg`;

    imgArray[i] = createImgElement(imgPath, imgName, fragment);
  }

  gallery.appendChild(fragment);

  zoomImage.enable(imgArray);
};

const enable = () => {
  document.addEventListener("DOMContentLoaded", loadImages);
};

export default { enable };
