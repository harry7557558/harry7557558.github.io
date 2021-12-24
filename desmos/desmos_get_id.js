// get a list of IDs of saved graphs on Desmos

// 1. Go to https://www.desmos.com/calculator and log in
// 2. Run this script
// 3. Copy ID list from F12 console

(function() {
    var graphs_container = document.getElementsByClassName('dcg-saved-graphs-list')[0];
    var graphs = graphs_container.getElementsByClassName('graph-link');
    var ids = [];
    for (var i = 0; i < graphs.length; i++) {
        var s = graphs[i].getElementsByClassName('dcg-thumb')[0].style.backgroundImage;
        var thumbnail = s.replace("url(\"", "").replace("\")", "");
        var title = graphs[i].getElementsByClassName('dcg-title')[0].textContent;
        // this is the only thing one needs
        var id = s.split('/')[s.split('/').length - 1].split('.')[0];
        ids.push(id);
    }
    console.log(JSON.stringify(ids));
}
)()
