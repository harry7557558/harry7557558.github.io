# backup all of my saved Desmos graphs

import json
import datetime
import bbcode
import re
import os


# https://github.com/harry7557558/bot7557558/blob/master/shadertoy.py

def minify_code(code: str):
    """Grabbed from Shadertoy implementation"""
    def isSpace(s):
        return s in [' ', '\t']

    def isLine(s):
        return s == '\n'

    def replaceChars(s):
        dst = ""
        isPreprocessor = False
        for i in range(len(s)):
            if s[i] == "#":
                isPreprocessor = True
            elif s[i] == "\n":
                if isPreprocessor:
                    isPreprocessor = False
                else:
                    dst += " "
                    continue
            elif s[i] in ["\r", "\t"]:
                dst += " "
                continue
            elif i < len(s) - 1 and s[i] == "\\" and s[i+1] == "\n":
                i += 1
                continue
            dst += s[i]
        return dst

    def removeEmptyLines(s):
        d = ""
        isPreprocessor = False
        for i in range(len(s)):
            if s[i] == '#':
                isPreprocessor = True
            isDestroyableChar = isLine(s[i])
            if isDestroyableChar and not isPreprocessor:
                continue
            if isDestroyableChar and isPreprocessor:
                isPreprocessor = False
            d += s[i]
        return d

    def removeMultiSpaces(s):
        dst = ""
        for i in range(len(s)):
            if isSpace(s[i]) and i == len(s) - 1:
                continue
            if isSpace(s[i]) and isLine(s[i-1]):
                continue
            if isSpace(s[i]) and isLine(s[i+1]):
                continue
            if isSpace(s[i]) and isSpace(s[i+1]):
                continue
            dst += s[i]
        return dst

    def removeSingleSpaces(s):
        dst = ""
        for i in range(len(s)):
            iss = isSpace(s[i])
            if i == 0 and iss:
                continue
            if i > 0:
                if iss and s[i-1] in ";,}{()+-*/?<>[]:=^%\n\r":
                    continue
            if i > 1:
                if iss and s[i-2:i] in ["&&", "||", "^^", "!=", "=="]:
                    continue
            if iss and s[i+1] in ";,}{()+-*/?<>[]:=^%\n\r":
                continue
            if i < len(s) - 2:
                if iss and s[i+1:i+3] in ["&&", "||", "^^", "!=", "=="]:
                    continue
            dst += s[i]
        return dst

    def removeComments(s):
        dst = ""
        state = 0
        i = 0
        while i < len(s):
            if i <= len(s)-2:
                if state == 0 and s[i:i+2] == "/*":
                    state = 1
                    i += 2
                    continue
                if state == 0 and s[i:i+2] == "//":
                    state = 2
                    i += 2
                    continue
                if state == 1 and s[i:i+2] == "*/":
                    dst += " "
                    state = 0
                    i += 2
                    continue
                if state == 2 and s[i] in "\r\n":
                    state = 0
                    i += 1
                    continue
            if state == 0:
                dst += s[i]
            i += 1
        return dst

    code = removeComments(code)
    code = replaceChars(code)
    code = removeMultiSpaces(code)
    code = removeSingleSpaces(code)
    code = removeEmptyLines(code)
    return code


def get_shader_description(shader) -> str:
    """Generate a description of the shader for preview
        Considers Shadertoy description and Shader comments"""
    description = ""
    return description


