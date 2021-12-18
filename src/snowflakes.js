// draw falling snowflakes when click "snowflake"


function setSofakeClick() {
    const sofake = document.getElementById('sofake');

    const canvas = document.getElementById('falling-snowflake-canvas');
    canvas.style.width = canvas.style.height = '100%';
    var resizeCanvas = function (e) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function Snowflake(pos, vel, ang_pos, ang_vel, size, color) {
        this.p = pos, this.v = vel, this.r = ang_pos, this.w = ang_vel;
        this.size = size, this.color = color;
    };
    function randomSnowflake() {
        var sx = Math.max(canvas.width / 600, 1.0);
        var sy = Math.max(canvas.height / 600, 1.0);
        var alpha = Math.random();
        return new Snowflake(
            { x: Math.random() * canvas.width, y: (0.0 + 0.2 * Math.random()) * canvas.height },
            { x: sx * (20.0 * (2 * Math.random() - 1)), y: sy * (50 + 70 * Math.random()) },
            2.0 * Math.PI * Math.random(),
            Math.PI * (2.0 * Math.random() - 1.0),
            (4 + 2 * Math.random()) * Math.min(sx, sy),
            'rgba(255,255,255,' + (1.0 - Math.pow(alpha, 6.0)) + ')'
        );
    }
    var snowflakes = [];
    if (Math.random() < 0.2) snowflakes.push(randomSnowflake());

    function render(time) {
        if (snowflakes.length > 0) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            var new_snowflakes = [];

            const snowflakePoints = [];
            for (var k = 0; k < 6; k++) {
                var a = 2.0 * Math.PI * (k / 6);
                snowflakePoints.push([Math.cos(a), Math.sin(a)]);
            }

            for (var si = 0; si < snowflakes.length; si++) {
                var sf = snowflakes[si];

                ctx.beginPath();
                ctx.fillStyle = sf.color;
                for (var i = 0; i < snowflakePoints.length; i++) {
                    var x0 = sf.size * snowflakePoints[i][0];
                    var y0 = sf.size * snowflakePoints[i][1];
                    var x = sf.p.x + Math.cos(sf.r) * x0 - Math.sin(sf.r) * y0;
                    var y = sf.p.y + Math.sin(sf.r) * x0 + Math.cos(sf.r) * y0;
                    if (i == 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.fill();

                var dt = 1.0 / 60.0;
                var sf_new = new Snowflake(
                    { x: sf.p.x + sf.v.x * dt, y: sf.p.y + sf.v.y * dt },
                    { x: sf.v.x, y: sf.v.y },
                    sf.r + sf.w * dt,
                    sf.w,
                    sf.size - 0.2 * dt,
                    sf.color
                );
                if (sf_new.size > 1
                    && (sf_new.p.x > -0.2 * canvas.width && sf_new.p.x < 1.2 * canvas.width)
                    && (sf_new.p.y > -0.2 * canvas.height && sf_new.p.y < 1.2 * canvas.height)) {
                    new_snowflakes.push(sf_new);
                }
            }

            snowflakes = new_snowflakes;
        }
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    sofake.addEventListener("click", function (e) {
        e.preventDefault();
        if (Math.random() < 0.001) {
            alert("Easter Egg!");
        }
        var n = Math.random(); n = 8 + 10 * n * n;
        for (var i = 0; i < n; i++) {
            snowflakes.push(randomSnowflake());
        }
    });
}