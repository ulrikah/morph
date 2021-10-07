import { map } from './map';

export const random = (a: number, b : number) : number => {
    return map(Math.random(), 0.0, 1.0, a, b);
}

export const randomInt = (min : number, max : number) : number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}