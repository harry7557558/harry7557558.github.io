import urllib.parse
import subprocess
import os

# Update index files


def run_module(name):
    print("Running", name)
    __import__(name)


if 1:
    run_module("desmos.preview")
    run_module("shadertoy.preview")
    run_module("src.tojson-quotes")


# Generate unlisted.html


root = os.path.dirname(__file__).replace('\\', '/')


def getFileSize(path):
    n = os.path.getsize(path)
    if n < 1000:
        return str(n)+'&nbsp;bytes'
    if n < 1000000:
        return ("%.1f" % (n/2**10)).rstrip('.0')+'&nbsp;KB'
    return ("%.1f" % (n/2**20)).rstrip('.0')+'&nbsp;MB'


def getExtension(path):
    ext = os.path.splitext(path)[1]
    return ext.lstrip('.').lower()


def getGitTrackedFiles(_dir):
    print("Tracking", _dir)
    files = subprocess.run(
        #['git', 'ls-tree', '--full-tree', '--name-only', '-r', 'HEAD', '-z'],
        ['git', 'ls-files', '-z'],
        stdout=subprocess.PIPE,
        cwd=_dir
    ).stdout.split(b'\0')
    files = [file.decode('utf-8') for file in files]
    result = set({})
    for file in files:
        file = _dir + '/' + file
        result.add(file)
        slash_pos = -1
        while True:
            slash_pos = file.find('/', slash_pos+1)
            if slash_pos == -1:
                break
            dirname = file[:slash_pos]
            # if dirname not in result:
            #     print(dirname)
            result.add(dirname)
    return result


def indexDirectory(_dir, web_only=False, trunc=-1, name='', tracked_list: set = None):
    if tracked_list is None:
        tracked_list = getGitTrackedFiles(_dir)
        # print(tracked_list)
    if trunc == -1:
        _dir = _dir.replace('\\', '/')
        if _dir[-1] != '/':
            _dir += '/'
        trunc = len(_dir)-1
    if os.path.isfile(_dir+'.gitignore'):
        fp = open(_dir+'.gitignore', 'r')
        for line in fp:
            if line.strip() == '*':
                return ""
    if os.path.isfile(_dir+'.siteignore'):
        return ""
    ls = [f for f in sorted(os.listdir(_dir)) if
          _dir+f in tracked_list and not f.startswith('.')]
    files = [_dir+f for f in ls if os.path.isfile(_dir+f)]
    dirs = [_dir+f for f in ls if os.path.isdir(_dir+f)]
    dirs_content = [indexDirectory(
        path+'/', web_only=web_only,
        trunc=trunc, name=name, tracked_list=tracked_list
    ) for path in dirs]
    content = ""
    for i in range(len(dirs)):
        if dirs_content[i] == '':
            continue
        path = f"/<i>{name}</i>"*(name != "") + f"{dirs[i][trunc:]}"
        content += "<div class='dirname'>"+path+"</div>\n"
        content += "<div class='dir'>\n" + \
            dirs_content[i].replace('\n', '\n    ')+"\n</div>\n"
    if len(files):
        is_root = root.strip('/') == _dir.strip('/')
        content += "    <table" + " style='margin-left:0'"*is_root + ">\n"
        for fn in files:
            ext = getExtension(fn)
            if web_only and ext not in ['htm', 'html', 'js', 'css', 'svg', 'pdf']:
                continue
            content += "    <tr>"
            path = urllib.parse.quote(name+fn[trunc:])
            displaypath = f"/<i>{name}</i>"*(name != "") + f"{fn[trunc:]}"
            if ext in ['py', 'cpp', 'h', 'hpp', 'glsl', 'md', 'yml']:
                path = "src/text-preview.html#" + path
            path = path.lstrip('/')
            content += f"<td class='file'><a href='{path}' class='{ext}'>{displaypath}</a></td>"
            content += f"<td>{getFileSize(fn)}</td>"
            content += f"<td>{ext}</td>"
            content += "</tr>\n"
        content += "</table>"
    if content.find("class='file'") == -1:
        return ''
    return content


additional_repos = [
    # ['harry7557558', '../harry7557558'],
    ['Graphics', '../Graphics'],
    ['miscellaneous', '../miscellaneous'],
    ['spirulae', '../spirulae'],
    ['AVI3M-CPT', '../AVI3M-CPT'],
    ['AVI4M-ISP', '../AVI4M-ISP'],
    ['engsci-2t6', '../engsci-2t6'],
]

site_content = indexDirectory(root, web_only=True)
additional_contents = ["<div class='dirname'><i>/"+s[0]+"</i></div>"
                       + "<div class='dir'>" +
                       indexDirectory(s[1], web_only=True,
                                      name=s[0])+"</div>"
                       for s in additional_repos]

content = """<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Harry Chen - unlisted</title>
    <meta name="description" content="This is the index of an insane website created by an insane person." />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="./favicon.ico" />
    <style>
        body{margin:0.5em}
        div>div,table{margin-left:2em}td{padding-right:1em}span{padding-left:1em}
        .dirname{font-size:1.2em}table{font-size:1em}
        a{color:#aaa}
        .htm,.html{color:blue}
        .js{color:#ff4500}
        .css{color:#006400}
        .png,.jpg,.svg,.ico,.gif,.webp,.webm,.mp4{color:#8b008b}
        .json{color:#565}
        .md,.txt{color:#222}
    </style>
</head>
<body>
    """ + site_content + ''.join(additional_contents) + """
    <div><br/><div>
</body>
</html>"""

fp = open("unlisted.html", "wb")
fp.write(bytearray(content, 'utf-8'))
fp.close()
