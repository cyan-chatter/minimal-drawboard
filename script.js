const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
console.log(ctx);  
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'white';
ctx.fillRect(1, 1, 2, 2);

window.addEventListener('resize', ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // setting canvas objects Removes all the drawing on the canvas
});

const mouse = {
    x:undefined,
    y:undefined
}

let size = 5;
let fill = 'cyan'
let esize = 5;

let mode = true;
let isBrush = false;
let isEraser = false;

const drawCircle = (size=5,fill='cyan') => {
    let rad = size;
    ctx.fillStyle = fill;
    ctx.lineWidth = 5;
    ctx.beginPath(); // lets js know a new shape is starting ie disconnected from the prev shape
    ctx.arc(mouse.x,mouse.y,rad,0,Math.PI*2);
    ctx.fill();    
}

const attachBrush = (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    if(!isEraser) drawCircle(size,fill);
    else drawCircle(esize,'black');
}

const drawLine = (ax,ay,size=5,fill='cyan') => {
    ctx.strokeStyle = fill;
    ctx.lineWidth = size;
    ctx.lineTo(ax,ay);
    ctx.stroke();
}

const attachPen = (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    if(!isEraser) drawLine(mouse.x,mouse.y,size,fill);
    else drawLine(mouse.x,mouse.y,esize,'black');
}

let controller = new AbortController();

document.getElementById('brushModeBtn').addEventListener('click', () => {
    //console.log('Before: ', 'brush: ' + isBrush, 'mode: ' + (mode?1:2));
    mode = !mode;
    isBrush = false;
    controller.abort();
    controller = new AbortController();
    drawWithBrush();
    //console.log('After: ', 'brush: ' + isBrush, 'mode: ' + (mode?1:2));
})

const drawWithBrush = () => {

    if(mode){
        canvas.addEventListener('mousedown', (event) => {
             isBrush = true; 
             ctx.beginPath();
        }, { signal: controller.signal });
        canvas.addEventListener('mouseup', () => {
             isBrush = false; 
        }, { signal: controller.signal });
        canvas.addEventListener('mousemove', (event) => {        
            if(isBrush){
                attachPen(event);
            }
        }, { signal: controller.signal });    
    }
    else{
        const toggleBrush = (isBrush) => {
            if(isBrush){
                ctx.beginPath();
                canvas.addEventListener('mousemove', attachPen, { signal: controller.signal });
            } 
            else canvas.removeEventListener('mousemove', attachPen, { signal: controller.signal });
        }
        canvas.addEventListener('click', ()=>{
            isBrush = !isBrush;
            toggleBrush(isBrush);  
        }, { signal: controller.signal })        
    }
}

drawWithBrush();


document.getElementById('clearCanvasBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
})
document.getElementById('brushSizeIncBtn').addEventListener('click', () => {
    if(isEraser) ++esize;
    else ++size;
    if(size > 20) size = 20;
    if(esize > 20) esize = 20;
})
document.getElementById('brushSizeDecBtn').addEventListener('click', () => {
    if(isEraser) --esize;
    else --size;
    if(size < 1) size = 1;
    if(esize < 1) esize = 1;
})
document.getElementById('eraserBtn').addEventListener('click', () => {
    isEraser = true;
})
document.getElementById('brushBtn').addEventListener('click', () => {
    isEraser = false;
})
