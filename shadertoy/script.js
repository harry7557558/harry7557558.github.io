// sorting, graph plotting, preview

"use strict";

`Use this line to
break outdated browsers
`;


function getShaders() {
    let shaders = document.getElementsByClassName("shader");
    var info = [];
    for (var i = 0; i < shaders.length; i++) {
        let shader = shaders[i];
        let title = shader.getElementsByClassName("title")[0].textContent;
        let published = shader.getElementsByClassName("published")[0].textContent;
        let status = shader.getElementsByClassName("status")[0].textContent;
        let chars = shader.getElementsByClassName("chars")[0].textContent;
        let views = shader.getElementsByClassName("views")[0].textContent;
        let likes = shader.getElementsByClassName("likes")[0].textContent;
        let ratio = shader.getElementsByClassName("ratio")[0].textContent;
        var date = published.split('/');
        date = new Date(parseInt(date[0]), parseInt(date[1]) - 1, parseInt(date[2]));
        info.push({
            "shader": shader,
            "title": title,
            "published": published,
            "year": 1970 + (date / 86400000 / 365.2425),
            "status": status,
            "chars": parseInt(chars),
            "views": parseInt(views),
            "likes": parseInt(likes),
            "ratio": parseFloat(ratio),
        });
    }
    return info;
}

function sortShaders() {
    let shaders = getShaders();
    let selector = document.getElementById("sort-select");
    let key = selector.value;
    let comp = key == "title" || key == "chars" ? 1.0 : -1.0;  // cheap way to do this
    shaders.sort(function (a, b) {
        return a[key] > b[key] ? comp : a[key] < b[key] ? -comp : 0.0;
    });
    var container = document.getElementById("container");
    container.innerHTML = "";
    for (var i = 0; i < shaders.length; i++) {
        container.appendChild(shaders[i].shader);
    }
}

function initSort() {
    const sortModes = [
        { name: "title", key: "title", comp: 1.0 },
        { name: "newest", key: "published", comp: -1.0 },
        { name: "popular", key: "views", comp: -1.0 },
        { name: "likes", key: "likes", comp: -1.0 },
        { name: "like rate", key: "ratio", comp: -1.0 },
        { name: "shortest", key: "chars", comp: 1.0 },
    ];
    let selector = document.getElementById("sort-select");
    var selector_value = "likes";  // less popular ones
    for (var i = 0; i < sortModes.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = sortModes[i].name;
        option.value = sortModes[i].key;
        if (document.URL.indexOf("sort=" + sortModes[i].key) != -1 ||
            document.URL.indexOf("sort=" + sortModes[i].name) != -1)
            selector_value = sortModes[i].key;
        selector.appendChild(option);
    }
    selector.value = selector_value;
    selector.addEventListener("input", sortShaders);
    sortShaders();
}

function initUnlistedCheckbox() {
    let checkbox = document.getElementById("unlisted-checkbox");
    checkbox.checked = (document.URL.indexOf("unlisted=1") != -1);
    function updateCss() {
        let unlisted = document.getElementsByClassName("unlisted");
        var display = checkbox.checked ? "block" : "none";
        for (var i = 0; i < unlisted.length; i++)
            unlisted[i].style.display = display;
    }
    checkbox.addEventListener("input", updateCss);
    updateCss();
}

function getShadersPoints(shaders, key1, key2) {
    var points = {
        publicApi: { titles: [], data: [] },
        public: { titles: [], data: [] },
        unlisted: { titles: [], data: [] }
    };
    for (var i = 0; i < shaders.length; i++) {
        var key = shaders[i].status == "public+api" ? "publicApi" : shaders[i].status;
        points[key].titles.push(shaders[i].title);
        points[key].data.push([shaders[i][key1], shaders[i][key2]]);
    }
    return points;
}

