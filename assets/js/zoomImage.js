import { createImgElement, createDivElement } from "./utilities.js";
import { addListener, removeListener } from "./eventHandler.js";

const body = document.querySelector("body");
const main = document.querySelector("main");
let isMobileDevice;
let div;
let closeButton;
let imageArray;
let imageContainer;
let desktopRightControl;
let desktopLeftControl;

let isImageZoomed = false;
let currImage = null;
let currImageIndexInArray = 0;
let isImageBeingGrabbed = false;
let xPosAtImageGrab = 0;

const createZoomedImage = (img) => {
  const newImage = createImgElement(img.src, img.alt, imageContainer);
  newImage.draggable = false;
  newImage.id = "currentZoomedImage";
  newImage.classList.add("zoomed-image");
  if (isMobileDevice) {
    addListener(newImage, "touchstart", "newImageTouchStart", (e) =>
      onTouchStart(e)
    );
  } else {
    addListener(newImage, "mousedown", "newImageMouseDown", (e) =>
      onImageMouseDown(e)
    );
  }

  return newImage;
};

const moveToNextImage = (direction) => {
  const currImageRect = currImage.getBoundingClientRect();
  currImage.style.position = "fixed";
  currImage.style.height = currImageRect.height + "px";
  currImage.style.width = currImageRect.width + "px";
  currImage.style.top = currImageRect.top + "px";
  currImage.style.left = currImageRect.left + "px";
  currImage.classList.remove(
    "zoomed-image-is-centered-from-right",
    "zoomed-image-is-centered-from-left"
  );
  body.appendChild(currImage);

  setTimeout(() => {
    const imageToRemove = currImage;
    imageToRemove.style.opacity = 0;
    imageToRemove.style.pointerEvents = "none";
    imageToRemove.removeAttribute("id");
    if (isMobileDevice)
      removeListener(imageToRemove, "touchstart", "newImageTouchStart");
    else removeListener(imageToRemove, "mousedown", "newImageMouseDown");
    addListener(
      imageToRemove,
      "transitionend",
      "imageToRemoveTransitionEnd",
      () => {
        removeListener(
          imageToRemove,
          "transitionend",
          "imageToRemoveTransitionEnd"
        );
        imageToRemove.remove();
      }
    );

    if (direction === "right") {
      currImageIndexInArray++;
      if (currImageIndexInArray >= imageArray.length) currImageIndexInArray = 0;
      currImage = createZoomedImage(imageArray[currImageIndexInArray]);
      currImage.classList.add(
        "zoomed-image-will-move-from-right",
        "zoomed-image-is-right"
      );

      setTimeout(() => {
        currImage.classList.remove("zoomed-image-is-right");
        currImage.classList.add("zoomed-image-is-centered-from-right");
        isImageBeingGrabbed = false;
      }, 10);
    } else if (direction === "left") {
      currImageIndexInArray--;
      if (currImageIndexInArray < 0)
        currImageIndexInArray = imageArray.length - 1;
      currImage = createZoomedImage(imageArray[currImageIndexInArray]);
      currImage.classList.add(
        "zoomed-image-will-move-from-left",
        "zoomed-image-is-left"
      );

      setTimeout(() => {
        currImage.classList.remove("zoomed-image-is-left");
        currImage.classList.add("zoomed-image-is-centered-from-left");
        isImageBeingGrabbed = false;
      }, 10);
    }
  }, 10);
};

function onTouchStart(e) {
  isImageBeingGrabbed = true;
  xPosAtImageGrab = e.touches[0].clientX;
}

function onTouchEnd(e) {
  if (isImageBeingGrabbed) {
    if (e.target.id === "currentZoomedImage") {
      if (xPosAtImageGrab - 70 > e.changedTouches[0].clientX) {
        moveToNextImage("right");
      } else if (xPosAtImageGrab + 70 < e.changedTouches[0].clientX) {
        moveToNextImage("left");
      }
    } else {
      isImageBeingGrabbed = false;
    }
  }
}

