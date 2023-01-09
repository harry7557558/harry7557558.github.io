/* load and animate random quotes and links */

// https://stackoverflow.com/a/12646864/16318343
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// convert QUOTES/LINKS to a list of text/probability/psa
function flattenItemList(objects) {
    if (typeof (objects) == "string")
        objects = JSON.parse(objects);
    // shuffle category to make LDS random unpredictable
    var groups = [];
    for (let group_key in objects) {
        var group = objects[group_key].objects;
        shuffleArray(group);
        groups.push({
            probability: objects[group_key].probability,
            objects: group
        });
    }
    shuffleArray(groups);
    // flatten object list
    var items = [];
    for (var gi = 0; gi < groups.length; gi++) {
        var probability = groups[gi].probability;
        var group = groups[gi].objects;
        var sub_items = [];
        for (var i = 0; i < group.length; i++) {
            sub_items.push({
                text: group[i].text,
                alt: group[i].alt,
                weight: group[i].weight,
            });
        }
        var sum = 0.0;
        for (var i = 0; i < sub_items.length; i++)
            sum += sub_items[i].weight;
        for (var i = 0; i < sub_items.length; i++)
            sub_items[i].weight /= sum;
        for (var i = 0; i < sub_items.length; i++) {
            items.push({
                text: sub_items[i].text,
                alt: sub_items[i].alt,
                probability: sub_items[i].weight * probability,
                psa: -1.0
            });
        }
    }
    // calculate probability prefixed sum
    var psa = 0.0;
    for (var i = 0; i < items.length; i++) {
        psa += items[i].probability;
        items[i].psa = psa;
    }
    return items;
}

// random number generator
function vanDerCorput(n, b) {
    var x = 0.0;
    var e = 1.0 / b;
    while (n != 0) {
        var d = n % b;
        x += d * e;
        e /= b;
        n = Math.floor(n / b);
    }
    return x;
}

// receive a list of flattened items and a random number between 0 and 1
function getRandomItemByWeight(items, randval) {
    for (var i = 0; i < items.length; i++) {
        if (randval < items[i].psa) {
            return items[i];
        }
    }
    console.warn("PSA out of range with random number " + randval);
    return items[items.length - 1];
}

// call this function to render quotes
function animateQuotes() {
    function onload(quotes_json) {
        const quotes = flattenItemList(quotes_json);
        var time_start = Date.now();

        function renderQuote() {
            var time_elapsed = Date.now() - time_start;
            var quote_elapsed = time_elapsed / 5000;
            var qi = Math.floor(quote_elapsed);
            var qf = quote_elapsed - qi;
            qi += Math.floor(time_start / 400);

            var quote = getRandomItemByWeight(quotes, vanDerCorput(qi, 2)).text;
            var words = quote.split(' ');
            var random;
            for (var i = 0; i < words.length; i++) {
                random = vanDerCorput(qi + 100 + i, 2);
                var in_delay = 0.1 * random + 0.2 * (i / words.length);
                random = vanDerCorput(qi + 200 + i, 2);
                var in_time = 0.2 + 0.2 * random + 0.05 * (i / words.length);
                var opacity = 0.9 * Math.min(Math.max(qf - in_delay, 0.0) / in_time, 1.0);
                words[i] = "<span style='opacity:" + opacity + "'>" + words[i] + "</span>";
            }
            var html = words.join(' ');

            document.getElementById("bottom").innerHTML = html;
            requestAnimationFrame(renderQuote);
        }
        requestAnimationFrame(renderQuote);
    }
    function onerror(message) {
        document.getElementById("bottom").innerHTML = "<span style='color:red;'>" + message + "</span>";
    }
    var req = new XMLHttpRequest();
    req.open("GET", "./src/quotes.json", true);
    req.responseType = "json";
    req.onload = function (e) {
        if (req.status == 200) onload(req.response);
        else onerror("Failed to load quotes: " + req.status);
    };
    req.onerror = function (e) {
        onerror("Failed to load quotes.")
    };
    req.send();
}

// call this function to initialize random link
function initRandomLink() {
    function onload(links_json) {
        const links = flattenItemList(links_json);
        var seed = Math.floor(Date.now() / 400);
        function setLink() {
            var random = vanDerCorput(seed++, 2);
            var link = getRandomItemByWeight(links, random);
            let container = document.getElementById("randlink");
            container.innerHTML = link.alt;
            container.href = link.text;
        }
        setLink();
        document.getElementById("randlink").addEventListener("click", function (e) {
            setTimeout(setLink, 100);
            return true;
        });
    }
    function onerror(message) {
        document.getElementById("randlink").innerHTML = "<span style='color:red;'>" + message + "</span>";
    }
    var req = new XMLHttpRequest();
    req.open("GET", "./src/links.json", true);
    req.responseType = "json";
    req.onload = function (e) {
        if (req.status == 200) onload(req.response);
        else onerror("Error " + req.status);
    };
    req.onerror = function (e) {
        onerror("Error")
    };
    req.send();
}

// call this function to initialize contact information
function setContactInfo() {
    const element = document.getElementById("contact-info");
    const infos = [
        "<span title='Preferred name'>Harry Chen<span>",
        "<span title='Email'>harry7557558@gmail.com<span>",
        "<span title='Instagram'>@harry7557558</span>",
        "<span title='Discord'>harry7557558#2125</span>"
    ];
    var infoIndex = 0;
    element.innerHTML = infos[infoIndex];
    element.addEventListener("click", function (event) {
        event.preventDefault();
        infoIndex = (infoIndex + 1) % infos.length;
        element.innerHTML = infos[infoIndex];
    })
}

// responsible text size
function resetWordStyle() {
    const left = document.getElementById("left"),
        right = document.getElementById("right"),
        bottom = document.getElementById("bottom");
    var w = window.innerWidth, h = window.innerHeight;

    // set width
    var word_w = Math.min(w, h);
    var pad = Math.max(0.025 * w, 20);
    left.style.left = pad.toFixed(1) + "px";
    right.style.right = pad.toFixed(1) + "px";
    var bottom_w = Math.min(0.6 * Math.max(w, h), 0.8 * w);
    bottom.style.width = bottom_w.toFixed(1) + "px";
    bottom.style.marginLeft = (-0.5 * bottom_w).toFixed(1) + "px";

    // set font size
    var font_size = Math.max(0.014 * Math.max(w, h), 16);
    left.style.fontSize = right.style.fontSize = (1.0 * font_size).toFixed(1) + "px";
    bottom.style.fontSize = (1.4 * font_size).toFixed(1) + "px";
};