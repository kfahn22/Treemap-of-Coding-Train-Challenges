let data;
let root, treemapLayout;
let currentRoot;
let p, p1;
let txt = "Coding Train";
let interpolatedColors = [];
let graphics = [];
let popup = null;
let palette = [
  [11, 106, 136], // teal
  [45, 197, 244], // aqua
  [112, 50, 126], // dk purple
  [146, 83, 161], // purple
  [164, 41, 99], // red-purple
  [236, 1, 90], // raspberry
  [240, 99, 164], // pink
  [241, 97, 100], // pink-orange
  [248, 158, 79], // orange
  [102, 211, 52], // green
  [252, 238, 33], // yellow
  [112, 22, 22], // maroon
];

function preload() {
  data = loadJSON("showcases.json");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  setTitle(txt);

  currentWidth = width;
  currentHeight = height;

  // Initialize D3 Hierarchy and Treemap Layout
  root = d3.hierarchy(data).sum((d) => d.value);
  console.log(root)

  treemapLayout = d3
    .treemap()
    .size([currentWidth, currentHeight])
    .padding(4)
    .tile(d3.treemapSquarify);

  // Set initial display level to the root
  currentRoot = root;
  applyTreemapLayout();
  drawTreemap();
}

function draw() {
  background(0);
  for (let g of graphics) {
    image(g.buffer, g.x, g.y, g.w, g.h);
  }

  if (popup && popup.x < width * 0.75) {
    fill(255);
    stroke(0);
    rect(popup.x, popup.y, popup.w, popup.h);
    fill(0);
    noStroke();
    textSize(18);
    textAlign(LEFT, TOP);
    text(popup.text, popup.x + 5, popup.y + 5);
  } else {
    if (popup && popup.x > width * 0.75) {
      fill(255);
      stroke(0);
      rect(popup.x - 200, popup.y, popup.w, popup.h);
      fill(0);
      noStroke();
      textSize(15);
      textAlign(LEFT, TOP);
      text(popup.text, popup.x - 200 + 5, popup.y);
    }
  }
}

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

function drawTreemap() {
  graphics = []; // Clear the graphics array to avoid layering
  background(0);

  (currentRoot.children || []).forEach((node) => {
    let x = node.x0 || 0;
    let y = node.y0 || 0;
    let w = (node.x1 || 0) - (node.x0 || 0);
    let h = (node.y1 || 0) - (node.y0 || 0);

    let buffer = createGraphics(w, h);
    buffer.fill(random(palette));
    buffer.rect(0, 0, w, h);
    buffer.fill(255);
    buffer.textSize(22);
    buffer.textAlign(CENTER, CENTER);
    if (w > 200) {
      buffer.text(node.data.name, w / 2, h / 2);
    }
    graphics.push({
      buffer: buffer,
      x: x,
      y: y,
      w: w,
      h: h,
      name: node.data.name,
      value: node.value,
    });
    return;
  });
}

function applyTreemapLayout() {
  treemapLayout(currentRoot);
}

function mouseMoved() {
  let found = false;
  for (let g of graphics) {
    if (
      mouseX > g.x &&
      mouseX < g.x + g.w &&
      mouseY > g.y &&
      mouseY < g.y + g.h
    ) {
      popup = {
        x: mouseX + 10,
        y: mouseY + 10,
        w: 300,
        h: 75,
        text: `${g.name}\n${g.value} showcases`,
      };
      found = true;
      break;
    }
  }
  if (!found) {
    popup = null;
  }
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
  } else {
    currentRoot = root;
    applyTreemapLayout();
    p.remove();
    setTitle(txt);
  }

  drawTreemap();
}

function keyPressed() {
  if (key === "k" || key === "K") {
    save("img.jpg");
  }
}