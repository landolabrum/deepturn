export function isTextOverflowing(element: any) {
  const textWidth: any = Object.assign(Object(document.createElement("canvas").getContext("2d")), {
    font: window.getComputedStyle(element).getPropertyValue("font"),
  }).measureText(element.textContent).width;
  // return textWidth > element.offsetWidth;
  return textWidth + 20 > element.offsetWidth;
}
