import paper from "paper";
import createCanvas from "../utils/createCanvas";
import pointsAsSquare from "../utils/shapes";
import lerp from "../utils/lerp";

const CONTAINER_NAME = "dg2d-container";

const ATTRACTION_FORCE = 0.1;

// }
// const dx = pair[1].x - pair[0].x;
//         const dy = pair[1].y - pair[0].y;
//         for (let i = 0; i < nPointsPerSegment; i++){
//             points.push(
//                 new paper.Point(
//                     pair[0].x + (i / nPointsPerSegment) * dx,
//                     pair[0].y + (i / nPointsPerSegment) * dy,
//                 )
//             )
//         }

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

    
    //    path.add(...pointsAsSquare(10, 10, new paper.Point(canvas.width / 2, canvas.height / 2)))

    const center = new paper.Point(paper.view.viewSize.width / 2, paper.view.viewSize.height / 2);
    const centerVisualisation = new paper.Path.Circle(center, 5);
    centerVisualisation.strokeColor = new paper.Color("black");
    centerVisualisation.fillColor = new paper.Color("pink");

    
    const initialPoints = pointsAsSquare(100, 10, center)
    // initialPoints
    // .map((point) => {
    //     const circle = new paper.Path.Circle(point, 5);
    //     circle.strokeColor = new paper.Color("black");
    // })

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


        })
    }

}


export default differentialGrowth;