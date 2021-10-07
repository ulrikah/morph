import paper from "paper";
import createCanvas from "../utils/createCanvas";
import pointsAsSquare from "../utils/shapes";
import lerp from "../utils/lerp";

const CONTAINER_NAME = "dg2d-container";

const DISTANCE_THRESHOLD = 5;
const ATTRACTION_FORCE = 0.03;
const REPULSION_FORCE = 0.05;

const differentialGrowth = () => {
    const canvas = createCanvas(window.innerWidth, window.innerHeight, CONTAINER_NAME);
    paper.setup(canvas);
    
    new paper.PointText({
        point : new paper.Point(
            paper.view.viewSize.width / 50,
            paper.view.viewSize.height / 10,
        ),
        content : "Differential growth",
        justification : "left",
        fontSize : 15
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
        path.segments.forEach((segment) => {
            const neighbors = [segment.previous, segment.next];

            // attract
            neighbors.forEach((neighbor) => {
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

            
        })
    }

}

export default differentialGrowth;