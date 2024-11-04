let data;
let root, treemapLayout;
let currentRoot;
let resetButton;
let p;
//let txt = "Treemap of Coding Train Challenge Showcases";
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

  resetButton = createButton("Return to Main View").addClass("reset");
  resetButton.mousePressed(reset);
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

function reset() {
  currentRoot = root;
  applyTreemapLayout();
  p.remove();
  setTitle(txt);
}

function setTitle(txt) {
  if (p) {
    p.remove();
  }
  let tw = textWidth(txt) + textWidth("Treemap of Challenge Showcases");
  p = createP(`Treemap of ${txt} Challenge Showcases`).addClass("title");
}

function applyTreemapLayout() {
  treemapLayout(currentRoot);
  rectW = currentRoot.children
    ? currentRoot.children.map((node) => int(node.x1 - node.x0))
    : [];
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
  } else if (currentRoot.parent) {
    reset();
  }

  drawTreemap();
}

// Function to calculate text size based on textWidth and area w, h, area of rect
function calculateTextSize(w, h, node) {
  let s; // textSize
  let n = node.data.name;
  let tw = textWidth(n);
  let area = w * h;
  //console.log(n, w, tw, area);
  if (area < 2200) {
    // Not enough space to write text so set textSize to zero
    return [0, 0];
  } else if (tw < w && h < 100) {
    let align = 1; // textAlign(CENTER, TOP)
    s = map(w, 0, max(rectW), 5, 20);
    return [s, align];
  } else {
    let align = 2; // textAlign(CENTER, CENTER)
    //console.log(max(rectW))
    s = map(w, 0, max(rectW), 5, 20);
    return [s, align];
  }
}

function addText(x, y, w, h, node, s, align) {
  fill(255);
  noStroke();
  if (s == 0) {
    // Do nothing - not enough space for text
  } else if (align == 1) {
    textAlign(CENTER, TOP);
    textSize(s);
    text(node.data.name, x + w / 2, y);
    text(`${node.value} showcases`, x + w / 2, y + s);
  } else {
    textSize(s);
    textAlign(CENTER, CENTER);
    text(node.data.name, x + w / 2, y + h / 2);
    text(`${node.value} showcases`, x + w / 2, y + s + h / 2);
  }
}
