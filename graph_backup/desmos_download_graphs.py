# backup all of my Desmos graphs


# the two functions return the information and contents
# of a Desmos graph from its ID

def download_graph(ID):
    from requests_html import HTMLSession
    url = 'https://www.desmos.com/calculator/'+ID
    r = HTMLSession().get(url)
    if r.status_code!=200:
        print(r, url)
    body = r.html.find('body',first='True')
    data = body.attrs['data-load-data']
    data = __import__('json').loads(data)
    return data['graph']

def download_state(ID):
    import requests
    url = 'https://saved-work.desmos.com/calc-states/production/'+ID
    r = requests.get(url)
    if r.status_code!=200:
        print(r, url)
    return r.text


# get the longest latex equation from an object returned by download_graph()
def getEquation(obj):
    longest = ""
    if type(obj) is not dict:
        return longest
    for s in obj:
        if type(obj[s]) is dict:
            l = getEquation(obj[s])
            if 256>len(l)>len(longest): longest=l  # max 255 char
        if type(obj[s]) is list:
            for t in obj[s]:
                l = getEquation(t)
                if 256>len(l)>len(longest): longest=l
        if s=='latex':
            if 256>len(obj[s])>len(longest): longest=obj[s]
    return longest





# a list of my Desmos graphs obtained using desmos_get_id.js
Graphs = ["hvtbjw6rue","ktnucw466t","nudbqrxkti","7lr5htcel6","vu4xm0n9ir","w4wocwv0dw","ivasvrustk","nwoctkrg80","raeuahskxm","4vo8ccfuvp","hsp3ccmdhw","diuy6hrgw6","1z17yc5djh","zn9d68fqzt","btal70uvxv","l99tjopqcx","kmkcgt5eld","zyxas5zy8w","hznnunxnx6","ar8trp3g9s","nn29zfpyiq","bq5nc43zfh","59x14hqpt3","4omxg0mi1w","f9vwgan2ip","fa7mwvpxb3","dqsx3i3txz","gbji3acmwp","bzecuo9xix","hhoemjbsm5","px9ftgrzo4","ozmnil3v00","szky83xovy"]





# contents of index.html
index = """<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>List of my Desmos graphs</title>
    <link rel="icon" href="https://harry7557558.github.io/logo.png" />
    <script id="mathjax-config-script" type="text/x-mathjax-config">MathJax.Hub.Config({tex2jax:{inlineMath:[["$","$"]],preview:"none"},"fast-preview":{disabled:true},AssistiveMML:{disabled:true},menuSettings:{inTabOrder:false},messageStyle:"simple",positionToHash: false});</script>
    <script type="text/javascript" id="MathJax_src" async="" src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
    <style>.graph{display:block;margin:10px;padding:10px;border-bottom:1px solid gray}img{height:240px;display:inline-block;margin:0 30px 0 0}.description{display:inline-block;vertical-align:top;margin:0}h2{margin:16px 0 10px;font-size:28px}.time{margin:0;font-size:16px;color:#222}.equation{margin:24px 0;font-size:20px}a{font-size:16px;padding:0 2px;text-decoration:none}a:hover{text-decoration:underline}</style>
</head>
<body>
    <div style="margin:20px;">
        <h1>List of my saved Desmos graphs</h1>
        <p class="time">Updated {%CURRENT_DATE%}</p>
        <div><br/></div>
        <hr/>
    </div>""".replace('{%CURRENT_DATE%}', __import__('datetime').datetime.now().strftime("%Y/%m/%d"))

