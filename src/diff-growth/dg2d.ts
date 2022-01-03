import paper from "paper";
import createCanvas from "../utils/createCanvas";
import pointsAsSquare from "../utils/shapes";
import lerp from "../utils/lerp";
import { random, randomInt } from "../utils/random";
import { fileUploader, getDownloadableLink } from "../io";

const CONTAINER_NAME = "dg2d-container";

const DISTANCE_THRESHOLD = 3;
const ATTRACTION_FORCE = 0.9;
const REPULSION_FORCE = 0.5;
const ALIGNMENT_FORCE = 0.5;
const ADAPTIVE_SUBDIVISION_THRESHOLD = DISTANCE_THRESHOLD * 2;
const OVERCONSTRAIN_FREQUENCY = 2; // provided in frames

const differentialGrowth = () => {
    const canvas = createCanvas(
        window.innerWidth,
        window.innerHeight,
        CONTAINER_NAME
    );
    paper.setup(canvas);
    let doRender = true;
    let isReady = false;

    const text = new paper.PointText({
        point: new paper.Point(
            paper.view.viewSize.width / 10,
            paper.view.viewSize.height / 5
        ),
        content: `Differential growth`,
        justification: "left",
        fontSize: 36,
    });
    const debugText = new paper.PointText({
        point: new paper.Point(
            paper.view.viewSize.width / 10,
            paper.view.viewSize.height / 5 + 50
        ),
        justification: "left",
        fontSize: 24,
    });

    const path = new paper.Path({ strokeColor: "black" });

    const addSvgFilesToPath = (files: File[]) => {
        files.forEach((file: File) => {
            if (file.type.match("svg")) {
                console.log("Trying file", file.name);
                file.text().then((content) => {
                    paper.project.importSVG(content, {
                        insert: false,
                        onLoad: (item: paper.Item) => {
                            // the second child of the SVG items are paths
                            path.add(
                                ...(
                                    item.children[1] as paper.Path
                                ).segments.map((segment) => segment.point)
                            );
                            path.closePath();
                            console.log(`Updating ${paper.view.update()}`);
                            isReady = true;
                        },
                    });
                });
            }
        });
    };

    canvas.parentElement?.prepend(fileUploader(addSvgFilesToPath));

    paper.view.onFrame = (event: any) => {
        if (!doRender || !isReady) return;
        path.segments.forEach((segment) => {
            // attract
            [segment.previous, segment.next].forEach((neighbor) => {
                const l = lerp(segment.point, neighbor.point, ATTRACTION_FORCE);
                segment.point.x = l.x;
                segment.point.y = l.y;
            });
            // repulsion
            path.segments
                .filter((otherSegment) => otherSegment != segment)
                .forEach((otherSegment) => {
                    const d = segment.point.getDistance(otherSegment.point);
                    if (d < DISTANCE_THRESHOLD) {
                        const diff = segment.point.subtract(otherSegment.point);
                        segment.point.x += diff.x * REPULSION_FORCE;
                        segment.point.y += diff.y * REPULSION_FORCE;
                    }
                });
            // alignment
            const midpoint = lerp(
                segment.previous.point,
                segment.next.point,
                0.5
            );
            const l = lerp(segment.point, midpoint, ALIGNMENT_FORCE);
            segment.point.x = l.x;
            segment.point.y = l.y;
        });

        // adaptive suddivision
        const newPoints: { index: number; point: paper.Point }[] = [];
        path.curves.forEach((curve, idx) => {
            if (
                curve.point1.getDistance(curve.point2) >
                    ADAPTIVE_SUBDIVISION_THRESHOLD &&
                newPoints.every(
                    (newPoint) =>
                        newPoint.point.getDistance(curve.point1) <
                            ADAPTIVE_SUBDIVISION_THRESHOLD &&
                        newPoint.point.getDistance(curve.point2) <
                            ADAPTIVE_SUBDIVISION_THRESHOLD
                )
            ) {
                const newSegment = curve.getPointAtTime(0.5);
                newPoints.push({
                    index: idx + 1,
                    point: newSegment,
                });
            }
        });
        newPoints.forEach((newSegment) =>
            path.insert(newSegment.index, newSegment.point)
        );

        if (event.count % OVERCONSTRAIN_FREQUENCY == 1) {
            const randomIndex = randomInt(0, path.segments.length - 1);
            const randomNode = path.segments[randomIndex];
            const newNode = lerp(
                randomNode.point,
                randomNode.next.point,
                random(0.0, 1.0)
            );
            path.insert(randomIndex, newNode);
        }
        debugText.content = `nodes: ${path.segments.length.toString()}`;
    };
    const initEventListeners = () => {
        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if ([" ", "Spacebar"].includes(event.key)) {
                doRender = !doRender;
            }
            if (["s"].includes(event.key)) {
                debugger;
                const svgElement = paper.project.exportSVG({
                    bounds: "view",
                }) as SVGElement;
                // TODO: turn SVG into downloadable blob from io.ts module
                svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                svgElement.setAttribute(
                    "xmlns:xlink",
                    "http://www.w3.org/1999/xlink"
                );
                const svgFile = new File(
                    [svgElement.outerHTML],
                    `export_${Date.now()}.svg`,
                    {
                        type: "image/svg+xml;charset=utf-8",
                    }
                );

                const linkElement = getDownloadableLink(svgFile);
                document.body.appendChild(linkElement);
            }
        });
    };
    initEventListeners();
};

export default differentialGrowth;
