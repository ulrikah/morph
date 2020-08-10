const createCanvas = (width : number, height : number, className = 'three-container') => {
    const canvas = document.createElement('canvas')
    canvas.width = width;
    canvas.height = height;
    canvas.className = className;
    document.body.appendChild(canvas);
    return canvas
}

export default createCanvas;