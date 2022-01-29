# backup all of my saved Desmos graphs

from requests_html import HTMLSession
import html
import json
import latex_parser
import datetime
import os


def download_graph(graph_id: str):
    url = f'https://www.desmos.com/calculator/{graph_id}'
    r = HTMLSession().get(url)
    if r.status_code != 200:
        print(r, url)
    body = r.html.find('body', first='True')
    data = body.attrs['data-load-data']
    data = json.loads(data)
    return data['graph']


def get_representative_equation(expressions: dict):
    latex_list = latex_parser.get_all_latex(expressions)
    longest = ""
    max_value = -float('inf')
    for latex in latex_list:
        value = latex_parser.rank_latex(latex)
        if value > max_value:
            longest = latex
            max_value = value
    return longest.strip('$')


# a list of my Desmos graphs obtained using desmos_get_id.js
with open("desmos/graphs_id.json", "r") as fp:
    graphs = json.load(fp)


# contents of index.html
index = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>List of my saved Desmos graphs</title>
    <link rel="icon" href="https://harry7557558.github.io/logo.png" />

    <meta name="description" content="List of my saved Desmos graphs" />
    <meta name="keywords" content="harry7557558, Desmos, graph" />
    <meta name="robots" content="index, follow" />

    <script id="mathjax-config-script" type="text/x-mathjax-config">MathJax.Hub.Config({tex2jax:{inlineMath:[["$","$"]],preview:"none"},"fast-preview":{disabled:true},AssistiveMML:{disabled:true},menuSettings:{inTabOrder:false},messageStyle:"simple",positionToHash: false});</script>
    <script type="text/javascript" id="MathJax_src" async="" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
    <style>.graph{display:block;margin:10px;padding:10px;border-bottom:1px solid gray}img{height:240px;display:inline-block;margin:0 30px 0 0}.description{display:inline-block;vertical-align:top;margin:0}h1{margin:16px 0 10px;font-size:32px}h2{margin:16px 0 10px;font-size:28px}.created{margin:0;font-size:16px;color:#222}.equation{margin:24px 0;font-size:20px}a{font-size:16px;padding:0 2px;text-decoration:none}a:hover{text-decoration:underline}</style>
</head>
<body>
    <div style="margin:20px;">
        <h1>List of my saved Desmos graphs</h1>
        <p class="created">Harry Chen - Updated {%CURRENT_DATE%}</p>
        <div><br/></div>
        <hr/>
    </div>""".replace('{%CURRENT_DATE%}', datetime.datetime.now().strftime("%Y/%m/%d"))


# go through the list to download graphs
for graph_id in graphs:
    print(graph_id, end=' - ')

    # load graph
    filename = f"desmos/graphs/{graph_id}.json"
    if os.path.isfile(filename):
        with open(filename, 'r') as fp:
            graph = json.load(fp)
        print("loaded from file", end=' - ')
    else:
        graph = download_graph(graph_id)
        with open(filename, 'w') as fp:
            json.dump(graph, fp)
        print("downloaded", end=' - ')

    equation = html.escape(get_representative_equation(graph))

    # add graph to the index
    content = f"""<div class="graph">
        <img src="{graph['thumbUrl']}" />
        <div class="description">
            <h2>{graph['title']}</h2>
            <p class="created">{graph['created']}</p>
            <p class="equation" title="This equation is automatically selected from the list of expressions.">$${equation}$$</p>
            <p class="links">
                <a href="https://www.desmos.com/calculator/{graph_id}">Desmos</a>
                <a href="./graphs/{graph_id}.json">JSON</a>
            </p>
        </div>
    </div>"""
    index += content

    print("complete", end='\n')


index += """
<div style="margin:10px"><br/>
    <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0;height:inherit" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
<br/><br/><br/></div>
</body></html>"""

open('desmos/index.html', "wb").write(bytearray(index, 'utf-8'))
