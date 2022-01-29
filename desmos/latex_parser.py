import json
from multiprocessing.sharedctypes import Value


def split_latex(latex: str) -> list[str]:
    """Split a LaTeX string to a list of segments
        latex must start and end with '$'
    """
    result = []
    word = ""
    for c in latex:
        if c == '\\':
            if word not in ["", "\\left", "\\right"]:
                if word != "":
                    result.append(word)
                word = ""
            word += c
        elif c.isalpha():
            if word.startswith('\\'):
                word += c
            else:
                assert word == ""
                result.append(c)
        elif c.isnumeric():
            if word != "":
                result.append(word)
                word = ""
            result.append(c)
        elif c in "\{\}":
            if word in ["\\left\\", "\\right\\"]:
                result.append(word + c)
                word = ""
            else:
                if word != "":
                    result.append(word)
                word = ""
                result.append(c)
        elif c in "()[]<>|":
            if word in ["\\left", "\\right"]:
                result.append(word + c)
                word = ""
            else:
                result.append(word)
                word = ""
                result.append(c)
        elif c == ' ':
            if word == "\\":
                result.append(word + c)
                word = ""
            else:
                result.append(word)
                word = ""
        else:
            # print(c, end='')  # $+-=^_,.
            if word != "":
                result.append(word)
                word = ""
            result.append(c)
    return result


def latex_splitted_to_tree(segments: list[str]) -> dict:
    """Construct a tree from the result of split_latex(), O(N^2) worst case"""

    # find and remove brackets
    BRACKETS = [
        ('$$', '$$'),
        ('$', '$'),
        ('\\left\\{', '\\right\\}'),
        ('\\left[', '\\right]'),
        ('\\left(', '\\right)'),
        ('\\left|', '\\right|'),
        ('\\left<', '\\right>'),
        ('{', '}'),
    ]
    if len(segments) < 2:
        raise ValueError("Elements not bracketed")
    for brackets in BRACKETS + [(None, None)]:
        if segments[0] == brackets[0] and segments[-1] == brackets[1]:
            segments = segments[1:len(segments)-1]
            break
    if brackets == (None, None):
        raise ValueError("Elements not bracketed")

    # interpret contents
    BRACKETS_L = [br[0] for br in BRACKETS]
    BRACKETS_R = [br[1] for br in BRACKETS]
    contents = []
    d = 0
    while d < len(segments):
        if segments[d] in BRACKETS_L:
            br_l = segments[d]
            br_r = BRACKETS_R[BRACKETS_L.index(br_l)]
            count = 1
            d += 1
            subtree_contents = [br_l]
            while count > 0:
                if d >= len(segments):
                    raise ValueError("Too many left brackets.")
                if segments[d] == br_r:
                    count -= 1
                elif segments[d] == br_l:
                    count += 1
                subtree_contents.append(segments[d])
                d += 1
            subtree = latex_splitted_to_tree(subtree_contents)
            contents.append(subtree)
        elif segments[d] in BRACKETS_R:
            raise ValueError("Too many right brackets.")
        else:
            contents.append(segments[d])
            d += 1

    # return
    return {
        "brackets": brackets,
        "contents": contents
    }