def get_shader_summary(shader) -> str:
    """Generate a string of the summary/preview of the shader"""
    info = shader['info']
    shader_id = info['id']
    title = info['name']
    author = info['username']
    date = datetime.datetime.fromtimestamp(int(info['date']))
    description = bbcode.render_html(info['description'])
    tags = ', '.join(info['tags'])
    views = info['viewed']
    likes = info['likes']
    status = {
        0: "private",
        1: "public",
        2: "unlisted",
        3: "public+api"
    }[info['published']]
    assert status != "private"  # no dumb mistake
    thumb_url = f"https://www.shadertoy.com/media/shaders/{shader_id}.jpg"

    # renderpass
    orders = ["Common", "Buffer A", "Buffer B",
              "Buffer C", "Buffer D", "Cube A", "Image", "Sound"]
    passes = []

    mains_count = {
        'mainImage': 0,
        'mainSound': 0,
        'mainVR': 0,
    }
    uniforms_count = {
        'iResolution': 0,
        'iTime': 0,
        'iTimeDelta': 0,
        'iChannelTime': 0,
        'iFrame': 0,
        'iMouse': 0,
        'iDate': 0,
        'iSampleRate': 0,
        'iChannelResolution': 0,
    }
    textures_count = {
        'buffer': 0,
        'texture': 0,
        'cubemap': 0,
        'video': 0,
        'music': 0,
        'musicstream': 0,
        'mic': 0,
        'webcam': 0,
        'volume': 0,
        'keyboard': 0,
    }

    for renderpass in shader['renderpass']:
        name = renderpass['name']
        name = name.replace("Buf ", "Buffer ")
        assert name in orders
        code = minify_code(renderpass['code'])
        open(".temp", "w").write(minify_code(code))  # so I can check for bug
        passes.append({
            "name": name,
            "chars": len(code)
        })
        words = re.sub(r"[^A-Za-z0-9_]+", ' ', code).strip()
        for word in words.split():
            if word in mains_count:
                mains_count[word] += 1
            if word in uniforms_count:
                uniforms_count[word] += 1
        for input in renderpass['inputs']:
            if input['type'] in textures_count:  # should be
                textures_count[input['type']] += 1

    if len(passes) == 1:
        passes_str = passes[0]['name'] + " • " + \
            f'<span class="chars">{passes[0]["chars"]}</span> chars'
    else:
        passes = sorted(passes, key=lambda rp: orders.index(rp['name']))
        passes_name_str = " • ".join([ps['name'] for ps in passes])
        passes_chars = [ps['chars'] for ps in passes]
        passes_chars_str = " + ".join(map(str, passes_chars)) + \
            f' = <span class="chars">{sum(passes_chars)}</span> chars'
        passes_str = passes_name_str + "｜" + passes_chars_str

    mains = [item[0] for item in mains_count.items() if item[1] > 0]
    uniforms = [item[0] for item in uniforms_count.items() if item[1] > 0]
    textures = [item[0] for item in textures_count.items() if item[1] > 0]
    ios = '｜'.join([' • '.join(s)
                    for s in [mains, uniforms, textures] if s != []])
    passes_str += '<br/>' + ios

    return {
        'shader_id': shader_id,
        'url': "https://www.shadertoy.com/view/" + shader_id,
        'published': date.strftime("%Y/%m/%d"),
        'title': title,
        'description': description,
        'preview_url': thumb_url,
        'tags': tags,
        'status': status,
        'renderpass': passes_str,
        'views': str(views),
        'likes': str(likes),
        'ratio': "{:.2f}".format(100.0 * likes / views)
    }


# Load downloaded shaders
with open("shadertoy/shaders.json", "r") as fp:
    shaders = json.load(fp)
    shaders.sort(key=lambda t: -t['info']['likes'])

