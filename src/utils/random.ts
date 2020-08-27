import { map } from './map';

export const random = (a: number, b : number) => {
  return map(Math.random(), 0.0, 1.0, a, b);
}
