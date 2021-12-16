import re
import json

# paste from Google docs
QUOTES = """
SELF (0.4)
Sometimes I dream of becoming a fairy, or a mermaid… or some sort of creature. (3)
I wish I could be a child forever. (2)
Don’t like to meet people due to certain <del>mental&nbsp;illness</del>. (1)
Socializing is so hard for me. (2)
I am both aggressive and passive, with both ego and inferiority. (1)
Sometimes I think too much. (1)
Along the way, we have created so much trash. (1)
After I finished working, I felt my work was good; I reviewed it later and found it to be totally insane. (1)
Life is suffering, I wanna die. (1)
Some people are superficially cool but actually terrible. (2)
I am a human, and you are a bot. I treat you with respect and kindness like I want to be treated. (1)
I think, therefore I am. I doubt, therefore I'm not. (1)
Would you choose to be able to fly, or to have the ability to live in water? (1)
Work smarter, and harder. (2)
PEOPLE (0.1)
Lorem ipsum dolor sit amet, consectetur adipiscing elit. (1)
To live in the Nacirema world, you must become a Nacirema. (1)
If there were an alien civilization, would their society be as strange as ours? (3)
All humans are created equally, but not everyone has the same privilege. (2)
To choose good, to choose evil, or not to choose. (2)
SHORT (0.2)
A = {x | x ∉ A} (1)
∫ e<sup>x</sup> de = 1/(x+1) e<sup>x+1</sup> + C (1)
404 Not Found (1)
Natural Selection (1)
Local Extrema (1)
Homo sapiens (1)
Generative Adversarial Network (1)
Mesh Generation (1)
Theological Determinism (1)
Unfriending Notes (1)
To-do List (1)
DISNEY: (0.3)
Out of the sea, wish I could be, part of your world. -&nbsp;Ariel, <i>The&nbsp;Little&nbsp;Mermaid</i> (1)
Bittersweet and strange, finding you can change, learning you were wrong. -&nbsp;<i>Beauty&nbsp;and&nbsp;the&nbsp;Beast</i> (1)
And at last I see the light, and it's like the fog has lifted. -&nbsp;Rapunzel, <i>Tangled</i> (1)
Do you want to build a snowman? (1)
Don't let them in, don't let them see. Be the good girl you always have to be. -&nbsp;Elsa, <i>Frozen</i> (1)
Here I stand in the light of day. -&nbsp;Elsa, <i>Let&nbsp;It&nbsp;Go</i> (1)
Just stay away and you'll be safe from me!  -&nbsp;Elsa,&nbsp;<i>Frozen</i> (3)
“Sometimes, who we wish we were, what we wish we could do… It’s just not meant to be.” -&nbsp;Moana’s&nbsp;Mother(1)
I've been staring at the edge of the water, Long as I can remember, Never really knowing why.  -&nbsp;Moana, <i>How&nbsp;Far&nbsp;I’ll&nbsp;Go</i> (1)
To the place I know where I cannot go, where I long to be.  -&nbsp;Moana, <i>How&nbsp;Far&nbsp;I’ll&nbsp;Go</i> (2)
See the line where the sky meets the sea? It calls me.  -&nbsp;Moana, <i>How&nbsp;Far&nbsp;I’ll&nbsp;Go</i> (2)
All the time wondering where I need to be is behind me. I'm on my own, to worlds unknown.  -&nbsp;Moana (1)
Sometimes, the world seems against you.  -&nbsp;Moana’s&nbsp;Grandmother (1)
And the call isn't out there at all. It's inside me. It's like the tide, Always falling and rising. -&nbsp;Moana (1)
Some look for trouble, while others don't.  -&nbsp;Elsa, <i>Frozen&nbsp;II</i> (1)
Sometimes we come last, but we did our best. -&nbsp;Try&nbsp;Everything, <i>Zootopia</i> (1)
"""
LINKS = """
PROFILE (0.3)
https://github.com/harry7557558 | My Github (3)
https://www.shadertoy.com/user/harry7557558/sort=love | My Shadertoy (4)
https://discord.com/users/489540173999112230 | My Discord (1)
https://www.instagram.com/harry7557558/ | My Instagram (1)
https://dmoj.ca/user/Moana | Competitive programming (1)
https://harry7557558.github.io/graph_backup/desmos/index.html | My Desmos graphs (3)
https://docs.google.com/document/d/1B7MUQFnMzgEBi-z0o2QsG-hHXcAOOsIbx4dPGrtVTNM/edit | List of quotes (1)
https://harry7557558.github.io/DMOJ-Render_Main/50pointer/%E2%80%8E/index.html | Click me! (1)
TOOLS (0.3)
https://harry7557558.github.io/notes/equations.html | My math notes (2)
https://harry7557558.github.io/notes/substitution.html | My math notes (1)
https://harry7557558.github.io/tools/chemequ.html | Chemical equation balancer (2)
https://harry7557558.github.io/tools/colorpicker.html | Color picker (2)
https://harry7557558.github.io/tools/complex.html | Complex grapher (1)
https://harry7557558.github.io/tools/complex_webgl.html | Complex grapher (1)
https://harry7557558.github.io/tools/mathjaxt.html | MathJax tester (1)
https://harry7557558.github.io/tools/matrixv.html | Matrix visualizer (1)
https://harry7557558.github.io/tools/svgpath.html | SVG path tester (1)
DEMO (0.4)
https://www.shadertoy.com/view/3dXfDr | Algebraic star (1)
https://www.shadertoy.com/view/WtcSR2 | Triangled (1)
https://www.shadertoy.com/view/wly3WG | Fitting arc using Bézier (1)
https://www.shadertoy.com/view/NsSSRK | Mathematica color schemes (1)
https://www.shadertoy.com/view/sljSzD | Gamma function (1)
https://www.shadertoy.com/view/sdVGWh | Nautilus shell (2)
https://www.shadertoy.com/view/tltSWr | I heart Fourier (1)
https://www.shadertoy.com/view/fsGGzh | Simplex terrain (1)
https://www.shadertoy.com/view/WtK3Ry | 2D path tracing (1)
https://www.desmos.com/calculator/vu4xm0n9ir | Torus projection (1)
https://www.desmos.com/calculator/7lr5htcel6 | Machine epsilon (1)
https://www.desmos.com/calculator/fa7mwvpxb3 | Desmos 3D (2)
https://www.desmos.com/calculator/w4thzt4ofr | RYB color wheel (1)
https://harry7557558.github.io/Graphics/raytracing/webgl_volume/index.html | Volume rendering (3)
https://harry7557558.github.io/art/dyed-egg/index.html | Random idea (2)
https://harry7557558.github.io/Graphics/UI/webgl_test/webgl_test_02.html | WebGL test (1)
"""


