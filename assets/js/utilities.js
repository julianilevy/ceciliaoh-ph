const createAnchorElement = (text, href, parent) => {
  const a = document.createElement("a");
  const textNode = document.createTextNode(text);
  a.appendChild(textNode);
  a.href = href;
  parent.appendChild(a);

  return a;
};

const createImgElement = (src, alt, parent) => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  parent.appendChild(img);

  return img;
};

const createDivElement = (parent, ...classes) => {
  const div = document.createElement("div");
  div.classList.add(...classes);
  parent.appendChild(div);

  return div;
};

export { createAnchorElement, createImgElement, createDivElement };
