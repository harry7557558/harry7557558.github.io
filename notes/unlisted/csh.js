// compressing loaded HTML notes
// intended to heavily compress Mathjax

// run as a Chrome snippet
// make sure MathJax are fully-loaded as HTML/CSS
// right click - Math Settings - Math Renderer - HTML-CSS

// aggressive compression, sometimes hurts normal HTML
// MathJax nobr paddings may be removed

// TODO: compress style attributes more

removeWhitespace = true;
removeMathjaxCSS = true;

// test if an element should be discarded by tagname
function isBadTagname(s) {
    s = s.toLocaleLowerCase();
    if (s == "script")
        return true;
    return false;
}
// test if an element should be discarded by style
function isBadStyle(s) {
    if (s.display == 'none' || s.visibility == 'hidden')
        return true;
    if (s.margin == '0px' && (s.width == '0px' || s.height == '0px'))
        return true;
    return false;
}
// test if an element should be discarded by attributes
function isBadAttribute(s) {
    if (s["id"] != undefined && s["id"].value.indexOf("MathJax_Menu") != -1)
        return true;
    return false;
}

// compress text node type value
function compressText(s) {
    s = s.replace(/[ \r\n]+/g, ' ');
    // this sometimes hurts (saves 0.3%)
    if (removeWhitespace) {
        s = s.replace(/ \u00a0/g, '\u00a0').replace(/\u00a0 /g, '\u00a0');
        if (s == ' ')
            s = "";
    }
    return s;
}

// compress attribute strings
function compressAttribute(s) {
    s = s.replace(/\s+/g, ' ');
    if (s == " ")
        s = "";
    s = s.replace(/: /g, ':');
    s = s.replace(/; /g, ';');
    s = s.replace(/, /g, ',');
    // removing all whitespaces hurts (ex. 2px solid => 2pxsolid)
    if (s[s.length - 1] == ';')
        s = s.substring(0, s.length - 1);
    return s;
}

// compress css content
function compressCSS(s) {
    s = s.replace(/\s+/g, ' ');
    s = s.replace(/ {/g, "{").replace(/ }/g, "}");
    s = s.replace(/{ /g, "{").replace(/} /g, "}");
    s = s.replace(/: /g, ":").replace(/; /g, ";");
    s = s.replace(/ \./g, ".").replace(/\, /g, ",");
    s = s.replace(/ >/g, ">").replace(/> /g, ">");
    // remove CSS that override classes
    if (removeMathjaxCSS && s.indexOf("@font-face") != -1)
        s = s.substring(s.indexOf("@font-face"), s.length);
    // remove comments
    while (true) {
        var i = s.indexOf('/*');
        if (i == -1)
            break;
        s = s.substring(0, i) + s.substring(s.indexOf('*/', i + 2) + 2, s.length);
    }
    return s.replace(/^\s+|\s+$/g, '');
}

// get a list of class names from class attribute string
function getClassAttribute(s) {
    if (typeof (s) != "string")
        return [];
    var k = s.split(" ");
    // remove unused class names by MathJax
    const removelist = ["math", "MathJax", "mi", "mo", "mn", "mrow", "mstyle", "texatom", "mspace", "msup", "msubsup", "munderover", "msqrt", "mfrac", "mtable", "mtd", "vsc-initialized"];
    for (var i = 0; i < k.length; i++) {
        if (removelist.indexOf(k[i]) != -1) {
            k.splice(i, 1);
            i--;
        }
    }
    return k;
}

// count the occurrence of style attributes
var Styles = {};
var TopStyles = [];
var TopStylesId = [];
function addStyle(s) {
    if (typeof (s) != "string" || s.length == 0)
        return;
    var k = s.split(";");
    for (var i = 0; i < k.length; i++) {
        var v = k[i];
        if (Styles[v] == undefined)
            Styles[v] = 1;
        else
            Styles[v]++;
    }
}
// pass html root element (or document.body) to this function
function countStyle(e) {
    if (e.tagName == undefined)
        return;
    var c = e.childNodes;
    for (var i = 0; i < c.length; i++) {
        countStyle(c[i]);
    }
    var an = e.attributes["style"];
    if (an != undefined) {
        addStyle(compressAttribute(an.value));
    }
}
// find style attributes that occupy most HTML length
function sortStyle() {
    var k = Object.keys(Styles).map((key) => [String(key), Styles[key]]);
    k.sort(function (a, b) {
        // may not be a good comparing function
        var l1 = Math.max(a[0].length - 3, 0) * (a[1] - 1);
        var l2 = Math.max(b[0].length - 3, 0) * (b[1] - 1);
        return l1 > l2 ? -1 : l1 < l2 ? 1 : 0;
    });
    for (var i = 0; i < Math.min(k.length, 26 * 27); i++) {
        // use class names with no more than 2 letters to avoid collisions
        // some style attributes are like to come together. maybe...
        if (Math.max(k[i][0].length - 3, 0) * (k[i][1] - 1) > 2 * k[i][0].length + 10) {
            var n = i;
            var s;
            if (n < 26)
                s = String.fromCharCode(n + 97);
            else {
                n -= 26;
                s = String.fromCharCode(Math.floor(n / 26) + 97) + String.fromCharCode((n % 26) + 97);
            }
            TopStyles.push(k[i][0]);
            TopStylesId.push(s);
        }
    }
    console.log(k, TopStyles, TopStylesId);
}