# go through the list and download graphs
for ID in Graphs:

    # download graph
    print(ID)
    info = download_graph(ID)
    state = download_state(ID)
    
    # save graph as HTML
    HTML = """<!DOCTYPE html>
<html><head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0" />
    <script src="https://www.desmos.com/api/v1.5/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>
    <title>{%TITLE%}</title>
    <link rel="image_src" href="https://saved-work.desmos.com/calc_thumbs/production/{%ID%}.png" />
    <link rel="icon" href="https://www.desmos.com/favicon.ico" type="image/x-icon">
    <style>body{margin:0;overflow:hidden}#header{position:absolute;display:block;left:0;right:0;top:0;margin:0;width:100%;height:46px;background-color:#2a2a2a;text-align:center}#title{display:block;text-align:center;color:#ddd;line-height:46px;height:100%}#svg-desmos{filter:drop-shadow(0 1px 1px #000);height:22px;fill:#ddd}#svg-desmos:hover{fill:#fff}#calculator{position:absolute;display:block;left:0;right:0;top:46px;bottom:0;margin:0;border:none;padding:0}</style>
</head><body>
    <div id="header"><div id="title"><a href="https://www.desmos.com/calculator/{%ID%}" target="_blank" style="position:relative;top:5px;" title="open in Desmos"><span><svg version="1.1" id="svg-desmos" xmlns=" http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 48 9.876" xml:space="preserve"><path d="M40.314 3.366c-.73-.752-1.634-1.136-2.681-1.136s-1.956.384-2.688 1.136a3.8 3.8 0 0 0-1.1 2.736 3.77 3.77 0 0 0 1.092 2.7c.728.745 1.637 1.127 2.701 1.127s1.969-.382 2.691-1.127a3.8 3.8 0 0 0 1.09-2.713 3.78 3.78 0 0 0-1.105-2.723zm-2.681.187c.662 0 1.223.251 1.71.757a2.51 2.51 0 0 1 .723 1.801 2.45 2.45 0 0 1-.713 1.787c-.475.494-1.043.734-1.736.734a2.25 2.25 0 0 1-1.713-.724c-.47-.493-.699-1.076-.699-1.781a2.53 2.53 0 0 1 .724-1.817 2.24 2.24 0 0 1 1.704-.757zM6.841 0a.66.66 0 0 0-.65.565L6.188 3.16a3.52 3.52 0 0 0-1.983-.884h-.02c-.048-.007-.098-.007-.144-.013l-.147-.015c-.107-.002-.215-.002-.344.004l-.03.005c-.05 0-.103.004-.153.011l-.194.019-.042.009-.129.019c-.063.008-.12.027-.185.037-.588.151-1.127.444-1.592.888l-.019.009-.125.129-.044.045-.083.095a3.13 3.13 0 0 0-.235.293.78.78 0 0 0-.07.096l-.019.027C.208 4.562 0 5.289 0 6.079l.001.198.032.352.022.148.035.149.023.118c.162.634.488 1.207.967 1.706.193.198.402.38.622.524l.106.071.042.024.015.007c.087.057.175.102.256.144l.171.076c.447.185.94.28 1.466.28h.021l.178-.005a.53.53 0 0 0 .088-.006h.024l.083-.008c.019-.005.042-.005.054-.007.753-.081 1.42-.373 1.983-.866v.3l.003.034a.66.66 0 0 0 .566.557h.17c.329-.045.571-.33.571-.658V.658A.66.66 0 0 0 6.841 0zm-.68 6.096a2.41 2.41 0 0 1-.706 1.767c-.475.489-1.032.729-1.715.729-.301 0-.571-.049-.839-.146-.011-.001-.018-.002-.024-.007l-.033-.013a2.27 2.27 0 0 1-.804-.552 2.44 2.44 0 0 1-.623-1.16c-.044-.196-.064-.394-.064-.603 0-.704.23-1.289.71-1.8.48-.505 1.032-.748 1.689-.748s1.208.243 1.69.751a2.48 2.48 0 0 1 .719 1.782zm9.816-.163c0-.094-.009-.193-.016-.292a3.7 3.7 0 0 0-.517-1.548 3.9 3.9 0 0 0-.561-.727c-.543-.56-1.186-.92-1.911-1.063l-.06-.007c-.053-.013-.108-.02-.158-.028l-.234-.025-.151-.009a5.7 5.7 0 0 0-.37 0c-.674.034-1.292.227-1.833.586-.078.049-.152.106-.228.162l-.283.241-.144.142c-.73.754-1.1 1.674-1.1 2.736a3.85 3.85 0 0 0 .257 1.409 3.76 3.76 0 0 0 .834 1.283l.28.266c.149.125.301.237.453.333l.326.178a3.91 3.91 0 0 0 .88.288l.195.032.188.022c.06.007.12.008.181.011l.027.001.17.004h.021l.177-.004.126-.005.056-.007A3.57 3.57 0 0 0 14.893 8.8a3.89 3.89 0 0 0 .389-.468c.044-.057.086-.118.124-.181l.018-.037c.032-.082.047-.162.047-.241 0-.375-.304-.672-.675-.672-.219 0-.426.109-.557.295a2.48 2.48 0 0 1-.319.4c-.475.494-1.043.734-1.736.734a2.27 2.27 0 0 1-1.717-.724c-.077-.081-.155-.177-.226-.269l-.026-.042a2.21 2.21 0 0 1-.163-.273c-.11-.204-.186-.432-.228-.668h5.585l.051-.009a.67.67 0 0 0 .521-.585v-.018l-.004-.109zm-6.116-.499a2.41 2.41 0 0 1 .305-.704l.019-.032c.09-.136.193-.262.309-.389.481-.508 1.038-.756 1.7-.756s1.225.251 1.711.757a2.74 2.74 0 0 1 .526.782 2.47 2.47 0 0 1 .116.343l-4.686-.001zm23.074-.511v4.294c0 .364-.297.661-.664.661a.66.66 0 0 1-.662-.594V4.941a1.43 1.43 0 0 0-.41-1.034c-.255-.259-.536-.399-.868-.422-.028-.006-.063-.006-.099-.006-.376 0-.689.142-.957.427-.262.277-.394.588-.411.961v.059l.002.041-.002.011v4.238a.66.66 0 0 1-.659.661.66.66 0 0 1-.664-.594l-.001-.024.005-4.322c-.004-.032-.004-.057-.004-.079-.011-.208-.185-.618-.185-.618s-.136-.24-.228-.335c-.272-.285-.589-.427-.964-.427s-.685.142-.957.427c-.278.291-.413.632-.413 1.031V9.3c-.044.331-.326.576-.661.576-.363 0-.662-.297-.662-.661V2.836c0-.367.299-.665.662-.665a.68.68 0 0 1 .617.409l.147-.095c.38-.205.806-.314 1.269-.314a2.58 2.58 0 0 1 1.759.658c.057.049.108.103.156.156.045.042.084.086.123.127l.119-.127.157-.156a2.58 2.58 0 0 1 1.752-.658l.227.009a2.54 2.54 0 0 1 1.534.656l.156.149c.523.537.786 1.187.786 1.938zm-10.37 2.761a2.26 2.26 0 0 1-2.218 2.255h-2.685a.65.65 0 0 1-.65-.651.65.65 0 0 1 .65-.648h2.652a.96.96 0 0 0 .946-.956c0-.525-.427-.953-.953-.953h-1.282c-1.243 0-2.257-1.007-2.257-2.252a2.26 2.26 0 0 1 2.257-2.259h2.651c.359 0 .653.293.653.655 0 .355-.294.65-.653.65h-2.651c-.526 0-.953.427-.953.954a.96.96 0 0 0 .942.953h.024l.041-.002h1.227a2.18 2.18 0 0 1 .912.193 2.26 2.26 0 0 1 1.347 2.061zm25.435 0c0 1.229-.996 2.238-2.219 2.258H43.1c-.359 0-.651-.296-.651-.654a.65.65 0 0 1 .651-.648h2.65c.519-.004.944-.431.944-.956s-.428-.953-.951-.953h-1.182c-.033.004-.065.004-.099.004-1.245 0-2.258-1.008-2.258-2.256a2.26 2.26 0 0 1 2.258-2.259h2.647a.66.66 0 0 1 .654.655c0 .355-.295.651-.654.651h-2.647c-.527 0-.956.426-.956.952a.96.96 0 0 0 .943.953h.025c.004 0 .022 0 .038-.002h1.231a2.18 2.18 0 0 1 .911.193A2.26 2.26 0 0 1 48 7.684z"></path></svg></span></a></div></div>
    <div id="calculator"></div>
    <script>Desmos.GraphingCalculator(document.getElementById('calculator')).setState({%STATE%});</script>
</body></html>"""
    HTML = HTML.replace("{%ID%}",ID)
    HTML = HTML.replace('{%TITLE%}',info['title'])
    HTML = HTML.replace('{%STATE%}',state)
    open('desmos/'+ID+'.html', "wb").write(bytearray(HTML,'utf-8'))

    # add graph to the index
    HTML = """<div class="graph">
        <img src="https://saved-work.desmos.com/calc_thumbs/production/{%ID%}.png" />
        <div class="description">
            <h2>{%TITLE%}</h2>
            <p class="time">{%TIME%}</p>
            <p class="equation">$${%EQUATION%}$$</p>
            <p class="links">
                <a href="https://www.desmos.com/calculator/{%ID%}">Desmos</a>
                <a href="{%ID%}.html">Mirror</a>
            </p>
        </div>
    </div>"""
    HTML = HTML.replace("{%ID%}",ID)
    HTML = HTML.replace('{%TITLE%}',info['title'])
    HTML = HTML.replace('{%TIME%}',info['created'])
    HTML = HTML.replace('{%EQUATION%}',__import__('html').escape(getEquation(info)))
    index += HTML


index += """<div><br></div><div><br></div><div><br></div><div><br></div></body></html>"""

open('desmos/index.html', "wb").write(bytearray(index,'utf-8'))


