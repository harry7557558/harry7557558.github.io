// get a list of IDs of saved graphs on Desmos

// 1. Go to https://www.desmos.com/calculator and log in
// 2. Run this script
// 3. Copy ID list from F12 console

(function() {
    var ids = [];
    var loaded = 0;
    function load(calculator) {
        var req = new XMLHttpRequest();
        var path = {
            'calculator': 'calculator/my_graphs',
            '3d': 'calculator_3d/my_graphs',
            'geometry': 'geometry/my_constructions'
        }[calculator];
        req.open("GET", "/api/v1/"+path);
        req.onload = function () {
            var graphs = JSON.parse(req.response);
            graphs = graphs.hasOwnProperty('myGraphs') ?
                graphs.myGraphs : graphs.myConstructions;
            for (var i = 0; i < graphs.length; i++) {
                ids.push(calculator+'/'+graphs[i].hash);
            }
            loaded += 1;
            if (loaded == 3)
                console.log(JSON.stringify(ids));
        };
        req.send();
    }
    load('calculator');
    load('3d');
    load('geometry');
}
)()
