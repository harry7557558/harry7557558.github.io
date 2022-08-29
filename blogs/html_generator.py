import os
import markdown
blogs = [f for f in os.listdir() if os.path.isdir(f)]

template = open("template.html").read()

for blog in blogs:
    files = [blog+'/'+f for f in os.listdir(blog) if f[-3:]=='.md']
    md = ""
    for filename in files:
        md += open(filename).read()+'\n\n\n\n'
    md = md.replace('\\','&#92;').replace('_','&#95;')

    html = markdown.markdown(md)

    html = template.replace("{%CONTENT%}",html)
    open(blog+'/index.html','w').write(html)
