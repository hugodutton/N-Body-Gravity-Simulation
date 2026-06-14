const canvas = document.getElementById("universe");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ------------------------
// Physics Constants
// ------------------------

const G = 6.67430e-11;

// Scaling factors
const DIST_SCALE = 2e9;     // meters → pixels
const RADIUS_SCALE = 2e6;

const TIME_STEP = 3600 * 12; // 12 hours per frame

// ------------------------
// Body Class
// ------------------------

class Body {

    constructor(name, mass, x, y, vx, vy, radius, color){

        this.name = name;

        this.mass = mass;

        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.radius = radius;
        this.color = color;

        this.trail = [];
    }

    draw(){

        const screenX =
            canvas.width/2 + this.x / DIST_SCALE;

        const screenY =
            canvas.height/2 + this.y / DIST_SCALE;

        // orbit trail
        ctx.beginPath();

        for(let i=0;i<this.trail.length;i++){

            const p = this.trail[i];

            const tx =
                canvas.width/2 + p.x / DIST_SCALE;

            const ty =
                canvas.height/2 + p.y / DIST_SCALE;

            if(i===0){
                ctx.moveTo(tx,ty);
            }else{
                ctx.lineTo(tx,ty);
            }
        }

        ctx.strokeStyle = this.color;
        ctx.stroke();

        // body
        ctx.beginPath();

        ctx.arc(
            screenX,
            screenY,
            Math.max(2,this.radius/RADIUS_SCALE),
            0,
            Math.PI*2
        );

        ctx.fillStyle = this.color;
        ctx.fill();
    }

    updateTrail(){

        this.trail.push({
            x:this.x,
            y:this.y
        });

        if(this.trail.length > 500){
            this.trail.shift();
        }
    }
}

// ------------------------
// Real Planet Data
// ------------------------

const sun = new Body(
    "Sun",
    1.989e30,
    0,
    0,
    0,
    0,
    696340000,
    "yellow"
);

const earth = new Body(
    "Earth",
    5.972e24,
    1.496e11,
    0,
    0,
    29780,
    6371000,
    "dodgerblue"
);

const mars = new Body(
    "Mars",
    6.39e23,
    2.279e11,
    0,
    0,
    24077,
    3389500,
    "orangered"
);

const jupiter = new Body(
    "Jupiter",
    1.898e27,
    7.785e11,
    0,
    0,
    13070,
    69911000,
    "orange"
);

const bodies = [
    sun,
    earth,
    mars,
    jupiter
];

function computeForces(){

    const forces = [];

    for(let i=0;i<bodies.length;i++){

        forces[i] = {
            fx:0,
            fy:0
        };

        for(let j=0;j<bodies.length;j++){

            if(i===j) continue;

            const dx =
                bodies[j].x - bodies[i].x;

            const dy =
                bodies[j].y - bodies[i].y;

            const r =
                Math.sqrt(dx*dx + dy*dy);

            const force =
                G *
                bodies[i].mass *
                bodies[j].mass /
                (r*r);

            forces[i].fx +=
                force * dx/r;

            forces[i].fy +=
                force * dy/r;
        }
    }

    return forces;
}

function updatePhysics(){

    const forces = computeForces();

    for(let i=0;i<bodies.length;i++){

        const body = bodies[i];

        const ax =
            forces[i].fx / body.mass;

        const ay =
            forces[i].fy / body.mass;

        body.vx += ax * TIME_STEP;
        body.vy += ay * TIME_STEP;

        body.x += body.vx * TIME_STEP;
        body.y += body.vy * TIME_STEP;

        body.updateTrail();
    }
}

function animate(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    updatePhysics();

    bodies.forEach(body=>{
        body.draw();
    });

    requestAnimationFrame(animate);
}

animate();