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
        return count_s + " " + name
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
<html>
<head>
    <meta charset="utf-8" />
    <title>List of my saved Desmos graphs</title>
    <link rel="icon" href="https://harry7557558.github.io/logo.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="List of my saved Desmos graphs" />
    <meta name="keywords" content="harry7557558, Desmos, graph" />
    <meta name="robots" content="index, follow" />

    <script id="mathjax-config-script" type="text/x-mathjax-config">MathJax.Hub.Config({tex2jax:{inlineMath:[["$","$"]],preview:"none"},"fast-preview":{disabled:true},AssistiveMML:{disabled:true},menuSettings:{inTabOrder:false},messageStyle:"simple",positionToHash: false,"HTML-CSS":{linebreaks:{automatic:false}}});</script>
    <script type="text/javascript" id="MathJax_src" async="" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
    <style>
        .graph{display:block;margin:0.5em;padding:0.5em;border-bottom:1px solid gray}
        img{height:15em;display:inline-block;margin:0 2em 0 0}
        .info{display:inline-block;margin:0;min-width:20em}
        .description{white-space:pre-wrap}
        h1{margin:1em 0;font-size:2em}
        h2{margin:0.7em 0;font-size:1.75em}
        .created{margin:0;font-size:1em;color:#222}
        .equation{margin:1.5em 0;font-size:1.25em}
        a{font-size:1em;padding:0 0.1em;text-decoration:none}a:hover{text-decoration:underline}
    </style>
</head>
<body>
    <div style="margin:1.2em;white-space:nowrap">
        <h1>List of my saved Desmos graphs</h1>
        <p class="created">Harry Chen (harry7557558) - Updated {%CURRENT_DATE%}</p>
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

    date = datetime.datetime.strptime(
        graph['created'], "%a, %d %b %Y %H:%M:%S GMT").strftime("%Y/%m/%d")
    size_summary = get_graph_size_summary(graph['state'])
    description = get_graph_description(graph['state'])
    if len(description) > 256:
        description = description[:256] + "..."
    preview = ""
    if description != "":
        preview += f"""<p class="description">{description}</p>"""
    if len(description)+32*description.count('\n') < 128:
        equation = html.escape(get_representative_equation(graph))
        preview += f"""<p class="equation">$\\displaystyle{{{equation}}}$</p>"""

    # add graph to the index
    content = f"""<div class="graph"><table><tr>
        <td><img src="{graph['thumbUrl']}" /></td>
        <td class="info">
            <h2>{graph['title']}</h2>
            <p class="created">{date} • {size_summary}</p>
            {preview}
            <p class="links">
                <a href="https://www.desmos.com/calculator/{graph_id}">Desmos</a>
                <a href="./graphs/{graph_id}.json">JSON</a>
            </p>
        </td>
    </tr></table></div>"""
    index += content

    print("complete", end='\n')


index += """
<div style="margin:0.6em"><br/>
    <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0;height:inherit" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
<br/><br/><br/></div>
</body></html>"""

open('desmos/index.html', "wb").write(bytearray(index, 'utf-8'))
