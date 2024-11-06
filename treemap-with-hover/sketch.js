let root; //, treemapLayout;
let treemapData;
let currentRoot;
let p, p1, p2;
let txt = "Coding Train";
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
  p = createP(`Treemap of ${txt} Challenge Showcases`).addClass("title");

  currentWidth = width;
  currentHeight = height;

  // Initialize D3 Hierarchy and Treemap Layout
  root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  treemapLayout = d3
    .treemap()
    .size([currentWidth, currentHeight])
    .padding(3)
    .tile(d3.treemapSquarify);

  // Set initial display level to the root
  currentRoot = root;

  // Retrieve only the leaf nodes
  treemapData = currentRoot.leaves();
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

function setTitle(parent, value) {
  if (p1) {
    p1.remove();
  }

  p1 = createP(`${parent} Challenges: ${value} showcases`).id("second");
}

function drawTreemap() {
  graphics = []; // Clear the graphics array to avoid layering
  background(0);

  let nodeColors = new Map(); // Map to store colors for each parent node
  let colorIndex = 0;

  for (let node of currentRoot.leaves()) {
    const { x0, y0, x1, y1 } = node;
    let x = x0 || 0;
    let y = y0 || 0;
    let w = (x1 || 0) - (x0 || 0);
    let h = (y1 || 0) - (y0 || 0);

    let parentNode = node.parent;

    // Check if the parent already has a color assigned
    // chatGPT helped with this bit of code
    if (!nodeColors.has(parentNode)) {
      // Assign the next color in the palette, cycling back if needed
      let color = palette[colorIndex % palette.length];
      nodeColors.set(parentNode, color);
      colorIndex++;
    }

    // Get the assigned color for this node's parent
    let nodeColor = nodeColors.get(parentNode);

    let buffer = createGraphics(w, h);
    buffer.fill(nodeColor[0], nodeColor[1], nodeColor[2]);
    buffer.rect(0, 0, w, h);
    buffer.fill(255);
    buffer.textSize(22);
    buffer.textAlign(CENTER, CENTER);
    if (w > 300) {
      buffer.text(node.data.name, w / 2, h / 2);
    } else if (w <= 300 && w > 200) {
      buffer.text(node.data.name, 10, h / 2, w);
    } else {
      buffer.text(getLeadingNumber(node.data.name), w / 2, h / 2);
    }

    graphics.push({
      buffer: buffer,
      x: x,
      y: y,
      w: w,
      h: h,
      name: node.data.name,
      value: node.value,
      parent: parentNode,
    });
  }
}

// Helper function from chatGPT
function getLeadingNumber(name) {
  const match = name.match(/^C?(\d+)/); // Matches an optional "c" followed by digits
  return match ? parseInt(match[1], 10) : null; // Extracts and converts the number portion
}

function applyTreemapLayout() {
  treemapLayout(currentRoot);
}

function mouseMoved() {
  let found = false;
  for (let g of graphics) {
    let parent = g.parent;
    let num = parent.value;
    let majorCategory = parent.parent;
    if (majorCategory.data.name == "root") {
      setTitle(parent.data.name, num);
    } else {
      setTitle(majorCategory.data.name + "/" + parent.data.name, num);
    }
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
