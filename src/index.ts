import differentialGrowth from "./diff-growth/dg2d";
import createCanvas from "./utils/createCanvas";

const main = () => {
    const root = document.querySelector("#root");
    if (!root) throw "Unable to find root div container";
    root.setAttribute("style", "padding: 1% 2% 0 2%;");

    const info = document.createElement("p");
    info.innerText = "Differential growth";
    info.setAttribute(
        "style",
        "font-family: Arial; font-size: 18pt; font-weight: bold"
    );
    const canvas = createCanvas(window.innerWidth, window.innerHeight * 0.7);
    canvas.setAttribute("style", "display: block;");

    root.appendChild(info);
    root.appendChild(canvas);

    differentialGrowth(canvas);
};

main();
