# Treemap 0f Coding Train Challenges Showcases

A while back I found a zoomable treemap of US imports that I really liked and decided to create my own version of a zoomable treemap. A good rule of thumb is that you should start with data that you know pretty well, so I decided to start with data on the Coding Train challenge showcase counts. After a few iterations, I have come up with a zoomable treemap in p5.js using [d3js](https://d3js.org), illustrated with [Coding Train](https://github.com/CodingTrain/thecodingtrain.com) challenge showcase count.

<p align="center"><img src="assets/treemap.jpg" alt="Treemap of Coding Challenge showcases" width="500px"></p>

## Steps

1. Make sure you are in the directory that you want to base the treemap on, and then run this [command](https://stackoverflow.com/questions/71669974/how-to-count-number-of-tracked-files-in-each-sub-directory-of-the-repository) in terminal.

<p align="center"><img src="assets/git.png" alt="git command" width="500px"></p>

```git
git ls-files | awk '{$NF="";print}' FS=/ OFS=/ | sort | uniq -c
```

The output of this command will look like something like this:

```txt
31 content/videos/challenges/100-neuroevolution-flappy-bird/showcase/
2 content/videos/challenges/101-may-the-4th-scrolling-text/
4 content/videos/challenges/101-may-the-4th-scrolling-text/showcase/
2 content/videos/challenges/102-2d-water-ripple/
1 content/videos/challenges/102-2d-water-ripple/images/
```

2. Copy the result of the command and paste into a .txt file. (I named the file "10_30_24.txt" because I wanted to keep track of the date I accessed the Coding Train website files.)

I got some help from chatGPT writing the script to create the json file. It could probably be improved upon, but it is functional. Because I wanted to explore creating a zoomable treemap, I grouped the challenges into major categories and then divided some into sub-categories. Again, my categorization scheme could probably be improved upon, but I think it is a decent start.

3. Run the `create_json.py` script in terminal, changing `input_file` (line 131) to whatever you have named the txt file. Make sure you are in the same folder as the txt file when you run the command.

```python
python create_json.py
```

The output will be a json file (`showcases.json`). It will have the following format:

```JSON
{
    "name": "root",
    "children": [
        {
            "name": "3D Rendering",
            "children": [
                {
                    "name": "112 3d rendering with rotation and projection",
                    "value": 18
                },
                {
                    "name": "113 4d hypercube aka tesseract",
                    "value": 17
                },
                {
                    "name": "87 3d knots",
                    "value": 8
                }
            ]
        },
```

4. Preload the json file into your p5 sketch using the loadJSON() function.

```JavaScript
function preload() {
  data = loadJSON("showcases.json");
}
```

5. Initialize the d3 hierarchy and treemap layout.

```JavaScript
root = d3.hierarchy(data).sum((d) => d.value);
  treemapLayout = d3
    .treemap()
    .size([currentWidth, currentHeight])
    .padding(6)
    .tile(d3.treemapSquarify);
```

We are specifying the `treemapSquarify` option for the tile because this give a nicer aspect ratio for the rectangles - the default is to use the golden ratio although it is possible to choose others. (Note that the documentation notes that this is the goal, and does not guarantee nice rectangles with nice aspect ratios.) To learn more about treemaps, I recommend reading the seminal article "Squarified Treemaps" by Bruls, et. al.

I decided to try to create a zoomable treemap to visualize the showcase (similar to this [one](https://observablehq.com/@d3/zoomable-treemap) listed in the examples on the d3 website).  They use svg container, which is not something that is natively supported in p5.js. I was able to create my own version (with some help from chatGPT) using a createGraphics buffer. I am sure there are many improvements that could be added, but it is a decent start. You can explore the treemap here.

## Resources

- [d3-hierarchy/treemap Documentation](https://d3js.org/d3-hierarchy/treemap)
- [Growth Lab](https://atlas.cid.harvard.edu/explore?country=188&queryLevel=location&product=undefined&year=2001&productClass=HS&target=Product&partner=undefined&startYear=undefined)
- [Squarified Treemaps](https://vanwijk.win.tue.nl/stm.pdf)
- [Squarify Processing Libary](https://github.com/agatheblues/squarify)
- [Treemapping](https://en.wikipedia.org/wiki/Treemapping)
