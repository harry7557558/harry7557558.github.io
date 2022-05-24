// Get a list of published shaders on Shadertoy

// 1. Log in and go to https://www.shadertoy.com/profile?show=shaders
// 2. Run this script
// 3. Copy JSON from F12 console and paste into `shaders.json`

(function() {
    // get list of published shaders
    var table = document.getElementById("shadersTable");
    var columns = table.tHead.getElementsByTagName("td");
    var coli = 0;
    for (var i = 0; i < columns.length; i++) {
        if (/Status/.test(columns[i].textContent))
            coli = i;
    }
    var rows = table.tBodies[0].getElementsByTagName("tr");
    var shaderIds = [];
    for (var i = 0; i < rows.length; i++) {
        var path = rows[i].getElementsByTagName("a")[0].href;
        var id = path.split('/')[path.split('/').length - 1];
        var status = rows[i].getElementsByTagName("td")[coli];
        if (["rgb(0, 160, 0)", "rgb(0, 128, 160)", "rgb(160, 128, 0)"].indexOf(status.style.color) >= 0)
            shaderIds.push(id);
    }
    console.log(shaderIds);

    // get a JSON containing the shaders
    var httpReq = new XMLHttpRequest();
    httpReq.addEventListener('load', function(event) {
        var response = event.target.response;
        console.log(response);
    }, false);
    httpReq.addEventListener('error', function(e) {
        console.log("Error loading shaders.\n" + e.status);
    }, false);
    httpReq.open("POST", "/shadertoy", true);
    httpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    var qstr = "s=" + JSON.stringify({
        "shaders": shaderIds
    }) + "&nt=1&nl=1&np=1";
    httpReq.send(qstr);
}
)()
