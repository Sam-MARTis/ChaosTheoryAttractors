//Declaring some variables and parameters

var unitVel = 100; //used to normalize pen velocity. normalvel = penvel/unitVel
var ff = 0;  //Boolean. fast forward
var timeDelay = 1; //How quickly it draws lines

// Getting html5 canvas ready 
var canvas = document.getElementById('firstCanvas');
console.log(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(canvas.height, canvas.width);
var c = canvas.getContext('2d');
c.strokeStyle = 'rgb(200, 0,0)';
c.lineWidth= 1;



// The below line is what resizes the graph to fit screensize in all devices.
var scaleFactor = Math.min(canvas.height/968, canvas.width/1260);


//More variables. r, g, b are declared to make a gradient depending on pen velocity

var std_dt = 0.005; //Standard time-step
var count = 0;
var x=-7.13;
var y=-7.11;
var z=25.41;
var b = 0;
var g = 0;
var r = 0;
var dt = 0.005;  //Actual used time-step
a = Promise.resolve();  //Starts with a resolved promise. We do .then to draw the next movement of the pen. 
// Promises were painful to learn since I had never used them before.







// Button click functions


const clearScreen = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
}
const ffBut = () => {
    dt = std_dt/2;  //the smaller the dt, the more accurate

    ff = 1; //Command to fastforward
}
const reloadScreen = () => {
    location.reload(); //reloads page when you press new
}
const speedUp = () => {
    // timeDelay = 1;
    dt = std_dt*1.5;  //this is what makes it speed up. however, this is unstable
}
const slowDown = () => {
    // timeDelay = 100;
    dt = std_dt / 5;
}
const normalSpeed = () => {
    // timeDelay = 10;
    dt = std_dt;
}

var normalizeX = (x) =>{
    return 0;
}
var normalizeY = (y) =>{
    return 0;
}

c.beginPath();


const command = (func, x, y, k) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            func(x, y, k);
            resolve();
        }, 1000);
    });
};




c.moveTo(window.innerWidth/2,window.innerHeight/2);


var prev_pos = {x:normalizeX(y), y:normalizeY(z)};
const move = (x, y, col) => {
    if(count=1){
        c.beginPath();
        c.strokeStyle = `rgb(${col.r}, 0, ${col.b})`;
        count =0;
    }
    else{
        count = 1;
    }
    c.moveTo(prev_pos.x, prev_pos.y);
    
    c.lineTo(x, y);
    c.stroke();
    c.moveTo(x, y);
    prev_pos.x = x;
    prev_pos.y = y;
    
}






// c.moveTo(normalizeX(y), normalizeY(z));

var dxdt=(x,y,z) => {return 0;}
var dydt=(x,y,z)=> {return 0;}
var dzdt=(x,y,z) => {return 0;}

const proceed = (k) => {
for(let i=0; i<k; i++){
    
    a = a.then(
            () => {
                
                command(move, normalizeX(x), normalizeY(z), {r:r, g:g, b:b});
            }
        )
        .then(
            () => {
                
                return new Promise(
                    (resolve) => {
                        var dfxdt = dxdt(x, y, z);
                        var dfydt = dydt(x, y, z);
                        var dfzdt = dzdt(x, y, z);
                        let vel = ((dfxdt**2 + dfydt**2 + dfzdt**2)**0.5)/unitVel;
                        r = Math.round(240*vel);
                        b = Math.round(240* (1.5-vel));
                        c.strokeStyle = `rgb(${r}, 0, ${b})`;
                        

                        x = x+(dfxdt*dt);
                        y = y+(dfydt*dt);
                        z = z+(dfzdt*dt);
                    if(ff == 1){
                        resolve();
                    }
                    else{
                    console.log(timeDelay);
                    setTimeout(resolve, timeDelay);
                    }
                    
                    }   
                );
            }
        );
    
}
}
// proceed();
const lorentz = () =>{
    unitVel = 100;
    x=-7.13;
    y=-7.11;
    z=25.41;
    std_dt = 0.003;
    dt = std_dt;
    normalizeX = (x) =>{
        return (window.innerWidth/2 + 30*scaleFactor*x);
    }
    normalizeY = (y) =>{
        return (window.innerHeight/2 - 18*scaleFactor*(y-30*scaleFactor));
    }
    prev_pos = {x:normalizeX(y), y:normalizeY(z)};
    dxdt=(x,y,z) => {return 10*(y-x);}
    dydt=(x,y,z)=> {return x*(28-z)-y;}
    dzdt=(x,y,z) => {return x*y-8*z/3;}
    proceed(Math.round(600000*(scaleFactor**0.2)));
}
const chen = () => {
    x=1.960;
    y=2.04;
    z=12.51;
    std_dt = 0.0004;
    dt = std_dt;
    unitVel = 1500;
    
    
    normalizeX = (x) =>{
        return (window.innerWidth/2 + 20*scaleFactor*x);
    }
    normalizeY = (y) =>{
        return (window.innerHeight/2 - 20*scaleFactor*(y-20*scaleFactor));
    }
    prev_pos = {x:normalizeX(y), y:normalizeY(z)};
    dxdt=(x,y,z) => {return 400*(y-x);}
    dydt=(x,y,z)=> {return -120*x-10*(x*z) +280*y ;}
    dzdt=(x,y,z) => {return 10*x*y  - 30*z;}
    proceed(Math.round(200000*(scaleFactor**0.2)));

}
