# backup all of my saved Desmos graphs

import requests
import re
import html
import json
import datetime
import os

try:
    import latex_parser
except:
    import desmos.latex_parser as latex_parser


def get_graph_info(graph_id: str):
    url = "https://www.desmos.com/" + graph_id
    req = requests.get(url)
    if req.status_code != 200:
        raise ValueError(f"Request returns {req.status_code}")
    content = req.content.decode('utf-8')
    matches = re.findall(r'data-load-data="([^\"]+?)"', content)
    if len(matches) == 0:
        raise ValueError(f"Graph contains no `data-load-data`.")
    info = html.unescape(matches[0])
    graph = json.loads(info)['graph']
    if "state" not in graph:
        state_url = graph['stateUrl']
        state_str = requests.get(state_url).content
        graph['state'] = json.loads(state_str)
    return graph


def get_representative_equation(expressions: dict):
    latex_list = latex_parser.get_all_latex(expressions)
    latex_list = latex_list[:1000]  # prevent stuck
    longest = ""
    max_value = -float('inf')
    for latex in latex_list:
        value = latex_parser.rank_latex(latex)
        if value > max_value:
            longest = latex
            max_value = value
    return longest.strip('$')


# https://github.com/harry7557558/bot7557558/blob/master/desmos.py

def get_graph_size_summary(state) -> str:
    """Generate a string of the size of the graph as a summary"""
    def format_plural(count: int, name: str) -> str:
        name += "s" * (count > 1)
        count_s = ""
        while count >= 1000:
            count_s = "," + "{:03d}".format(count % 1000) + count_s
            count //= 1000
        count_s = str(count) + count_s
        return count_s + "&nbsp;" + name

    # get size
    byte_count = len(bytearray(json.dumps(
        state, separators=(',', ':')), 'utf-8'))  # may vary
    expr_count, note_count, folder_count, table_count, img_count = [0]*5
    for expr in state['expressions']['list']:
        if 'type' not in expr:
            continue  # ??
        if expr['type'] == "expression" and 'latex' in expr:
            expr_count += 1
        if expr['type'] == "text" and 'text' in expr:
            note_count += 1
        if expr['type'] == "folder":
            folder_count += 1
        if expr['type'] == "table":
            table_count += 1
        if expr['type'] == "image":
            img_count += 1
    size_info = [format_plural(byte_count, "byte")]
    if expr_count != 0:
        size_info.append(format_plural(expr_count, "expression"))
    if note_count != 0:
        size_info.append(format_plural(note_count, "note"))
    if folder_count != 0:
        size_info.append(format_plural(folder_count, "folder"))
    if table_count != 0:
        size_info.append(format_plural(table_count, "table"))
    if img_count != 0:
        size_info.append(format_plural(img_count, "image"))

    # detect animation
    for expr in state['expressions']['list']:
        if 'type' not in expr or expr['type'] != "expression":
            continue
        if 'slider' in expr and 'isPlaying' in expr['slider'] \
                and expr['slider']['isPlaying'] is True:
            size_info.append("slider&nbsp;animation")
            break
    if 'ticker' in state['expressions'] and \
        'playing' in state['expressions']['ticker'] and \
            state['expressions']['ticker']['playing'] is True:
        size_info.append("ticker")

    size_info = " • ".join(size_info)
    return size_info


def get_graph_description(state) -> str:
    """Generate a description of the graph for preview purpose"""
    description = ""
    for expr in state['expressions']['list']:
        if 'type' not in expr:
            continue
        if expr['type'] == "expression" and 'latex' in expr:
            break
        if expr['type'] in ['table', 'image']:
            break
        if expr['type'] == "text" and 'text' in expr:
            description += expr['text'] + '\n\n'
    return description.strip()


# a list of my Desmos graphs obtained using desmos_get_id.js
with open("desmos/graphs_id.json", "r") as fp:
    graphs = json.load(fp)


