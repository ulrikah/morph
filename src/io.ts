import paper from "paper";
import createCanvas from "./utils/createCanvas";

const svgElementFromString = (svgString: string): SVGElement => {
    let temp = document.createElement("template");
    temp.innerHTML = svgString.trim();
    return temp.content.firstChild as SVGElement;
};

export const exportSvg = (item: paper.Item) => item.exportSVG;

export const getDownloadableLink = (uri: string): HTMLAnchorElement => {
    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", uri);
    return link;
};

export const fileUploader = (): HTMLElement => {
    const canvas = createCanvas(
        window.innerWidth / 2,
        window.innerHeight / 2,
        "test"
    );
    canvas.setAttribute("style", "border: 1px solid black");
    paper.setup(canvas);

    const inputField = document.createElement("input");
    inputField.setAttribute("type", "file");

    // which event type is this?
    inputField.onchange = (event: any) => {
        if (event.target && event.target.files.length > 0) {
            inputField.files = event.target.files;
            (Array.from(event.target.files) as File[]).forEach((file: File) => {
                file.text().then((content) => {
                    const item = new paper.Item().importSVG(
                        svgElementFromString(content),
                        {
                            onload: (_: paper.Item) =>
                                console.log("Imported SVG", content),
                        }
                    );
                    item.strokeColor = new paper.Color("black");
                    paper.project.activeLayer.addChild(item);
                    paper.view.update();
                });
            });
        } else {
            console.log("No files in input field");
        }
        event.preventDefault();
    };
    return inputField;
};

export const demo = (): HTMLElement =>
    document.body.appendChild(fileUploader());
