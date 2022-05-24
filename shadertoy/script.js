// sorting, graph plotting, preview


function getShaders() {
    let shaders = document.getElementsByClassName("shader");
    var info = [];
    for (var i = 0; i < shaders.length; i++) {
        let shader = shaders[i];
        let title = shader.getElementsByClassName("title")[0].textContent;
        let published = shader.getElementsByClassName("published")[0].textContent;
        let chars = shader.getElementsByClassName("chars")[0].textContent;
        let views = shader.getElementsByClassName("views")[0].textContent;
        let likes = shader.getElementsByClassName("likes")[0].textContent;
        let ratio = shader.getElementsByClassName("ratio")[0].textContent;
        var timestamp = published.split('/');
        timestamp = new Date(parseInt(published[0]), parseInt(published[1]) - 1, parseInt(published[2]));
        timestamp /= 3600000;
        info.push({
            "shader": shader,
            "title": title,
            "published": published,
            // "timestamp": timestamp,
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

window.onload = function () {
    initSort();
    initUnlistedCheckbox();
};
