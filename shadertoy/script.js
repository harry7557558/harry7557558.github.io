// sorting, graph plotting, preview


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
    for (var i = 0; i < sortModes.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = sortModes[i].name;
        option.value = sortModes[i].key;
        selector.appendChild(option);
    }
    selector.value = "ratio";  // less popular ones
    selector.addEventListener("input", sortShaders);
    sortShaders();
}

function initUnlistedCheckbox() {
    let checkbox = document.getElementById("unlisted-checkbox");
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

function initChart() {
    const axesVariables = [
        { name: "year", key: "year" },
        { name: "views", key: "views" },
        { name: "likes", key: "likes" },
        { name: "like rate (%)", key: "ratio" },
        { name: "size (chars)", key: "chars" },
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

    let shaders = getShaders();
    var points = getShadersPoints(shaders, selectorX.value, selectorY.value);

    let data = {
        datasets: [
            {
                label: 'public+api',
                titles: points.publicApi.titles,
                data: points.publicApi.data,
                backgroundColor: "rgb(0,128,160)"
            },
            {
                label: 'public',
                titles: points.public.titles,
                data: points.public.data,
                backgroundColor: "rgb(0,160,0)"
            },
            {
                label: 'unlisted',
                titles: points.unlisted.titles,
                data: points.unlisted.data,
                backgroundColor: "rgb(160,128,0)"
            }
        ]
    };

    let options = {
        responsive: false,
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
            },
            tooltip: {
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

    let chart = new Chart(
        document.getElementById("chartjs-canvas"),
        {
            type: 'scatter',
            data: data,
            options: options
        }
    );

    function updateChart() {
        var datasets = chart.data.datasets;
        var points = getShadersPoints(shaders, selectorX.value, selectorY.value);
        datasets[0].titles = points.publicApi.titles;
        datasets[0].data = points.publicApi.data;
        datasets[1].titles = points.public.titles;
        datasets[1].data = points.public.data;
        datasets[2].titles = points.unlisted.titles;
        datasets[2].data = points.unlisted.data;
        chart.update();
    }
    selectorX.addEventListener("input", updateChart);
    selectorY.addEventListener("input", updateChart);
}

(function () {
    initSort();
    initUnlistedCheckbox();

    var chartjs = document.createElement("script");
    chartjs.setAttribute("src", "https://cdn.jsdelivr.net/npm/chart.js@3.7.1");
    chartjs.onload = initChart;
    document.head.appendChild(chartjs);
})();