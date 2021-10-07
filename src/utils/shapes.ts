import paper from "paper";

// draw points in a square based on a radius
const pointsAsSquare = (radius : number, nPointsPerSegment : number, center : paper.Point) => {
    // define the squares
    const squares : paper.Point[] = [
        center.clone().add(new paper.Point(radius, -radius)), // top right
        center.clone().add(new paper.Point(radius, radius)), // bottom right
        center.clone().add(new paper.Point(-radius, radius)), // bottom left
        center.clone().add(new paper.Point(-radius, -radius)), // top left
    ];

    console.log(squares)
    
    const points : paper.Point[] = [];
    [
        [squares[0], squares[1]],
        [squares[1], squares[2]],
        [squares[2], squares[3]],
        [squares[3], squares[0]],
    ].map((pair) => {
        points.push(pair[0]) // push the first square to the list of points
        const dx = pair[1].x - pair[0].x;
        const dy = pair[1].y - pair[0].y;
        for (let i = 0; i < nPointsPerSegment; i++){
            points.push(
                new paper.Point(
                    pair[0].x + (i / nPointsPerSegment) * dx,
                    pair[0].y + (i / nPointsPerSegment) * dy,
                )
            )
        }
    })
    return points
}
  
export default pointsAsSquare
  