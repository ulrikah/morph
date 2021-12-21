import paper from "paper";
import createCanvas from "./utils/createCanvas";

export const svgElementFromString = (svgString: string): SVGElement => {
    let temp = document.createElement("template");
    temp.innerHTML = svgString.trim();
    return temp.content.firstChild as SVGElement;
};

export const getDownloadableLink = (uri: string): HTMLAnchorElement => {
    const link = document.createElement("a");
    link.setAttribute("href", uri);
    link.setAttribute("download", uri);
    return link;
};

export const fileUploader = (
    onFilesUploaded: (files: File[]) => void
): HTMLElement => {
    const inputField = document.createElement("input");
    inputField.setAttribute("type", "file");

    // which event type is this?
    inputField.onchange = (event: any) => {
        if (event.target && event.target.files.length > 0) {
            inputField.files = event.target.files;
            onFilesUploaded(Array.from(event.target.files) as File[]);
        } else {
            console.log("No files in input field");
        }
        event.preventDefault();
    };
    return inputField;
};

export const demo = (): HTMLElement => {
    const addSvgFilesToProject = (files: File[]) =>
        files.forEach((file: File) => {
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
    return document.body.appendChild(fileUploader(addSvgFilesToProject));
};