function onImageMouseDown(e) {
  isImageBeingGrabbed = true;
  xPosAtImageGrab = e.clientX;
}

function onMouseUp(e) {
  if (isImageBeingGrabbed) {
    if (e.target.id === "currentZoomedImage") {
      if (xPosAtImageGrab - 70 > e.clientX) {
        moveToNextImage("right");
      } else if (xPosAtImageGrab + 70 < e.clientX) {
        moveToNextImage("left");
      }
    } else {
      isImageBeingGrabbed = false;
    }
  }
}

const removeZoom = () => {
  if (isImageZoomed) {
    body.style.overflow = "initial";
    isImageZoomed = false;
    if (isMobileDevice) {
      removeListener(currImage, "touchstart", "newImageTouchStart");
      removeListener(document, "touchend", "documentTouchEnd");
    } else {
      removeListener(closeButton, "click", "closeButtonClick");
      removeListener(
        desktopRightControl,
        "mouseup",
        "desktopRightControlMouseUp"
      );
      removeListener(
        desktopLeftControl,
        "mouseup",
        "desktopLeftControlMouseUp"
      );
      removeListener(currImage, "mousedown", "newImageMouseDown");
      removeListener(document, "mouseup", "documentMouseUp");
    }
    div.remove();
  }
};

const createDesktopElements = (imageContainer) => {
  const controlsContainer = createDivElement(
    imageContainer,
    "zoomed-image-desktop-control-container"
  );
  desktopRightControl = createDivElement(
    controlsContainer,
    "zoomed-image-desktop-right-control"
  );
  desktopLeftControl = createDivElement(
    controlsContainer,
    "zoomed-image-desktop-left-control"
  );
  createImgElement(
    "assets/img/utilities/chevron-right.svg",
    "Right Caret",
    desktopRightControl
  );
  createImgElement(
    "assets/img/utilities/chevron-left.svg",
    "Left Caret",
    desktopLeftControl
  );
  addListener(
    desktopRightControl,
    "mouseup",
    "desktopRightControlMouseUp",
    () => moveToNextImage("right")
  );
  addListener(desktopLeftControl, "mouseup", "desktopLeftControlMouseUp", () =>
    moveToNextImage("left")
  );
};

const zoomImage = (img, i) => {
  if (!isImageZoomed) {
    isImageZoomed = true;
    div = createDivElement(main, "can-fade", "faded-out");
    const background = createDivElement(div, "zoomed-image-background");
    const header = createDivElement(background, "zoomed-image-header");
    closeButton = createImgElement(
      "assets/img/utilities/cross.svg",
      "Close Button",
      header
    );
    addListener(closeButton, "click", "closeButtonClick", removeZoom);
    imageContainer = createDivElement(background, "zoomed-image-container");
    currImage = createZoomedImage(img);
    currImage.classList.add(
      "zoomed-image-will-move-from-right",
      "zoomed-image-is-right"
    );
    currImageIndexInArray = i;
    if (isMobileDevice)
      addListener(document, "touchend", "documentTouchEnd", (e) =>
        onTouchEnd(e)
      );
    else {
      createDesktopElements(imageContainer);
      addListener(document, "mouseup", "documentMouseUp", (e) => onMouseUp(e));
    }
    main.appendChild(div);

    setTimeout(() => {
      body.style.overflow = "hidden";
      div.classList.remove("faded-out");
      div.classList.add("faded-in");
      currImage.classList.remove("zoomed-image-is-right");
    }, 10);
  }
};

const enable = (imgArray) => {
  isMobileDevice = window.matchMedia("(pointer:coarse)").matches;
  imageArray = imgArray;
  for (let i = 0; i < imageArray.length; i++) {
    imageArray[i].addEventListener("click", (e) => zoomImage(e.target, i));
  }
  document.addEventListener("keyup", (e) => {
    if (e.key === "Escape") removeZoom();
  });
};

export default { enable };
