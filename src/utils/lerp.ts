import paper from "paper";

const lerp = (a : paper.Point, b : paper.Point, force : number) : paper.Point => {
    if (force < 0.0 || force > 1.0) throw "force must be in range [0.0, 1.0]"
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return new paper.Point(a.x + (force / 1.0) * dx, a.y + (force / 1.0) * dy)   
}

export default lerp