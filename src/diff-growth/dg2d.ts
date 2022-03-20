import paper from "paper";
import lerp from "../utils/lerp";
import { random, randomInt } from "../utils/random";
import { fileFromSvgElement, fileUploader, getDownloadableLink } from "../io";
import pointsAsSquare from "../utils/shapes";

const DISTANCE_THRESHOLD = 3;
const ATTRACTION_FORCE = 0.9;
const REPULSION_FORCE = 0.5;
const ALIGNMENT_FORCE = 0.5;
const ADAPTIVE_SUBDIVISION_THRESHOLD = DISTANCE_THRESHOLD * 2;
const OVERCONSTRAIN_FREQUENCY = 2; // provided in frames
const DEBUG = false;

const differentialGrowth = (canvas: HTMLCanvasElement) => {
    paper.setup(canvas);
    let doRender = true;
    let isReady = false;

    const debugText = new paper.PointText({
        point: new paper.Point(
            paper.view.viewSize.width / 10,
            paper.view.viewSize.height / 5 + 50
        ),
        justification: "left",
        fontSize: 24,
        visible: DEBUG,
    });

    const path = new paper.Path({ strokeColor: "black" });
    path.add(...pointsAsSquare(50, 50, paper.view.center));
    path.closePath();
    isReady = true;

    const addSvgFilesToPath = (files: File[]) => {
        files.forEach((file: File) => {
            if (file.type.match("svg")) {
                console.log("Trying file", file.name);
                file.text().then((content) => {
                    paper.project.importSVG(content, {
                        insert: false,
                        onLoad: (item: paper.Item) => {
                            path.removeSegments();
                            // the second child of the SVG items are paths
                            path.add(
                                ...upsamplePath(item.children[1] as paper.Path, 500)
                            );
                            path.closePath();
                            path.position = paper.project.view.center;
                            console.log(`Updating ${paper.view.update()}`);
                            isReady = true;
                        },
                    });
                });
            }
        });
    };

    const helpText = document.createElement("p");
    helpText.innerText =
        "Upload a custom SVG file. The SVG has to be a closed shape with a single path.";
    const uploaderElement = fileUploader(addSvgFilesToPath);
    const fileUploadContainer = document.createElement("div");
    fileUploadContainer.setAttribute(
        "style",
        `
        border: 1px solid black; max-width: 75%;
        border-radius: 5px;
        padding: 2% 1% 1% 1%;
        `
    );
    fileUploadContainer.appendChild(uploaderElement);
    fileUploadContainer.appendChild(helpText);
    canvas.parentElement?.append(fileUploadContainer);

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
        if (debugText)
            debugText.content = `nodes: ${path.segments.length.toString()}`;
    };
    const initEventListeners = () => {
        const downloadAbleLinksContainer = document.createElement("div")
        canvas.parentElement
            ? canvas.parentElement.appendChild(downloadAbleLinksContainer)
            : document.body.appendChild(downloadAbleLinksContainer);

        document.addEventListener("keydown", (event: KeyboardEvent) => {
            if ([" ", "Spacebar"].includes(event.key)) {
                doRender = !doRender;
            }
            if (["s"].includes(event.key)) {
                const svgFile = fileFromSvgElement(
                    path.exportSVG({
                        bounds: "view",
                    }) as SVGElement
                );
                const linkElement = getDownloadableLink(svgFile);
                linkElement.setAttribute("style", "display: block;")
                downloadAbleLinksContainer.appendChild(linkElement)
            }
        });
    };
    initEventListeners();
};

const range = (n : number) => [...Array(n).keys()]

const upsamplePath = (path: paper.Path, nSamples : number) : paper.Point[] => 
    range(nSamples)
        .map(i => path.getPointAt((path.length / nSamples) * i))

export default differentialGrowth;
