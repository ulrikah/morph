import differentialGrowth from "./diff-growth/dg2d";
import createCanvas from "./utils/createCanvas";
import { main as dla } from "./dla/dla";

enum Algorithms {
    DIFFUSION_LIMITED_AGGREGATION,
    DIFFERENTIAL_GROWTH,
}

const main = (algorithm: Algorithms) => {
    if (algorithm === Algorithms.DIFFERENTIAL_GROWTH) {
        const root = document.querySelector("#root");
        if (!root) throw "Unable to find root div container";
        root.setAttribute("style", "padding: 1% 2% 0 2%;");

        const info = document.createElement("p");
        info.innerText = "Differential growth";
        info.setAttribute(
            "style",
            "font-size: 18pt; font-weight: bold"
        );
        const canvas = createCanvas(
            window.innerWidth,
            window.innerHeight * 0.7
        );
        canvas.setAttribute("style", "display: block;");

        root.appendChild(info);
        root.appendChild(canvas);

        differentialGrowth(canvas);
    } else if (algorithm === Algorithms.DIFFUSION_LIMITED_AGGREGATION) {
        const canvas = createCanvas(window.innerWidth, window.innerHeight);
        document.body.appendChild(canvas);
        dla(canvas);
    }
};
main(Algorithms.DIFFERENTIAL_GROWTH);
