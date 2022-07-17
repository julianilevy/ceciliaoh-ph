import { createAnchorElement } from "./utilities.js";

const burguerButton = document.querySelector(".burguer-button");
const nav = document.querySelector(".mobile-nav");
const main = document.querySelector("main");
const footer = document.querySelector("footer");

let isNavEnabled = false;
let isNavAnimating = false;
let navTrabajo;
let navTrabajoInitialBottom;
let navContacto;
let navContactoInitialBottom;
let navInstagramImg;
let navInstagramImgInitialBottom;

const createNavElements = () => {
  const div = document.createElement("div");

  navTrabajo = createAnchorElement("Trabajo", "/", div);
  navTrabajo.classList.add("nav-link", "nav-link-1");
  navContacto = createAnchorElement("Contacto", "/contact.html", div);
  navContacto.classList.add("nav-link", "nav-link-2");

  const selectedUnderline = document.createElement("span");
  selectedUnderline.classList.add("nav-link-selected-underline");

  switch (window.location.pathname) {
    case "/":
      selectedUnderline.classList.add("nav-link-1-selected-underline");
      navTrabajo.onclick = () => {
        return false;
      };
      navTrabajo.appendChild(selectedUnderline);
      break;
    case "/contact.html":
      selectedUnderline.classList.add("nav-link-2-selected-underline");
      navContacto.onclick = () => {
        return false;
      };
      navContacto.appendChild(selectedUnderline);
      break;
    default:
      break;
  }

  const instagram = createAnchorElement(
    "",
    "https://www.instagram.com/ceciliaoh.ph/",
    div
  );
  instagram.target = "_blank";
  navInstagramImg = document.createElement("img");
  navInstagramImg.src = "assets/img/social/instagram.svg";
  navInstagramImg.alt = "Instagram";
  instagram.appendChild(navInstagramImg);

  nav.appendChild(div);
};

const enableNav = () => {
  isNavEnabled = true;
  isNavAnimating = true;

  burguerButton.classList.add("bar-change");
  main.classList.add("faded-out");
  footer.classList.add("faded-out");

  createNavElements();
  setTimeout(() => {
    nav.classList.remove("faded-out");
    nav.classList.add("faded-in");

    navTrabajoInitialBottom = navTrabajo.style.bottom;
    navTrabajo.style.bottom = "50%";
    navContactoInitialBottom = navContacto.style.bottom;
    navContacto.style.bottom = "40%";
    navInstagramImgInitialBottom = navInstagramImg.style.bottom;
    navInstagramImg.style.bottom = "7%";
  }, 100);

  const onNavTransitionEnd = () => {
    nav.removeEventListener("transitionend", onNavTransitionEnd);

    main.classList.add("hidden");
    footer.classList.add("hidden");

    isNavAnimating = false;
  };

  nav.addEventListener("transitionend", onNavTransitionEnd);
};

const disableNav = () => {
  isNavEnabled = false;
  isNavAnimating = true;

  burguerButton.classList.remove("bar-change");
  main.classList.remove("hidden");
  footer.classList.remove("hidden");

  navTrabajo.style.bottom = navTrabajoInitialBottom;
  navContacto.style.bottom = navContactoInitialBottom;
  navInstagramImg.style.bottom = navInstagramImgInitialBottom;

  setTimeout(() => {
    nav.classList.remove("faded-in");
    nav.classList.add("faded-out");

    main.classList.remove("faded-out");
    footer.classList.remove("faded-out");
  }, 100);

  const onNavTransitionEnd = () => {
    nav.removeEventListener("transitionend", onNavTransitionEnd);
    nav.removeChild(nav.lastChild);

    isNavAnimating = false;
  };

  nav.addEventListener("transitionend", onNavTransitionEnd);
};

const onBurguerButtonClick = () => {
  if (!isNavAnimating) {
    if (!isNavEnabled) {
      enableNav();
    } else disableNav();
  }
};

const enable = () => {
  burguerButton.addEventListener("click", onBurguerButtonClick);
};

export default { enable };
