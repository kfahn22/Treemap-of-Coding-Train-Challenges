let data;
let root, treemapLayout;
let currentRoot;
let resetButton;
let p, p1;
let txt = "Coding Train";
let rectW = [];
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

function preload() {
  data = loadJSON("showcases.json");
}

function setup() {
  //createCanvas(windowWidth, windowHeight).position(0, 150);
  setTitle(txt);
  createCanvas(windowWidth, windowHeight);

  // resetButton = createButton("Return to Main View").addClass("reset");
  // resetButton.mousePressed(reset);
  currentWidth = width;
  currentHeight = height;

  // Initialize D3 Hierarchy and Treemap Layout
  root = d3.hierarchy(data).sum((d) => d.value);
  treemapLayout = d3
    .treemap()
    .size([currentWidth, currentHeight])
    .padding(6)
    .tile(d3.treemapSquarify);

  // Set initial display level to the root
  currentRoot = root;
  applyTreemapLayout();
  drawTreemap();
}

// function reset() {
//   console.log(currentRoot)
//   clear()
//   currentRoot = root;
//   applyTreemapLayout();
//   p.remove();
//   setTitle(txt);
// }

function setTitle(txt) {
  if (p || p1) {
    p.remove();
  }
  if (p1) {
    p1.remove();
  }

  p = createP(`Treemap of ${txt} Challenge Showcases`).addClass("title");
  p1 = createP(
    "Click into the subcategories. If you are viewing individual challenge showcase counts, clicking again will bring you back to the main view."
  );
}

function applyTreemapLayout() {
  treemapLayout(currentRoot);
  // rectW = currentRoot.children
  //   ? currentRoot.children.map((node) => int(node.x1 - node.x0))
  //   : [];
}

function drawTreemap() {
  background(0);

  (currentRoot.children || []).forEach((node) => {
    let x = node.x0 || 0;
    let y = node.y0 || 0;
    let w = (node.x1 || 0) - (node.x0 || 0);
    let h = (node.y1 || 0) - (node.y0 || 0);

    // TODO Try to fill with examples of challenge
    fill(random(palette));
    noStroke();
    strokeWeight(4);
    rect(x, y, w, h);

    let [s, align] = calculateTextSize(w, h, node);
    addText(x, y, w, h, node, s, align);
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
    applyTreemapLayout();
    // } else if (clickedNode.parent) {
    //   console.log("Hello")
  } else {
    clear();
    currentRoot = root;
    applyTreemapLayout();
    p.remove();
    setTitle(txt);
  }

  drawTreemap();
}

// Function to calculate text size based on textWidth and area w, h, area of rect
function calculateTextSize(w, h, node) {
  let s; // textSize
  let n = node.data.name;
  let tw = textWidth(n);
  let area = w * h;
  let p = w / windowWidth; // calculate width of rect relative to window size
  if (area < 2200) {
    // Not enough space to write text so set textSize to zero
    return [0, 0];
  } else if (tw < w && h < 100) {
    let align = 1; // textAlign(CENTER, TOP)
    s = map(p, 0, 1, 5, 22);
    return [s, align];
  } else {
    let align = 2; // textAlign(CENTER, CENTER)
    s = map(p, 0, 1, 12, 22);
    //s = map(w, 0, max(rectW), 5, 20);
    return [s, align];
  }
}

function addText(x, y, w, h, node, align) {
  fill(255);
  noStroke();
  let n = node.data.name;
  let tw = textWidth(n);
  let nshowcase = `${node.value} showcases`;
  let tws = textWidth(nshowcase);
  let a = w * h;
  //let totalA = windowWidth * windowHeight
  //console.log(node.data.name, a)
  //let s = map((a/totalA), 0, .25, 12, 22);
  let s = map(tw / w, 0, 1, 12, 20);
  textSize(s);
  if (a < 15000) {
    // Do nothing - not enough space for text
    // Rect is long and skinny, wrap text
  } else if (tw < w && h < 100) {
    push();
    textSize(s);
    textAlign(CENTER, TOP);
    text(node.data.name, x, y, w);
    text(`${node.value} showcases`, x, y + s, w);
    pop();
  } else if ((tw > 0.8 * w || tws > 0.8 * w) && h > 100) {
    push();
    textSize(s * 0.75);
    textAlign(CENTER, CENTER);
    text(node.data.name, x, y + h / 2, w);
    text(`${node.value} showcases`, x, y + h / 2 + s, w);
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
