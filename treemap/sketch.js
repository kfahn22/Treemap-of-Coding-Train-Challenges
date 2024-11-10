// Treemap of Coding Train Challlenge Showcase Count
// JSON file as of 10-30-24

// I utilized chatGPT to iteratively develop some of this code. I have found that it can be quite useful, provided you give it the proper context to understand what you want to accomplish. It is also important to remember that once you ask a question, it is logged to a database so do not post anything you wish to keep private.  The Coding Train website has a MIT license.

let root;
let p, p1;
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
  p = createP(`Treemap of Coding Train Challenge Showcases`).addClass("title");

  // Initialize D3 Hierarchy and Treemap Layout
  root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);

  treemapLayout = d3
    .treemap()
    .size([width, height])
    .padding(3)
    .tile(d3.treemapSquarify);

  //console.log(root)
  treemapLayout(root);
  drawTreemap();
}

function draw() {
  background(255);
  for (let g of graphics) {
    image(g.buffer, g.x, g.y, g.w, g.h);
  }

  if (popup) {
    let x = popup.x;
    let y = popup.y;
    let [xadj, yadj] = fixPopup(x, y);
    fill(255, 255, 255, 220);
    rect(popup.x - xadj, popup.y - yadj, popup.w, popup.h, 10);
    fill(0);
    noStroke();
    textSize(18);
    textAlign(LEFT, TOP);
    text(popup.text, popup.x - xadj + 5, popup.y - yadj + 5, popup.w);
  }
}

function fixPopup(x, y) {
  let xadj, yadj;
  if (x < width * 0.66 && y < height * 0.66) {
    xadj = 0;
    yadj = 0;
  } else if (x > width * 0.66 && y < height * 0.66) {
    xadj = 350;
    yadj = 0;
  } else if (x < width * 0.66 && y > height * 0.66) {
    xadj = 0;
    yadj = 100;
  } else if (x > width * 0.66 && y > height * 0.66) {
    xadj = 350;
    yadj = 100;
  }
  return [xadj, yadj];
}

function setTitle(parent, value) {
  if (p1) {
    p1.remove();
  }

  p1 = createP(`${parent} Challenges: ${value} showcases`).id("second");
}

function drawTreemap() {
  graphics = []; // Clear the graphics array to avoid layering

  let nodeColors = new Map(); // Map to store colors for each parent node
  let colorIndex = 0;

  for (let node of root.leaves()) {
    const { x0, y0, x1, y1 } = node;
    let x = x0 || 0;
    let y = y0 || 0;
    let w = (x1 || 0) - (x0 || 0);
    let h = (y1 || 0) - (y0 || 0);

    let parentNode = node.parent;

    // Check if the parent already has a color assigned
    if (!nodeColors.has(parentNode)) {
      // Assign the next color in the palette, cycling back if needed
      let color = palette[colorIndex % palette.length];
      nodeColors.set(parentNode, color);
      colorIndex++;
    }

    // Get the assigned color for this node's parent
    let nodeColor = nodeColors.get(parentNode);

    let buffer = createGraphics(w, h);
    buffer.fill(nodeColor);
    buffer.rect(0, 0, w, h);
    buffer.fill(255);
    buffer.textSize(12);
    buffer.textAlign(CENTER, CENTER);
    if (w > 175) {
      buffer.text(node.data.name, 0, h / 2, w);

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

// Because most of the rectangles are too small to display the full challenge name  are extracting the challenge number.
// The Coding in the Cabana challenges start with "C", so also have to account for that variation
function getLeadingNumber(name) {
  const match = name.match(/^C?(\d+)/); // Matches an optional "C" followed by digits
  return match ? parseInt(match[1], 10) : null;
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
        h: 80,
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
