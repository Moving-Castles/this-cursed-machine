export const circularLayout = (node: HTMLElement, config = { radius: 40 }) => {
  node.style.cssText += `
  --child-count: ${node.children.length};
  --angle: ${360 / node.children.length}deg;
  --radius: ${config.radius}px;
  `
  node.classList.add("circularLayout")
  return {}
}