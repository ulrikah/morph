import paper from "paper";

const lerp = (a: paper.Point, b: paper.Point, force: number): paper.Point => {
    if (force < 0.0 || force > 1.0) throw "force must be in range [0.0, 1.0]";
    const diff = b.subtract(a);
    return new paper.Point(a.x + force * diff.x, a.y + force * diff.y);
};

export default lerp;
