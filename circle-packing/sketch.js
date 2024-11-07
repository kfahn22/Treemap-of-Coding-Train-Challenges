// https://observablehq.com/@d3/zoomable-circle-packing
// https://d3js.org/d3-hierarchy/pack

let data;
let root;
let popup = null;
let popup2 = null;
let p;
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

function preload() {
  data = loadJSON("showcases.json");
}

function setup() {
  createCanvas(1280, 1280);
  p = createP(`Circle Packing of Coding Train Challenge Showcases`).addClass(
    "title"
  );
  
  // Initialize D3 Hierarchy and Treemap Layout
  root = d3.pack(data).size([width, height]).padding(1)(
    d3
      .hierarchy(data)
      .sum((d) => d.value)
      .sort((a, b) => b.value - a.value)
  );

  // Assign a color from the palette to each node in the hierarchy
  assignColors(root);
}

function assignColors(node) {
  if (!node.data.color) {
    node.data.color = random(palette); // Choose a color and store it in node.data.color
  }
  if (node.children) {
    for (let child of node.children) {
      assignColors(child); // Recursively assign colors to each child
    }
  }
}

function draw() {
  background(0);

  // Draws the circle packing visualization
  drawPack();

  // Draw the popup for major categories
  if (popup) {
    noFill();
    rect(0, 0, popup.w, popup.h);
    fill(255);
    textAlign(LEFT, TOP);
    textSize(26);
    text(popup.text, popup.x, popup.y);
  }
  // Popup for individual challengs
  if (popup2) {
    fill(255, 200);
    noStroke();
    rect(popup2.x, popup2.y, popup2.w, popup2.h);
    fill(0);
    textAlign(LEFT, TOP);
    textSize(18);
    text(popup2.text, popup2.x + 10, popup2.y + 10, popup2.w);
  }
}

function drawPack() {
  let majorCat = root.children;

  for (let node of majorCat) {
    let { name, color } = node.data;
    let { x, y, r, value } = node;
    let c = assignColors(node);
    fill(color); // Use the stored color
    circle(x, y, r * 2); // d3.pack() radius is half diameter
    if (r > 100) {
      let s = 16;
      fill(255);
      textSize(s);
      //text(name, x + r + 10, y + r);
      //text(value, x + r + 10, y + r + s);
    }

    if (node.children) {
      for (let subNode of node.children) {
        let { name, color } = subNode.data;
        let { x, y, r, value } = subNode;
        //console.log(name)
        stroke(0);
        strokeWeight(1);
        fill(color); // Use the stored color
        circle(x, y, r * 2);
        if (r > 100) {
          fill(255);
          textSize(12);
          //text(num, x, y);
          //text(value, x, y + 12);
        }
      }
    }
  }
}

function mouseMoved() {
  let found1 = false;
  let found2 = false;
  let majorCat = root.children;
  for (let node of majorCat) {
    let name = node.data.name;
    let { x, y, r, value } = node;
    let d = dist(mouseX, mouseY, x, y);

    if (d < r) {
      popup = {
        x: 20, // Adjust position if needed
        y: 20,
        w: 100,
        h: 50,
        text: `${name}\n${value} showcases`,
      };
      found1 = true;
    }
    if (node.children) {
      for (let subNode of node.children) {
        let name = subNode.data.name;
        let { x, y, r, value } = subNode;
        let d = dist(mouseX, mouseY, x, y);
        if (d < r) {
          popup2 = {
            x: x,
            y: y,
            w: 200,
            h: 100,
            text: `${name}\n${value} showcases`,
          };
          found2 = true;
          break;
        }
      }
    }
  }

  // Clear the popups if no node is found
  if (!found1) {
    popup = null;
  }
  if (!found2) {
    popup2 = null;
  }
}
