import paper from "paper";
import createCanvas from "../utils/createCanvas";
import pointsAsSquare from "../utils/shapes";
import lerp from "../utils/lerp";

const CONTAINER_NAME = "dg2d-container";

const DISTANCE_THRESHOLD = 5;
const ATTRACTION_FORCE = 0.3;
const REPULSION_FORCE = 0.5;
const ALIGNMENT_FORCE = 0.5;
const ADAPTIVE_SUBDIVISION_THRESHOLD = 7;


const differentialGrowth = () => {
    const canvas = createCanvas(window.innerWidth, window.innerHeight, CONTAINER_NAME);
    paper.setup(canvas);
    let doRender = true;
    
    new paper.PointText({
        point : new paper.Point(
            paper.view.viewSize.width / 10,
            paper.view.viewSize.height / 5,
        ),
        content : "Differential growth",
        justification : "left",
        fontSize : 36
   })

    const centerVisualisation = new paper.Path.Circle(paper.view.center, 5);
    centerVisualisation.strokeColor = new paper.Color("black");
    centerVisualisation.fillColor = new paper.Color("green");

    const initialPoints = pointsAsSquare(150, 100, paper.view.center)

    const path = new paper.Path({ strokeColor : 'black' });
    path.add(...initialPoints)
    path.closePath()
    console.log(`Path contains ${path.segments.length} segments`)

    paper.view.onFrame = (event : any) => {
        if (!doRender) return
        path.segments.forEach((segment) => {
            // attract
            [segment.previous, segment.next].forEach((neighbor) => {
                const l = lerp(segment.point, neighbor.point, ATTRACTION_FORCE)
                segment.point.x = l.x
                segment.point.y = l.y
            })
            // repulsion
            path.segments
            .filter(otherSegment => otherSegment != segment)
            .forEach((otherSegment) => {
                const d = segment.point.getDistance(otherSegment.point);
                if (d < DISTANCE_THRESHOLD) {
                    const diff = segment.point.subtract(otherSegment.point);
                    segment.point.x += diff.x * REPULSION_FORCE
                    segment.point.y += diff.y * REPULSION_FORCE
                }
            })
            // alignment         
            const midpoint = lerp(segment.previous.point, segment.next.point, 0.5);
            const l = lerp(segment.point, midpoint, ALIGNMENT_FORCE);
            segment.point.x = l.x
            segment.point.y = l.y
        })
        
        // adaptive suddivision
        const newSegments : [number, paper.Point][] = [];
        path.segments.forEach((segment, idx) => {
            if (segment.point.getDistance(segment.next.point) > ADAPTIVE_SUBDIVISION_THRESHOLD) {
                const midpoint = lerp(segment.previous.point, segment.next.point, 0.5);
                console.log("ADAPTIVE", midpoint.x.toFixed(0), midpoint.y.toFixed(0))
                newSegments.push([idx + 1, midpoint])
            }
        })
        newSegments.forEach(newSegment => path.insert(newSegment[0], newSegment[1]))
    }
    const pauseOnSpaceDown = () => {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if ([" ", "Spacebar"].includes(event.key)) {
                doRender = !doRender;
            }
        });
    };
    pauseOnSpaceDown()
}

export default differentialGrowth;