import re
import json

# paste from Google docs
QUOTES = """
SELF (0.4)
Sometimes I dream of becoming a fairy, or a mermaid… or some sort of creature. (3)
I wish I could be a child forever. (2)
Don’t like to meet people due to certain <del>mental&nbsp;illness</del>. (1)
Socializing is so hard for me. (2)
I am both aggressive and passive, with both arrogance and inferiority. (1)
Sometimes I think too much. (1)
Along the way, we have created so much trash. (1)
Life is suffering, I wanna die. (1)
I am a human, and you are a bot. I treat you with respect and kindness like I want to be treated. (1)
Would you rather be able to fly, or have the ability to live in water? (2)
Would you rather work harder, or work smarter? (2)
I do strange things to attain people’s attention, get mocked by others, and realize how stupid I was. (1)
To choose good, to choose evil, or not to choose. (2)
Don’t jump into hot water. (1)
PEOPLE (0.1)
Lorem ipsum dolor sit amet, consectetur adipiscing elit. (1)
To live in the Nacirema world, you must become a Nacirema. (1)
If there were an alien civilization, would their society be as strange as ours? (3)
All humans are created equally, but not everyone has the same privilege. (2)
Be a man, do things you have to do, things you like to do, things you don’t want to do. (1)
Humans are evil creatures. (1)
SHORT (0.2)
A = {x | x ∉ A} (1)
404 Server Not Found (1)
Natural Selection (1)
Local Extrema (1)
Homo sapiens (1)
Generative Adversarial Network (1)
Mesh Generation (1)
Theological Determinism (1)
Unfriending Notes (1)
Approval Seeking Behavior (1)
To-do List (1)
DISNEY: (0.3)
Out of the sea, wish I could be, part of your world. -&nbsp;Ariel, <i>The&nbsp;Little&nbsp;Mermaid</i> (1)
Bittersweet and strange, finding you can change, learning you were wrong. -&nbsp;<i>Beauty&nbsp;and&nbsp;the&nbsp;Beast</i> (1)
All that time never even knowing, Just how blind I’ve been. -&nbsp;Rapunzel, <i>I&nbsp;See&nbsp;the&nbsp;Light</i> (1)
And at last I see the light, and it's like the fog has lifted. -&nbsp;Rapunzel, <i>I&nbsp;See&nbsp;the&nbsp;Light</i> (1)
Do you want to build a snowman? (1)
Don't let them in, don't let them see. Be the good girl you always have to be. -&nbsp;Elsa, <i>Frozen</i> (1)
Here I stand in the light of day. -&nbsp;Elsa, <i>Let&nbsp;It&nbsp;Go</i> (1)
Just stay away and you'll be safe from me!  -&nbsp;Elsa,&nbsp;<i>Frozen</i> (3)
“Sometimes, who we wish we were, what we wish we could do… It’s just not meant to be.” -&nbsp;Sina,&nbsp;<i>Moana</i>(1)
I've been staring at the edge of the water, Long as I can remember, Never really knowing why.  -&nbsp;Moana, <i>How&nbsp;Far&nbsp;I’ll&nbsp;Go</i> (1)
To the place I know where I cannot go, where I long to be.  -&nbsp;Moana, <i>How&nbsp;Far&nbsp;I’ll&nbsp;Go</i> (1)
See the line where the sky meets the sea? It calls me.  -&nbsp;Moana, <i>How&nbsp;Far&nbsp;I’ll&nbsp;Go</i> (1)
All the time wondering where I need to be is behind me. I'm on my own, to worlds unknown.  -&nbsp;Moana (1)
Sometimes, the world seems against you.  -&nbsp;Tala,&ensp;<i>Moana</i> (1)
And the call isn't out there at all. It's inside me. It's like the tide, Always falling and rising. -&nbsp;Moana (1)
Some look for trouble, while others don't.  -&nbsp;Elsa, <i>Frozen&nbsp;II</i> (1)
Sometimes we come last, but we did our best. -&nbsp;Try&nbsp;Everything, <i>Zootopia</i> (1)
"""
LINKS = """
PROFILE (0.25)
https://github.com/harry7557558 | My Github (2)
https://www.shadertoy.com/user/harry7557558/sort=love | My Shadertoy (4)
https://dmoj.ca/user/Moana | Competitive programming (1)
https://harry7557558.github.io/desmos/index.html | Desmos graphs (4)
https://docs.google.com/document/d/1B7MUQFnMzgEBi-z0o2QsG-hHXcAOOsIbx4dPGrtVTNM/edit | List of quotes (1)
https://harry7557558.github.io/DMOJ-Render_Main/50pointer/%E2%80%8E/index.html | Click me! (1)
TOOLS (0.3)
https://harry7557558.github.io/notes/equations.html | Math notes (1)
https://harry7557558.github.io/notes/substitution.html | Math notes (1)
https://harry7557558.github.io/tools/chemequ.html | Chemical equation balancer (1)
https://harry7557558.github.io/tools/colorpicker.html | Color picker (1)
https://harry7557558.github.io/tools/complex.html | Complex grapher (1)
https://harry7557558.github.io/tools/complex_webgl.html | Complex grapher (1)
https://harry7557558.github.io/tools/mathjaxt.html | MathJax tester (1)
https://harry7557558.github.io/tools/matrixv.html | Matrix visualizer (1)
https://harry7557558.github.io/tools/svgpath.html | SVG path tester (1)
DEMO (0.45)
https://www.shadertoy.com/view/3dXfDr | Algebraic star (1)
https://www.shadertoy.com/view/WtcSR2 | Triangled (1)
https://www.shadertoy.com/view/wly3WG | Bézier fitting (1)
https://www.shadertoy.com/view/NsSSRK | Color schemes (1)
https://www.shadertoy.com/view/sljSzD | Gamma function (1)
https://www.shadertoy.com/view/sdVGWh | Nautilus shell (2)
https://www.shadertoy.com/view/tltSWr | I heart Fourier (1)
https://www.shadertoy.com/view/fsGGzh | Simplex terrain (1)
https://www.shadertoy.com/view/WtK3Ry | 2D path tracing (1)
https://www.desmos.com/calculator/fa7mwvpxb3 | Desmos 3D (1)
https://www.desmos.com/calculator/vu4xm0n9ir | Torus projection (1)
https://www.desmos.com/calculator/w4thzt4ofr | RYB color wheel (1)
https://www.desmos.com/calculator/x0gicefgnp | Desmos 3D (1)
https://www.desmos.com/calculator/z7zooq9zsh | Ammonite (3)
https://harry7557558.github.io/Graphics/raytracing/webgl_volume/index.html | Volume rendering (2)
https://harry7557558.github.io/art/dyed-egg/index.html | IdentiEgg (1)
https://harry7557558.github.io/Graphics/UI/webgl_test/webgl_test_02.html | WebGL test (1)
https://youtu.be/R4ocCMAbdDA | Grade 10 art project (1)
https://harry7557558.github.io/AVI3M-CPT/results/index.html | Grade 11 art project (1)
https://harry7557558.github.io/AVI4M-ISP/index.html | Grade 12 art project (2)
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
