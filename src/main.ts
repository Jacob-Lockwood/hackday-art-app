import "./style.css";

const canvas = document.querySelector<HTMLCanvasElement>("canvas");
const ctx = canvas.getContext("2d");

let WIDTH: number, HEIGHT: number;
WIDTH = canvas.width = canvas.clientWidth;
HEIGHT = canvas.height = canvas.clientHeight;
let originX = WIDTH / 2,
  originY = HEIGHT / 2;
let zoomFactor = 0;

// type CanvasObject = () => void;
// const objects: Record<string, CanvasObject> = {};

function screenX(x: number) {
  return scale(originX + x);
}
function screenY(y: number) {
  return scale(originY + y);
}

function drawBackground() {
  ctx.fillStyle = "hsl(246 11.9% 12.2%)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  const squareSize = scale(60);
  const startX = screenX(0) % squareSize;
  const startY = screenY(0) % squareSize;
  ctx.strokeStyle = "hsl(246 11.9% 24.6%)";
  ctx.beginPath();
  for (let x = startX; x < WIDTH; x += squareSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, HEIGHT);
  }
  for (let y = startY; y < HEIGHT; y += squareSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(WIDTH, y);
  }
  ctx.stroke();
}
function scale(val: number) {
  return Math.exp(zoomFactor) * val;
}
function unscale(val: number) {
  return val / Math.exp(zoomFactor);
}
function debugInfo() {
  // ctx.fillText("");
}
function drawDotAtOrigin() {
  ctx.fillStyle = "red";

  ctx.fillRect(screenX(10), screenY(10), scale(80), scale(80));
}
function draw() {
  WIDTH = canvas.width = canvas.clientWidth;
  HEIGHT = canvas.height = canvas.clientHeight;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackground();
  drawDotAtOrigin();
  debugInfo();
}

draw();
let dragMouseStartX: number | undefined, dragMouseStartY: number | undefined;
let dragOffsetStartX: number | undefined, dragOffsetStartY: number | undefined;
document.addEventListener("mousedown", (ev) => {
  dragMouseStartX = ev.clientX;
  dragMouseStartY = ev.clientY;
  dragOffsetStartX = originX;
  dragOffsetStartY = originY;
});
document.addEventListener("mousemove", (ev) => {
  if (dragMouseStartX === undefined || dragMouseStartY === undefined) return;
  originX = dragOffsetStartX + unscale(ev.clientX - dragMouseStartX);
  originY = dragOffsetStartY + unscale(ev.clientY - dragMouseStartY);
  draw();
});
document.addEventListener("mouseup", () => {
  dragMouseStartX = undefined;
  dragMouseStartY = undefined;
});

document.addEventListener(
  "wheel",
  (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    zoomFactor += ev.deltaY / 1000;
    draw();
  },
  { passive: false },
);