# Header of index.html
index = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>List of my published Shadertoy shaders</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="icon" href="https://harry7557558.github.io/logo.png" />
    <meta property="og:image" content="https://www.shadertoy.com/media/users/harry7557558/profile.png" />
    <link rel="image_src" href="https://www.shadertoy.com/media/users/harry7557558/profile.png" />
    <meta name="description" content="This page lists all of my published Shadertoy shaders, which includes my experiments in rendering, modeling, data fitting, simulation, and art." />
    <meta name="keywords" content="harry7557558, Shadertoy, shader, GLSL, WebGL, function" />
    <meta name="robots" content="index, follow" />

    <style>
        html,body{height:100%}
        body{margin:0 0.5em;padding:0;font-family:'Times New Roman'}
        input,select,button{display:inline;vertical-align:middle}
        #chartjs-canvas-container{max-width:40em}
        #chartjs-canvas{width:100%;margin:1em 0;border:2px solid #bbb}
        hr{margin-block:1.0em}
        #container{display:inline;margin:0;padding:0}
        .shader{display:block;margin:0.5em;padding:0.5em 0;border-bottom:1px solid gray}
        .image-container{display:table-cell;vertical-align:middle;width:20em;padding:0 2em 0 0}
        .preview-container{display:inline-block;width:100%;margin:0 2em 0.5em 0;padding:0;text-decoration:none;touch-action:none}
        .preview{width:100%;height:auto;display:block;margin:0;position:absolute;left:0;top:0}
        .placeholder{position:relative;width:100%;z-index:-1;opacity:0.0}
        .info{display:table-cell;vertical-align:top;margin:-0.2em 0 0.5em;overflow:hidden;word-break:break-word}
        .title a{color:black;text-decoration:none}
        .title a:hover{text-decoration:underline}
        h1{margin:1em 0 0.8em;font-size:2em}
        h2{margin:0.5em 0;font-size:1.75em}
        p{line-height:1.5em}
        .summary{margin:0;font-size:1em;color:#555}
        @media only screen and (max-width: 740px) {
            .image-container{display:block;width:100%;max-width:20em;margin:0;padding:0;}
            .preview-container{display:block;width:100%;margin:0;padding:0}
            .info{display:block;width:100%}
        }
        a{text-decoration:none;color:#06c}
        a:hover{text-decoration:underline}
        .unlisted{display:none}
        .unlisted h2{font-style:italic}
        .vsc-controller{display:none}
    </style>
</head>
<body>
    <div style="margin:1.2em 0.8em 0">
        <h1>List of my published Shadertoy shaders</h1>
        <p class="summary">Harry Chen (<a href='https://www.shadertoy.com/user/harry7557558'>harry7557558</a>) - Updated {%CURRENT_DATE%}</p>
        <hr/>
        <span>
            Horizontal&nbsp;axis:&nbsp;<select id="chart-x-select"></select> ｜
            Vertical&nbsp;axis:&nbsp;<select id="chart-y-select"></select> ｜
            Line&nbsp;fit:&nbsp;<select id="line-fit-select"></select>
        </span>
        <br/>
        <div id="chartjs-canvas-container">
            <canvas id="chartjs-canvas"></canvas>
        </div>
        <br/>
        <p>
            Sort by <select id="sort-select"></select> ｜
            <input type="checkbox" id="unlisted-checkbox" /> show unlisted shaders
        </p>
        <hr/>
    </div>
    <div id="container">""".replace('{%CURRENT_DATE%}', datetime.datetime.now().strftime("%Y/%m/%d"))

# Go through the list of shaders
for shader in shaders:

    summary = get_shader_summary(shader)

    display_status = '• <span class="status">' + \
        summary['status'] + "</span>"
    if summary['status'] == 'public':
        display_status = '<span class="status" style="display:none">public</span>'

    img_classes = ['preview']
    if os.path.isfile(f"shadertoy/videos/{summary['shader_id']}.mp4"):
        img_classes.append("image-video-preview")
    image_preview = f"""<img class="{' '.join(img_classes)}" src="{summary['preview_url']}" alt="{summary['title']}" loading="lazy" />"""

    # add graph to the index
    content = f"""
        <div class="shader {summary['status'].replace('+', '-')}">
            <div class="image-container"><a class="preview-container" href="{summary['url']}" style="position:relative">
                {image_preview}
                <img class="preview placeholder" src="16x9_Transparent.png" alt="16x9_Transparent.png" />
            </a></div>
            <div class="info">
                <h2 class="title"><a href="{summary['url']}">{summary['title']}</a></h2>
                <p class="summary">
                    {summary['tags']} •
                    <span class="published">{summary['published']}</span>
                    {display_status}
                    <br/>
                    {summary['renderpass']}
                    <br/>
                    <span class="likes">{summary['likes']}</span> likes •
                    <span class="views">{summary['views']}</span> views •
                    <span class="ratio">{summary['ratio']}</span>% like
                </p>
                <p>{summary['description']}</p>
            </div>
        </div>"""
    index += content

# Footer of index.html
index += """
    </div>
    <div style="margin:0.6em"><br/>
        <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0;height:inherit" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />Unless otherwise stated, shaders on this page are licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
        <br/><br/>
        <span>For information on how to generate a page like this, check out <a href="https://github.com/harry7557558/harry7557558.github.io/tree/master/shadertoy#readme">GitHub</a>.</span>
        <br/>
        <span>(Also check out my <a href="/desmos/index.html">Desmos list</a> :)</span>
        <br/><br/>
    </div>
    <script src="script.js"></script>
</body></html>"""

open('shadertoy/index.html', "wb").write(bytearray(index, 'utf-8'))
