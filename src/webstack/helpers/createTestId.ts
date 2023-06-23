let lastGlobId = 0;
const createTestId = (parentComponent: any, childComponent: any) => {
  lastGlobId++;
  // parent class naming conventions should be formatted as "<COMPONENT_NAME>__<ELEMENTS_FUNCTIONALITY>"
  const parClass = parentComponent.getAttribute("class") ? parentComponent.getAttribute("class").split(" ")[1] : "";
  // tag name for the element to be tested
  const chiTag = childComponent.tagName.toLowerCase();
  const chiClass = childComponent.getAttribute("class").includes('select')? childComponent.getAttribute("class").split(" ")[1]:chiTag;
  const chiType = childComponent?.type ? "-" + childComponent?.type : "";
  const chiTxt = childComponent.getAttribute("class").includes('select') || childComponent.getAttribute("class").includes('input-date-range')?"":childComponent.innerText ? ":" + childComponent.innerText.toLowerCase() : "";
  // const chiTxt = childComponent.getAttribute("class").includes('input-date-range')?"":childComponent.innerText ? ":" + childComponent.innerText.toLowerCase() : "";
  const identity = `comp=${parClass}&el=${chiClass}${chiType}${chiTxt}&globId=${lastGlobId}`;
  return identity;
};
export default createTestId;
// ${parentComponent.tagName.toLowerCase()}-