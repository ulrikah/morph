import paper from "paper";
import createCanvas from "../utils/createCanvas";
import pointsAsSquare from "../utils/shapes";

const CONTAINER_NAME = "dg2d-container";

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

    
    const initialPoints = pointsAsSquare(100, 3, center)
    // initialPoints
    // .map((point) => {
    //     const circle = new paper.Path.Circle(point, 5);
    //     circle.strokeColor = new paper.Color("black");
    // })
    
    const path = new paper.Path({ strokeColor : 'black' });
    path.add(...initialPoints)
    path.closePath()
}



export default differentialGrowth;