const LineFitModes = ["proportional", "linear", "median-median"];
const LineFits = {
    // least-squares y=mx
    "proportional": function (p) {
        var sxy = 0.0, sx2 = 0.0;
        for (var i = 0; i < p.length; i++) {
            var x = p[i][0], y = p[i][1];
            sxy += x * y;
            sx2 += x * x;
        }
        var m = sxy / sx2;
        return function (x) {
            return m * x;
        };
    },
    // least-squares y=mx+b
    "linear": function (p) {
        var sx2 = 0.0, sx = 0.0, s1 = 0.0,
            sxy = 0.0, sy = 0.0;
        for (var i = 0; i < p.length; i++) {
            var x = p[i][0], y = p[i][1];
            sx2 += x * x, sx += x, s1 += 1.0;
            sxy += x * y, sy += y;
        }
        var k = 1.0 / (sx2 * s1 - sx * sx);
        var m = k * (sxy * s1 - sx * sy);
        var b = k * (sx2 * sy - sx * sxy);
        return function (x) {
            return m * x + b;
        };
    },
    // median-median line
    "median-median": function (p) {
        if (p.length < 3) return this.linear(p);
        var n = p.length, m = Math.round(n / 3);
        p.sort(function (a, b) { return a[0] - b[0] });
        function med(q) {
            var i = q.length / 2;
            var x = q.length & 1 ? q[Math.floor(i)][0]
                : 0.5 * (q[i][0] + q[i + 1][0]);
            q = q.sort(function (a, b) { return a[1] - b[1]; });
            var y = q.length & 1 ? q[Math.floor(i)][1]
                : 0.5 * (q[i][1] + q[i + 1][1]);
            return [x, y];
        }
        var m1 = med(p.slice(0, m));
        var m2 = med(p.slice(m, n - m));
        var m3 = med(p.slice(n - m, n));
        var m = (m3[1] - m1[1]) / (m3[0] - m1[0]);
        var b = m2[1] - m * m2[0];
        return function (x) {
            return m * x + b;
        };
    },
};

function initChart() {
    // initialize selects
    const axesVariables = [
        { name: "date published", key: "year" },
        { name: "views", key: "views" },
        { name: "likes", key: "likes" },
        { name: "like rate (%)", key: "ratio" },
        { name: "char count", key: "chars" },
    ];
    let selectorX = document.getElementById("chart-x-select");
    let selectorY = document.getElementById("chart-y-select");
    for (var i = 0; i < axesVariables.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = axesVariables[i].name;
        option.value = axesVariables[i].key;
        selectorX.appendChild(option);
        if (option.value != "year")
            selectorY.appendChild(option.cloneNode(true));
    }
    selectorX.value = "year";
    selectorY.value = "ratio";
    let selectorFit = document.getElementById("line-fit-select");
    for (var i = 0; i < LineFitModes.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = LineFitModes[i];
        selectorFit.appendChild(option);
    }
    selectorFit.value = "linear";

    let shaders = getShaders();
    var points = getShadersPoints(shaders, selectorX.value, selectorY.value);

    let chart = null;
    function setLineFit(datasets) {
        var data = [];
        for (var i = 0; i < 3; i++) if (!datasets[i].hidden)
            data = data.concat(datasets[i].data);
        var fun = LineFits[selectorFit.value](data);
        var xmin = Infinity, xmax = -Infinity;
        for (var i = 0; i < data.length; i++) {
            xmin = Math.min(xmin, data[i][0]);
            xmax = Math.max(xmax, data[i][0]);
        }
        var points = [];
        var nd = 40;
        for (var i = 0; i <= nd; i++) {
            var x = xmin + (xmax - xmin) * (i / nd);
            var y = Math.max(fun(x), 0.0);
            points.push([x, y]);
        }
        datasets[3].data = points;
    }
    function updateChart() {
        var datasets = chart.data.datasets;
        var points = getShadersPoints(shaders, selectorX.value, selectorY.value);
        datasets[0].titles = points.publicApi.titles;
        datasets[0].data = points.publicApi.data;
        datasets[1].titles = points.public.titles;
        datasets[1].data = points.public.data;
        datasets[2].titles = points.unlisted.titles;
        datasets[2].data = points.unlisted.data;
        setLineFit(datasets);
        chart.update();
    }
    selectorX.addEventListener("input", updateChart);
    selectorY.addEventListener("input", updateChart);
    selectorFit.addEventListener("input", updateChart);

    let data = {
        datasets: [
            {
                type: 'scatter',
                hidden: false,
                label: 'public+api',
                titles: points.publicApi.titles,
                data: points.publicApi.data,
                backgroundColor: "rgb(0,128,160)"
            },
            {
                type: 'scatter',
                hidden: false,
                label: 'public',
                titles: points.public.titles,
                data: points.public.data,
                backgroundColor: "rgb(0,160,0)"
            },
            {
                type: 'scatter',
                hidden: true,
                label: 'unlisted',
                titles: points.unlisted.titles,
                data: points.unlisted.data,
                backgroundColor: "rgb(160,128,0)"
            },
            {
                type: 'line',
                hidden: false,
                label: 'line fit',
                data: [],
                pointBackgroundColor: "transparent",
                pointBorderColor: "transparent",
                backgroundColor: "rgb(128,128,128)",
                borderColor: "rgba(128,128,128,0.5)",
                borderWidth: 2,
                borderDash: [10, 10]
            }
        ]
    };
    setLineFit(data.datasets);

    let options = {
        responsive: true,
        aspectRatio: 2.0,
        layout: {
            padding: {
                top: 15,
                bottom: 15,
                left: 20,
                right: 35
            }
        },
        scales: {
            x: {
                ticks: { precision: 0 }
            },
            y: {
                ticks: { precision: 0 }
            }
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'center',
                onClick: function (event, legendItem, legend) {
                    var datasets = chart.data.datasets;
                    for (var i = 0; i < datasets.length; i++) {
                        if (datasets[i].label == legendItem.text)
                            datasets[i].hidden = !datasets[i].hidden;
                    }
                    updateChart();
                }
            },
            tooltip: {
                filter: function (item) {
                    return item.datasetIndex != 3;
                },
                callbacks: {
                    label: function (item) {
                        var label = item.dataset.titles[item.dataIndex];
                        var x_value = new String(Math.round(item.parsed.x));
                        var y_value = new String(Math.round(item.parsed.y));
                        if (selectorX.value == "year") {
                            var timestamp = (item.parsed.x - 1970) * 365.2425 * 86400000;
                            var date = new Date(timestamp + 1);
                            var year = '' + date.getFullYear();
                            var month = '' + (date.getMonth() + 1);
                            var day = '' + date.getDate();
                            if (month.length < 2) month = '0' + month;
                            if (day.length < 2) day = '0' + day;
                            x_value = year + "/" + month + "/" + day;
                        }
                        if (selectorX.value == "ratio")
                            x_value = item.parsed.x.toFixed(2) + "%";
                        if (selectorY.value == "ratio")
                            y_value = item.parsed.y.toFixed(2) + "%";
                        return label + ' (' + x_value + ', ' + y_value + ')';
                    }
                }
            },
        }
    };

    chart = new Chart(
        document.getElementById("chartjs-canvas"),
        {
            type: 'scatter',
            data: data,
            options: options
        }
    );

}