# quotes
lines = [_.strip() for _ in QUOTES.strip().split('\n')]
key = ""
result = {}

for line in lines:
    if line == "":
        continue

    # test of is category
    regex = re.compile(r"^([A-Z]+)\:*\s\(([0-9\.]+)\)$")
    match = regex.match(line)
    if match:
        key = match.group(1)
        probability = float(match.group(2))
        result[key] = {
            "probability": probability,
            "objects": []
        }
        continue

    # otherwise: quote
    regex = re.compile(r"(.+?)\s*\(([0-9\.]+)\)")
    match = regex.match(line)
    if match:
        quote = match.group(1)
        weight = match.group(2)
        result[key]["objects"].append({
            "text": quote,
            "weight": int(weight)
        })
        continue

    raise ValueError("Unknown line: " + line)

with open("src/quotes.json", "w") as fp:
    json.dump(result, fp)


# links
lines = [_.strip() for _ in LINKS.strip().split('\n')]
key = ""
result = {}

for line in lines:
    if line == "":
        continue

    # test of is category
    regex = re.compile(r"^([A-Z]+)\:*\s\(([0-9\.]+)\)$")
    match = regex.match(line)
    if match:
        key = match.group(1)
        probability = float(match.group(2))
        result[key] = {
            "probability": probability,
            "objects": []
        }
        continue

    # otherwise: quote
    regex = re.compile(r"(https\:\/\/.+?)\s*\|\s*(.+?)\s*\(([0-9\.]+)\)")
    match = regex.match(line)
    if match:
        link = match.group(1)
        alt = match.group(2)
        weight = match.group(3)
        result[key]["objects"].append({
            "text": link,
            "alt": alt,
            "weight": int(weight)
        })
        continue

    raise ValueError("Unknown line: " + line)

with open("src/links.json", "w") as fp:
    json.dump(result, fp)