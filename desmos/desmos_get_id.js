// get a list of IDs of saved graphs on Desmos

// 1. Go to https://www.desmos.com/calculator and log in
// 2. Run this script
// 3. Copy ID list from F12 console

(function() {
    var req = new XMLHttpRequest();
    req.open("GET", "/api/v1/calculator/my_graphs");
    req.onload = function() {
        var graphs = JSON.parse(req.response).myGraphs;
        var ids = [];
        for (var i = 0; i < graphs.length; i++) {
            ids.push(graphs[i].hash);
        }
        console.log(JSON.stringify(ids));
    }
    req.send();
}
)()