# contents of index.html
index = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>List of my saved Desmos graphs</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link rel="icon" href="/favicon.ico" />
    <meta property="og:image" content="https://saved-work.desmos.com/calc_thumbs/production/z7zooq9zsh.png" />
    <link rel="image_src" href="https://saved-work.desmos.com/calc_thumbs/production/z7zooq9zsh.png" />
    <meta name="description" content="This page lists all of my saved Desmos graphs: 3D graphing, function art, math explorations, and more." />
    <meta name="keywords" content="harry7557558, Desmos, graph, function, art, 3D" />
    <meta name="robots" content="index, follow" />

    <script>
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$']],
                packages: { '[+]': ['color'] }
            },
            svg: {
                fontCache: 'global'
            },
            // options: { enableMenu: false }
        };
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
        onerror="alert('Failed to load MathJax.')"></script>

    <style>
        html,body{height:100%}
        body{font-family:'Times New Roman',serif}
        .graph{display:block;margin:0.5em;padding:1em;border-bottom:1px solid gray;}
        .image-container{display:table-cell;vertical-align:middle;width:15em;min-width:15em;height:100%;padding:0 2em 0 0}
        .graph-thumbnail{width:100%}
        .info{display:table-cell;vertical-align:top;margin:0;overflow:hidden;word-break:break-word}
        .description{white-space:pre-wrap}
        h1{margin:0.8em 0;font-size:2em}
        h2{margin:0.7em 0;font-size:1.75em}
        .created{margin:0;font-size:1em;color:#555}
        .equation{margin:1.5em 0;font-size:1.25em;overflow:hidden}
        @media only screen and (max-width: 740px) {
            .image-container{display:block;width:100%;margin:0.5em 0;padding:0;}
            .graph-thumbnail{width:100%;max-width:15em;margin:0}
            .info{display:block;width:100%}
            .equation{overflow:scroll}
        }
        .links a{font-size:1em;padding:0 0.1em;text-decoration:none;color:#06c}
        a:hover{text-decoration:underline}
    </style>
</head>
<body>
    <div style="margin:1.2em 1.2em 0 1.2em">
        <h1>List of my saved Desmos graphs</h1>
        <p class="created">Harry Chen (<a href="https://github.com/harry7557558">harry7557558</a>) - Updated {%CURRENT_DATE%}</p>
        <div><br/></div>
        <hr/>
    </div>""".replace('{%CURRENT_DATE%}', datetime.datetime.now().strftime("%Y/%m/%d"))


# go through the list to download graphs
graph_blocks = []
for graph_id in graphs:

    # load graph
    filename = f"desmos/graphs/{graph_id}.json"
    if os.path.isfile(filename):
        with open(filename, 'r') as fp:
            graph = json.load(fp)
    else:
        graph = get_graph_info(graph_id)
        with open(filename, 'w') as fp:
            json.dump(graph, fp, separators=(',', ':'))
        print(graph_id, '-', "downloaded")

    date = datetime.datetime.strptime(
        graph['created'], "%a, %d %b %Y %H:%M:%S GMT").strftime("%Y/%m/%d")
    size_summary = get_graph_size_summary(graph['state'])
    description = get_graph_description(graph['state'])
    if len(description) > 256:
        description = description[:256] + "..."
    preview = ""
    if description != "":
        description = html.escape(description)
        # https://stackoverflow.com/a/6041965
        url_regex = r"((http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-]))"
        description = re.sub(url_regex, '<a href="\\1">\\1</a>', description)
        preview += f"""<p class="description">{description}</p>"""
    if len(description)+32*description.count('\n') < 128:
        equation = html.escape(get_representative_equation(graph))
        preview += f"""<p class="equation">$\\displaystyle{{{equation}}}$</p>"""

    # add graph to the index
    content = f"""<div class="graph">
        <div class="image-container">
            <a href="https://www.desmos.com/{graph_id}"><img class="graph-thumbnail"
                src="{graph['thumbUrl']}" alt="{graph['title']}" loading="lazy" /></a>
        </div>
        <div class="info">
            <h2>{graph['title']}</h2>
            <p class="created">{date} • {size_summary}</p>
            {preview}
            <p class="links">
                <a href="https://www.desmos.com/{graph_id}">Desmos</a>
                <a href="./graphs/{graph_id}.json">JSON</a>
            </p>
        </div>
    </div>"""
    graph_blocks.append({
        'date': date,
        'content': content
    })

for block in sorted(graph_blocks, key=lambda _: _['date'], reverse=True):
    index += block['content']


index += """
    <div style="margin:0.6em"><br/>
        Unless otherwise stated, you are free to share and adapt graphs listed on this page, as long as appropriate attribution is given.
        <br/><br/>
        <span>For information on how to generate a page like this, check out this <a href="https://github.com/harry7557558/harry7557558.github.io/tree/master/desmos#readme">GitHub README</a>.</span>
        <br/>
        <span>(Also check out my <a href="/shadertoy/">Shadertoy list</a> and <a href="https://spirulae.github.io/">function grapher</a> :)</span>
        <br/><br/>
    </div>
</body></html>"""


filename = 'desmos/index.html'
original = open(filename, 'rb').read().decode('utf-8')
r_date = r'\d{4}/\d{2}/\d{2}'
if re.sub(r_date, '', original) != re.sub(r_date, '', index):
    open(filename, "wb").write(bytearray(index, 'utf-8'))
