# generate unlisted.html

import os

root = os.path.dirname(__file__).replace('\\','/')

def getFileSize(path):
    n = os.path.getsize(path)
    if n<1000: return str(n)+'bytes'
    if n<1000000: return ("%.1f"%(n/2**10)).rstrip('.0')+'KB'
    return ("%.1f"%(n/2**20)).rstrip('.0')+'MB'

def getExtension(path):
    ext = os.path.splitext(path)[1]
    return ext.lstrip('.').lower()

def indexDirectory(_dir):
    ls = [f for f in os.listdir(_dir) if f[0]!='.']
    files = [_dir+f for f in ls if os.path.isfile(_dir+f)]
    dirs = [_dir+f for f in ls if os.path.isdir(_dir+f)]
    html = ""
    for path in dirs:
        html += "<div class='dirname'>"+path[len(root):]+"</div>"
        html += "<div class='dir'>"+indexDirectory(path+'/')+"</div>"
    if len(files):
        html += "<table>"
        for fn in files:
            ext = getExtension(fn)
            html += "<tr>"
            html += "<td class='file' type='"+ext+"'>"+fn[len(root):]+"</td>"
            html += "<td>"+getFileSize(fn)+"</td>"
            html += "<td>"+ext+"</td>"
            html += "</tr>"
        html += "</table>"
    return html


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
            root = root.substring(0, root.indexOf('unlisted.html')).replace(/\/$/, '');
            var paths = document.getElementsByClassName('file');
            for (let f of paths) {
                if (f.innerHTML == '/unlisted.html') continue;
                f.innerHTML = "<a href='" + root + f.innerHTML + "'>" + f.innerHTML + "</a>";
                f.children[0].setAttribute('class', f.getAttribute('type'));
            }
            var f = document.getElementById('root');
            f.innerHTML = "<a href='" + root + "/index.html'>" + root + "</a>";
        }
    </script>
</head>
<body>
    <div id="root" style="margin-left:0;font-size:20px;margin-bottom:5px;"></div>
    """ + indexDirectory(root+'/') + """
</body>
</html>"""

fp = open("unlisted.html","wb")
fp.write(bytearray(content,'utf-8'))
fp.close()



