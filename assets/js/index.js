import navMenu from "./navMenu.js";
import imageLoader from "./imageLoader.js";

navMenu.enable();
if (
  window.location.pathname !== "/" &&
  window.location.pathname !== "/contact.html"
)
  imageLoader.enable();
