const canvas=document.getElementById("simCanvas");
const ctx=canvas.getContext("2d");
canvas.width=1000;
canvas.height=700;
const G=100;
class Body{
    constructor(x,y,vx,vy,mass){
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
        this.mass=mass;
    }
    update(){
        this.x+=this.vx;
        this.y+=this.vy;
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,5,0,Math.PI*2);
        ctx.fillStyle="white";
        ctx.fill();
    }
}
const bodies=[];
bodies.push(new Body(200,300,1,0,1))
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let body of bodies){
        body.update();
        body.draw();
    }
    for(let i=0;i<bodies.length;i++){
        let ax=0;
        let ay=0;
        for(let j=0;j<bodies.length;j++){
            if(i===j) continue;
            let dx=bodies[j].x-bodies[i].x;
            let dy=bodies[j].y-bodies[i].y;
            let r=Math.sqrt(dx*dx+dy*dy);
            let force=G*bodies[j].mass/(r*r+1);
            ax+=force*dx/r;
            ay+=force*dy/r;
        }
        bodies[i].vx+=ax*0.01;
        bodies[i].vy+=ay*0.01;
    }
    for(let i=0;i<20;i++){
        bodies.push(
            new Body(
                Math.random()*1000,
                Math.random()*700,
                Math.random()-0.5,
                Math.random()-0.5,
                Math.random()*10+1
            )
        );
    }
    requestAnimationFrame(animate);
}
animate();
const slider=document.getElementById("bodyCount");
const value=document.getElementById("bodyValue");
slider.oninput=()=>{
    value.textContent=slider.value;
};