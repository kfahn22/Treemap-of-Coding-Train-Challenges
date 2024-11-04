# Treemap 0f Coding Train Challenges Showcases

Zoomable treemap in p5.js using [d3js](https://d3js.org) illustrated with Coding Train challenge showcase count.

## Steps

1. Make sure you are in the directory that you want to base the treemap on, and then run this [command](https://stackoverflow.com/questions/71669974/how-to-count-number-of-tracked-files-in-each-sub-directory-of-the-repository) in terminal.

```git
git ls-files | awk '{$NF="";print}' FS=/ OFS=/ | sort | uniq -c
```

The output of this command will look like something like this:

31 content/videos/challenges/100-neuroevolution-flappy-bird/showcase/
2 content/videos/challenges/101-may-the-4th-scrolling-text/
4 content/videos/challenges/101-may-the-4th-scrolling-text/showcase/
2 content/videos/challenges/102-2d-water-ripple/
1 content/videos/challenges/102-2d-water-ripple/images/

2. Copy the result of the command and paste into a .txt file. (I named the file "10_30_24.txt" because I wanted to keep track of the date I accessed the website files.)

3. I got some help from chatGPT writing the script to create the json file. It could probably be improved upon, but it is functional. Because I wanted to explore creating a zoomable treemap, I grouped the challenges into major categories and then divided some into sub-categories. Again, my categorization scheme could probably be improved upon, but I think it is a decent start.

4. Run the `create_json.py` script in terminal, changing `input_file` (line 131) to whatever you have named the txt file. Make sure your are in the same folder as the txt file when you run the command.

```python
python create_json.py
```

The output will be a json file (It is named `showcases.json`). It will have the following format:

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


5. Preload the json file into your p5 sketch using the loadJSON() function.

```JavaScript
function preload() {
  data = loadJSON("showcases.json");
}
```



6. Initialize the d3 hierarchy and treemap layout.

```JavaScript
root = d3.hierarchy(data).sum((d) => d.value);
  treemapLayout = d3
    .treemap()
    .size([currentWidth, currentHeight])
    .padding(6)
    .tile(d3.treemapSquarify);
```

We are specifying the `treemapSquarify` option for the tile because this give a nicer aspect ratio. To learn more about treemaps, you can read
I decided to try to create a zoomable treemap to viualize the showcase (similar to this [one](https://observablehq.com/@d3/zoomable-treemap) listed in the examples on the d3 website).

I am sure there are many improvements that could be added, but it is a decent start. You can explore the treemap here.

## Resources

- [d3-hierarchy/treemap Documentation](https://d3js.org/d3-hierarchy/treemap)
- [Treemapping](https://en.wikipedia.org/wiki/Treemapping)
- [Squarified Treemaps](https://vanwijk.win.tue.nl/stm.pdf)
- [Squarify Processing Libary](https://github.com/agatheblues/squarify)