function initVideoLazyLoad() {
    function mouseEnterHandler(e) {
        // e.preventDefault();
        let a = e.target;
        if (a.tagName.toLowerCase() != "a")
            a = a.parentElement;
        let videos = a.getElementsByTagName("video");
        if (videos.length > 0) {
            videos[0].style.visibility = "visible";
            return;
        }
        let id = a.href.split('/')[a.href.split('/').length - 1];
        var video = document.createElement("video");
        video.classList = ['preview'];
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.noplaybackrate = true;
        var source = document.createElement("source");
        source.setAttribute("src", "videos/" + id + ".mp4");
        source.setAttribute("type", "video/mp4");
        video.appendChild(source);
        a.appendChild(video);
    }
    function mouseLeaveHandler(e) {
        // e.preventDefault();
        let a = e.target;
        if (a.tagName.toLowerCase() != "a")
            a = a.parentElement;
        let videos = a.getElementsByTagName("video");
        if (videos.length > 0) {
            videos[0].style.visibility = "hidden";
            return;
        }
    }
    let imgs = document.getElementsByClassName("image-video-preview");
    for (var i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        let a = img.parentElement;
        a.addEventListener("mouseenter", mouseEnterHandler);
        a.addEventListener("mouseleave", mouseLeaveHandler);
        //a.addEventListener("mouseover", mouseEnterHandler);
        //a.addEventListener("mouseout", mouseLeaveHandler);
        a.addEventListener("touchenter", mouseEnterHandler);
        a.addEventListener("touchleave", mouseLeaveHandler);
        a.addEventListener("touchstart", mouseEnterHandler);
        a.addEventListener("touchend", mouseLeaveHandler);
    }
}


(function () {
    initSort();
    initUnlistedCheckbox();
    initVideoLazyLoad();

    var chartjs = document.createElement("script");
    chartjs.setAttribute("src", "https://cdn.jsdelivr.net/npm/chart.js@3.7.1");
    chartjs.onload = initChart;
    document.head.appendChild(chartjs);
})();