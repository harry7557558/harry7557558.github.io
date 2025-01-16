# backup all of my saved Desmos graphs

import requests
import re
import html
import json
import datetime
import dateutil.parser
import os



# contents of index.html
index = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>List of my projects</title>
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
        .highlight{margin:-0.5em 0 0.8em 0;font-size:1.2em;font-weight:bold;color:darkred}
        .created{margin:0;font-size:1em;color:#555}
        .equation{margin:1.5em 0;font-size:1.25em;overflow:hidden;max-width:100%}
        p .MathJax_SVG, p .MathJax_Display{display:block;max-width:100%;height:auto}
        p svg{max-width:100%;height:auto}
        @media only screen and (max-width: 740px) {
            .image-container{display:block;width:100%;margin:0.5em 0;padding:0;}
            .graph-thumbnail{width:100%;max-width:15em;margin:0}
            .info{display:block;width:100%}
            .equation{font-size:1.0em}
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

    try:
        date = datetime.datetime.strptime(
            graph['created'], "%a, %d %b %Y %H:%M:%S GMT")
    except:
        date = dateutil.parser.isoparse(graph['created'])
    date = date.strftime("%Y/%m/%d")
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
    highlight = ""
    if graph_id in highlights:
        message = highlights[graph_id]['message']
        highlight = f"<p class=\"highlight\">{message}</p>"

    # add graph to the index
    content = f"""<div class="graph">
        <div class="image-container">
            <a href="https://www.desmos.com/{graph_id}"><img class="graph-thumbnail"
                src="{graph['thumbUrl']}" alt="{graph['title']}" loading="lazy" /></a>
        </div>
        <div class="info">
            <h2>{graph['title']}</h2>{highlight}
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
        <span>(Also check out my
        <a href="https://github.com/harry7557558/desmos-to-3d-model">Desmos to 3D model tool</a>,
        <a href="https://spirulae.github.io/">function grapher</a>, and
        <a href="/shadertoy/">Shadertoy list</a>
        :)</span>
        <br/><br/>
    </div>
</body></html>"""


filename = 'desmos/index.html'
original = open(filename, 'rb').read().decode('utf-8')
r_date = r'\d{4}/\d{2}/\d{2}'
if re.sub(r_date, '', original) != re.sub(r_date, '', index):
    open(filename, "wb").write(bytearray(index, 'utf-8'))