// recursively go through html elements
function compressElement(e) {
    // text/comments
    if (e.tagName == undefined) {
        if (e.nodeType == 3)
            return compressText(e.textContent);
        if (e.nodeType == 8)
            return "";
        console.error(e);
    }

    // discard unwanted elements
    var tagname = e.tagName.toLocaleLowerCase();
    if (isBadTagname(tagname))
        return "";
    if (isBadStyle(e.style))
        return "";
    if (isBadAttribute(e.attributes))
        return "";

    // "style" tagname, attributes are discarded
    if (tagname == "style") {
        var s = compressCSS(e.innerHTML);
        // be careful not to get normal css removed
        if (removeMathjaxCSS) {
            if (s.indexOf("MathJax_Menu") != -1 || s.indexOf("MathJax_Zoom") != -1 || s.indexOf("MathJax_Preview") != -1 || s.indexOf("MathML") != -1 || s.indexOf("MJXp-script") != -1)
                return "";
        }
        return "<style>" + s + "</style>";
    }

    // recursion
    var c = e.childNodes;
    var content = "";
    for (var i = 0; i < c.length; i++) {
        content += compressElement(c[i]);
    }

    // get element attributes
    var st = "<" + tagname;
    var at = e.attributes;
    if (at.length != 0)
        st += " ";

    // compress class attribute
    var classes = []
        , styles = [];
    var an = at["class"], as;
    if (an != undefined) {
        as = an.value;
        classes = getClassAttribute(as);
    }
    an = at["style"];
    if (an != undefined) {
        as = compressAttribute(an.value);
        styles = as.split(';');
        for (var i = 0; i < styles.length; i++) {
            if (styles[i] == "")
                styles.splice(i, 1),
                    i--;
        }
    }

    // convert most occured styles to classes
    for (var i = 0; i < styles.length; i++) {
        var d = TopStyles.indexOf(styles[i]);
        if (d != -1) {
            styles.splice(i--, 1);
            classes.push(TopStylesId[d]);
        }
    }

    // add attributes back
    if (classes.length != 0)
        st += "class=\"" + classes.join(' ') + "\"";
    if (styles.length != 0)
        st += "style=\"" + styles.join(';') + "\"";
    for (var i = 0; i < at.length; i++) {
        an = at[i].name;
        if (an == "class" || an == "style")
            continue;
        as = at[an].value;
        //as = compressAttribute(as);
        if (as != "") {
            if (an == 'id' && as.indexOf("MathJax") == 0)
                ;
            else
                st += an + "=\"" + as + "\"";
        }
    }
    if (st[st.length - 1] == ' ')
        st = st.substring(0, st.length - 1);
    st += ">";
    if (tagname == "head") {
        // add a stylesheet
        content += "<style>";
        for (var i = 0; i < TopStyles.length; i++) {
            content += "." + TopStylesId[i] + "{" + TopStyles[i] + "}";
        }
        content += "</style>";
        // override MathJax frame CSS
        content += "<style>#MathJax_MenuFrame{visibility:hidden;display:none;}span:focus{outline-width:0px;outline-style:none;outline-color:rgba(0,0,0,0);}</style>";
    }
    if (tagname != "br" && tagname != "hr")
        st += content + "</" + tagname + ">";
    return st;
}

// "<!DOCTYPE html>" affects page appearance??
var html = document.body.parentElement;
countStyle(html);
sortStyle();
var h = "<!DOCTYPE html>" + compressElement(html);
console.log(h);
console.log(h.length + "/" + html.outerHTML.length + " (" + (h.length / html.outerHTML.length).toFixed(3) + ")");
