export const map = (
    value: number,
    a: number,
    b: number,
    c: number,
    d: number
) => {
    return ((value - a) * (d - c)) / (b - a) + c;
};
