// https://observablehq.com/@d3/zoomable-circle-packing

let data;
let root, treemapLayout;
let currentRoot;
let resetButton;
let p, p1;
let txt = "Coding Train";
let palette = [
  [11, 106, 136],
  [45, 197, 244],
  [112, 50, 126],
  [146, 83, 161],
  [164, 41, 99],
  [236, 1, 90],
  [240, 99, 164],
  [241, 97, 100],
  [248, 158, 79],
  [102, 211, 52],
  [112, 22, 22],
];
let currentWidth, currentHeight;
let showcases;

function preload() {
  data = loadJSON("showcases.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight).position(0, 150);
  setTitle(txt);
  //createCanvas(1280, 850);

  currentWidth = width;
  currentHeight = height;

  // Initialize D3 Hierarchy and Treemap Layout
  root = d3.pack(data).size([currentWidth, currentHeight]).padding(3)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );
  //let root = pack(data);

  // Set initial display level to the root
  currentRoot = root;

  console.log(root)
  applyPackLayout();
  drawPack();
}

function setTitle(txt) {
  if (p || p1) {
    p.remove();
  }
  if (p1) {
    p1.remove();
  }

  p = createP(`Circle Packing of ${txt} Challenge Showcases`).addClass("title");
  p1 = createP(
    "Click into the subcategories. If you are viewing individual challenge showcase counts, clicking again will bring you back to the main view."
  );
}

function applyPackLayout() {
  d3.pack(currentRoot);
}

function drawPack() {
  background(0);

  (currentRoot.children || []).forEach((node) => {
    let x = node.x || 0;
    let y = node.y || 0;
    let r = node.r;
    // let w = (node.x1 || 0) - (node.x0 || 0);
    // let h = (node.y1 || 0) - (node.y0 || 0);

    // TODO Try to fill with examples of challenge
    fill(random(palette));
    noStroke();
    strokeWeight(4);
   circle(x, y, r);
    console.log(x, y, r)
    //addText(x, y, r, node);
});
}

function mousePressed() {
  let clickedNode = null;

  (currentRoot.children || []).forEach((node) => {
    let x = node.x0 || 0;
    let y = node.y0 || 0;
    let w = (node.x1 || 0) - (node.x0 || 0);
    let h = (node.y1 || 0) - (node.y0 || 0);

    if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
      clickedNode = node;
      currentWidth = clickedNode.x1 - clickedNode.x0;
      currentHeight = clickedNode.y1 - clickedNode.y0;
    }
  });

  if (clickedNode && clickedNode.children) {
    setTitle(clickedNode.data.name);
    currentRoot = d3.hierarchy(clickedNode.data).sum((d) => d.value);
    applyPackLayout();
  } else {
    clear();
    currentRoot = root;
    applyPackLayout();
    p.remove();
    setTitle(txt);
  }

  drawPack();
}

function addText(x, y, r, node) {
  fill(255);
  noStroke();
  let n = node.data.name;
  let tw = textWidth(n);
  let nshowcase = `${node.value} showcases`;
  let tws = textWidth(nshowcase);
  // let a = w * h;
  let s = map(r, 0, 250, 12, 20);
  //textSize(s);
  //console.log(node.data.name, w / a, a / w);
  // Do nothing - not enough space for text
    if (a < 12000) {
      // if (a < 15000) {
      // If rect is wide enough, but not high enough to center text properly, use (CENTER, TOP) alignment
    } else if (tw < w && h < 100) {
      push();
      textSize(s);
      textAlign(CENTER, TOP);
      text(node.data.name, x-r, y, 2*r);
      text(`${node.value} showcases`, x, y, 2*r);
      pop();
      // Case for tall, skinny rect -- this is a hack!, there is probably a better way to do this)
    } else if ((tw > 0.8 * w || tws > 0.8 * w) && h > 100) {
      push();
      textSize(s * 0.6);
      textAlign(CENTER, CENTER);
      text(node.data.name, x, y + h / 2, w);
      text(`${node.value} showcases`, x, y + h / 2 + 2 * s, w);
      pop();
    } else {
      push();
      textSize(s);
      textAlign(CENTER, CENTER);
      text(node.data.name, x + w / 2, y + h / 2);
      text(`${node.value} showcases`, x + w / 2, y + s + h / 2);
      pop();
    }
}

// Function from https://editor.p5js.org/tnishida/sketches/1z-guNgDE
// function verticalText(t, x, y) {
//   push();
//   textAlign(CENTER, CENTER);
//   const vt = t.split("").join("\n");
//   text(vt, x, y);
//   pop();
// }