def tree_to_html(tree: dict, scale: float) -> tuple[str, float, float]:
    """Return the HTML string, approximate width and height"""

    def span(cx: float, cy: float, rx: float, ry: float, html: str) -> str:
        w = 2.0 * rx
        h = 2.0 * ry
        x = cx - rx
        y = cy - ry
        return f"<span style='position:absolute;display:block;left:{x}em;top:{y}em;width:{w}em;height:{h}em;font-size:{scale}em'>{html}</span>"

    if type(tree) == dict:
        brackets = tree['brackets']
        contents = tree['contents']
    else:
        brackets = ("{", "}")
        contents = [tree]
    elements = []
    d = 0
    while d < len(contents):
        elem = contents[d]
        if type(elem) == dict:
            elements.append(tree_to_html(elem, scale))
            d += 1
        elif elem == "\\frac":
            assert type(contents[d+1]) == dict
            assert type(contents[d+2]) == dict
            html1, w1, h1 = tree_to_html(contents[d+1], 1.0)
            html2, w2, h2 = tree_to_html(contents[d+2], 1.0)
            w = max(w1, w2)
            h = h1 + h2
            html = span(0.5*w, 0.5*h1, 0.5*w1, 0.5*h1, html1)
            html += span(0.5*w, h1+0.5*h2, 0.5*w2, 0.5*h2, html2)
            elements.append((html, w, h))
            d += 3
        elif elem in ['^', '_']:
            html1, w, h = tree_to_html(contents[d+1], max(0.6*scale, 0.5))
            h0 = 0.2 if elem == '^' else 0.8
            html = span(0.5*w, h0, 0.5*w, 0.5*h, html1)
            elements.append((html, w, h))
            d += 2
        elif elem == "\\operatorname":
            assert type(contents[d+1]) == dict
            html, w, h = tree_to_html(contents[d+1], scale)
            elements.append((html, w, h))
            d += 2
        elif elem in ["\\cos", "\\sin", "\\tan", "\\csc", "\\sec", "\\cot",
                      "\\sinh", "\\cosh", "\\tanh", "\\csch", "\\sech", "\\coth",
                      "\\arcsin", "\\arccos", "\\arctan",
                      "\\arcsinh", "\\arccosh", "\\arctanh",
                      "\\abs", "\\sign", "\\min", "\\max", "\\mod", "\\exp", "\\log", "\\ln"]:
            funname = elem.lstrip('\\')
            html = funname
            w = 0.5*scale*len(funname)
            h = 1.0*scale
            elements.append((html, w, h))
            d += 1
        elif elem == "\\sqrt":
            assert type(contents[d+1]) == dict
            if contents[d+1]['brackets'] == ('[', ']'):
                html1, w1, h1 = tree_to_html(
                    contents[d+1], max(0.6*scale, 0.5))
                d += 1
            else:
                html1, w1, h1 = "", 0.0, 0.0
            assert type(contents[d+1]) == dict
            html2, w2, h2 = tree_to_html(contents[d+1], 1.0*scale)
            html = span(0.5*w1, 0.2, 0.5*w1, 0.5*h1, html1)
            w = w1
            html += span(w+0.5*scale, 0.5*scale, 0.5*scale, 0.5*scale, "√")
            w += scale
            html += span(w+0.5*w2, 0.6*h2, 0.5*w2, 0.5*h2, html2)
            elements.append((html, w+w2, 1.2*h2))
            d += 1
        elif elem in ["\\sum", "\\prod", "\\int"]:
            map_ = {
                "\\sum": '∑', "\\prod": '∏', "\\int": '∫'
            }
            html = map_[elem]
            w = 0.5*scale
            h = 1.0*scale
            elements.append((html, w, h))
            d += 1
        elif elem in ['+', '-', '=', '<', '>', '\\lt', '\\gt', '\\le', '\\ge']:
            map_ = {
                '\\lt': '<', '\\gt': '>', '\\le': '≤', '\\ge': '≥'
            }
            if elem in map_:
                elem = map_[elem]
            html = elem
            w = 1.0*scale
            h = 1.0*scale
            elements.append((html, w, h))
            d += 1
        elif elem == "\\cdot":
            html = "·"
            w = 0.5*scale
            h = 1.0*scale
            elements.append((html, w, h))
            d += 1
        else:  # alphanumeric, greek letters, special characters
            greeks = {
                '\\pi': 'π', '\\phi': 'φ', '\\theta': 'θ',
                '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ',
                '\\lambda': 'λ', '\\eta': 'η', '\\mu': 'μ',
                '\\rho': 'ρ', '\\sigma': 'σ', '\\omega': 'ω'
            }
            if elem in greeks:
                elem = greeks[elem]
            html = elem
            w = 0.5*scale
            h = 1.0*scale
            elements.append((html, w, h))
            d += 1

    full_html = ""
    width = 0.0
    height = 0.0
    for (html, w, h) in elements:
        height = max(height, h)
    if '$' not in brackets[0] and '{' not in brackets[0]:
        w = 0.5*height
        full_html += span(width+0.5*w, 0.5*height, 0.5*w, 0.5*height,
                          brackets[0].lstrip("\\left"))
        width += w
    for (html, w, h) in elements:
        full_html += span(width+0.5*w, 0.5*height, 0.5*w, 0.5*h, html)
        width += w
    if '$' not in brackets[1] and '}' not in brackets[1]:
        w = 0.5*height
        full_html += span(width+0.5*w, 0.5*height, 0.5*w, 0.5*height,
                          brackets[1].lstrip("\\right"))
        width += w

    return (full_html, width, height)


def get_latex_size(latex: str) -> tuple[float, float]:
    """Get the approximate width and height of a LaTeX expressions when rendered"""
    tree = latex_splitted_to_tree(split_latex(latex))
    html, w, h = tree_to_html(tree, 1.0)
    return (w, h)


def rank_latex(latex: str) -> float:
    """Rank the goodness of a LaTeX equation for display, higher is better"""
    w, h = get_latex_size(latex)
    return min(40.0*(h/w**0.5), 5.0*w**0.5)


def get_all_latex(expressions: dict) -> list[str]:
    """Get a list of LaTeX expressions in a Desmos expressions list
        Does not include bounds and steps of parametric curves and sliders
    """
    latex_list = []
    if type(expressions) is dict:
        for (key, val) in expressions.items():
            if key == 'latex':
                latex_list.append('$'+val+'$')
            else:
                latex_list += get_all_latex(val)
    elif type(expressions) is list:
        for expr in expressions:
            latex_list += get_all_latex(expr)
    return latex_list


def _debug_write_html(graph: dict, filename: str) -> None:
    latex_list = get_all_latex(graph)
    htmls = ""
    for latex in latex_list:
        tree = latex_splitted_to_tree(split_latex(latex))
        html, w, h = tree_to_html(tree, 1.0)
        value = rank_latex(latex)
        htmls += f"{round(value)}<div style='margin:0 2em;position:relative;width:{w}em;height:{h}em;background-color:#eee'>{html}</div>"
    with open(filename, 'a') as fp:
        fp.write(htmls)


def _debug_all():
    with open("desmos/graphs_id.json", "r") as fp:
        graphs = json.load(fp)
    output_filename = "D://.html"
    with open(output_filename, 'w') as fp:
        fp.write('')  # clear
    for graph_id in graphs:
        filename = f"desmos/graphs/{graph_id}.json"
        with open(filename, 'r') as fp:
            graph = json.load(fp)
        _debug_write_html(graph, output_filename)


if __name__ == "__main__":
    _debug_all()
