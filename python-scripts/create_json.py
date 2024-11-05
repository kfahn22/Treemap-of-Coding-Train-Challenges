import json
from collections import defaultdict

# Define categories with subcategories as a dictionary
categories = {
    "3D Rendering": ["tesseract", "projection", "rotation", "Spherical", "knots"],
    "Basic Algorithms": { "Genetic Algorithms": ["genetic", "evolutionary", "rockets", "tsp", "behaviors", "flappy-bird", "traveling"], "Sorting/Search": ["pathfinding", "DFS", "binary-tree", "breadth-first", "quadtree", "quicksort", "bubble-sort"], "Miscellaneous": ["poisson", "reaction", "gift-wrapping", "RDP", "circle-packing"]},
    "Animations": ["sprites", "animation", "bees-and-bombs", "bouncing", "gif-", "starfield", "fireworks",  "kinematics"],
    "AppleSoft Basic": ["applesoft"],
    "Binary": ["binary-to-decimal", "bit-shifting"],
    "Botany": ["Barnsley", "Phyllotaxis"],
    "Cellular Automata": ["cellular", "automata", "sand", "Wolfram","game-of-life", "Langtons"],
   "Chat Bot": ["chatbot", "voice"],
   "Chrome Extension": ["extension"],
   "Clocks/Timers": ["timer", "clock", "seven-segment"],
    # "Coding in the Cabana": ["c1", "c2", "c3", "c4", "c5"],
    "Fractals": {
        "Fractal Trees": ["fractal-trees-recursive", "object-oriented-fractal-trees", "l-system-fractal-trees", "fractal-trees-space-colonization"],
        "Fractal Recursion": ["chaos-game", "logo-interpreter", "dragon", "spirograph", "toothpicks", "menger", "hilbert"],
        "Mandelbrot Set": ["mandelbrot", "julia", "mandelbulb"]
    },
   "Fourier Series": ["fourier", "epicycles"],
   "Games": {
       "Physics Based Games": ["angry-birds-with-matterjs", "plinko"],
       "Classic Games": ["snake-game", "ladders", "asteroids", "space-invaders", "minesweeper", "agario", "frogger", "pong-", "flappy bird"],
       "Array Based Games": ["2048", "minimax", "tic-tac-toe", "rubiks", "slide"]
    },
    "Generative Art": ["islamic-star", "10Print", "wave-function"],
    "Images": ["dithering", "slitscan", "ascii", "stippling"],
    "Interpolation": ["morphing", "bezier"],
    "Machine Learning": ["xor", "neural", "ML", "neuroevolution", "tensorflow", "shape-classifier", "quick-draw", "ukulele", "zoom", "dinosaur", "runway"],
    # "Mandelbrot Set": ["mandelbrot", "julia", "mandelbulb"],
    "Noise": ["noise", "metaballs",  "perlin", "butterfly", "polar", "blobby"],
    "Number Sequences": ["recaman", "prime-spiral"],
    "Physics": {"Partical System": ["particle"], "Forces": ["pendulum", "forces", "attraction", "repulsion"], "Physics Engine": ["soft-body", "elastic"]},
    "Pi Day": ["-pi", "leibniz", "buffon", "apollonian"],
    "Pixels": ["pixel", "mosaic", "firebase"],
    "Polar Curves": {"Rose": ["rose"], "Heart": ["cardioid", "heart"], "Supercurves": ["super"], "Other": ["lissajous"]},
    # "Polar Curves": ["rose", "cardioid", "heart", "lissajous", "super"],
    "Random Walk": ["walker", "levy", "self-avoiding", "limited"],
    "Ray Casting": ["ray-casting"],
    "Simulations": {"Flocking": ["flocking"], "Fluid": ["water", "fire-effect", "fluid", "marbling", "reaction-diffusion"], 
    "Other": ["purple-rain", "mitosis", "cloth", "boring"]},
    "Snowflakes": ["snowfall", "brownian-tree", "koch", "kaleidoscope"],
    "Solar System": ["solar"],
    "Supershapes": ["superellipse", "supershapes"],
    "Text": ["markov", "grammar", "scrolling", "sentiment", "wikipedia"],
    "Visualizations": {"Data Visualizations": ["social-media", "earthquake", "subscribers", "climate"], "Other": ["lorenz", "black-hole"]}
}

def create_nested_dict():
    """Recursively creates a nested dictionary structure to store hierarchical data."""
    return defaultdict(create_nested_dict)

def add_to_dict(d, path, count):
    """Adds path with the count to the nested dictionary d if it includes 'showcase'."""
    *parts, last = path.split('/')
    if "showcase" in parts or last == "showcase":
        current = d
        for part in parts:
            current = current[part]
        # Add count to the last part if it is 'showcase'
        current[last] = int(count) if last else int(count)

def parse_file(file_path):
    """Parses the file and returns a structured dictionary, filtering by 'showcase'."""
    data = create_nested_dict()
    with open(file_path, 'r') as file:
        for line in file:
            count, path = line.strip().split(' ', 1)
            add_to_dict(data, path.strip('/'), count)
    return data

def consolidate_data(data, categories):
    root = {"name": "root", "children": []}
    challenges = data["content"]["videos"]["challenges"]

    # Loop through each major category
    for major_cat, subcategories in categories.items():
        category_data = {"name": major_cat, "children": []}

        # Check if the category has subcategories (i.e., is a dictionary)
        if isinstance(subcategories, dict):
            # Handle categories with subcategories
            for subcat_name, keywords in subcategories.items():
                subcat_data = {"name": subcat_name, "children": []}

                # Find challenges matching keywords in the subcategory
                for challenge_name, challenge_data in challenges.items():
                    if any(keyword in challenge_name for keyword in keywords):
                        subcat_data["children"].append({
                            "name": challenge_name.replace("-", " ").title(),
                            "value": challenge_data["showcase"]
                        })

                # Add subcategory if it has matched challenges
                if subcat_data["children"]:
                    category_data["children"].append(subcat_data)

        else:
            # Handle categories without subcategories (subcategories is a list of keywords)
            for challenge_name, challenge_data in challenges.items():
                if any(keyword in challenge_name for keyword in subcategories):
                    category_data["children"].append({
                        "name": challenge_name.replace("-", " ").title(),
                        "value": challenge_data["showcase"]
                    })

        # Add major category if it has matched challenges or subcategories
        if category_data["children"]:
            root["children"].append(category_data)

    return root

def main(input_file, output_file):
    
    # Parse the data from file, filtered by 'showcase'
    structured_data = parse_file(input_file)
    
    # Convert defaultdict to dict for JSON serialization
    structured_data = json.loads(json.dumps(structured_data))  # Removes defaultdict nesting

    # Organize challenges
    consolidated_data = consolidate_data(structured_data, categories)

    # Write organized data to output file
    with open(output_file, "w") as f:
        json.dump(consolidated_data, f, indent=4)
    print(f"Data successfully organized and written to {output_file}")

main("10_30_24.txt", "showcase.json")