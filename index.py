# a commentless Python source to generate unlisted.html

import os

root = os.path.dirname(__file__)

def getFileSize(path):
    n = os.path.getsize(path)
    if n<1000: return str(n)+'bytes'
    if n<1000000: return ("%.1f"%(n/2**10)).rstrip('.0')+'KB'
    return ("%.1f"%(n/2**20)).rstrip('.0')+'MB'

def getExtension(path):
    ext = os.path.splitext(path)[1]
    return ext.lstrip('.').lower()

def indexDirectory(_dir, web_only=False, trunc=-1,name=''):
    if trunc==-1:
        _dir = _dir.replace('\\','/')
        if _dir[-1]!='/': _dir += '/'
        trunc = len(_dir)-1
    ls = [f for f in os.listdir(_dir) if f[0]!='.']
    files = [_dir+f for f in ls if os.path.isfile(_dir+f)]
    dirs = [_dir+f for f in ls if os.path.isdir(_dir+f)]
    dirs_content = [indexDirectory(path+'/',web_only=web_only,trunc=trunc,name=name) for path in dirs]
    html = ""
    for i in range(len(dirs)):
        if dirs_content[i]=='': continue
        html += "<div class='dirname'>"+name+dirs[i][trunc:]+"</div>"
        html += "<div class='dir'>"+dirs_content[i]+"</div>"
    if len(files):
        html += "<table>"
        for fn in files:
            ext = getExtension(fn)
            if web_only and ['htm','html','js','css'].count(ext)==0:
                continue
            html += "<tr>"
            html += "<td class='file' type='"+ext+"'>"+name+fn[trunc:]+"</td>"
            html += "<td>"+getFileSize(fn)+"</td>"
            html += "<td>"+ext+"</td>"
            html += "</tr>"
        html += "</table>"
    if html.find("class='file'")==-1:
        return ''
    return html


additional_repos = [
    ['Graphics','D:\\Coding\\Github\\Graphics\\'],
    ['miscellaneous','D:\\Coding\\Github\\miscellaneous']
    ]

site_content = indexDirectory(root)
additional_contents = ["<div class='dirname'><i>"+s[0]+"</i></div>"
                       + "<div class='dir'>"+indexDirectory(s[1],web_only=True,name='/<i>'+s[0]+'</i>')+"</div>"
                       for s in additional_repos]

content = """<!doctype html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Harry Chen - unlisted</title>
    <meta name="robots" content="noindex, nofollow" />
    <link rel="icon" href="./logo.png" />
    <style>body{margin:10px 10px 40px 10px}div,table{margin-left:40px}td{padding-right:16px}span{padding-left:20px}a{color:#000}.htm,.html{color:blue}.js{color:#ff4500}.css{color:#006400}.png,.jpg,.svg,.ico,.webp{color:#8b008b}.md,.txt{text-decoration:none}</style>
    <script>
        window.onload = function () {
            var root = String(document.URL);
            root = root.replace(/\/unlisted.html$/, '');
            var paths = document.getElementsByClassName('file');
            for (let f of paths) {
                if (f.innerHTML == '/unlisted.html') continue;
                f.innerHTML = "<a href='" + root + f.innerHTML.replace('<i>','').replace('</i>','') + "'>" + f.innerHTML + "</a>";
                f.children[0].setAttribute('class', f.getAttribute('type'));
            }
            var f = document.getElementById('root');
            f.innerHTML = "<a href='" + root + "/index.html'>" + root + "</a>";
        }
    </script>
</head>
<body>
    <div id="root" style="margin-left:0;font-size:20px;margin-bottom:5px;"></div>
    """ + site_content + ''.join(additional_contents) + """
</body>
</html>"""

fp = open("unlisted.html","wb")
fp.write(bytearray(content,'utf-8'))
fp.close()



