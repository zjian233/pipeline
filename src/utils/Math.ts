import { IVector, Vector } from "./Vector";

export const cross = (a: IVector, b: IVector) => {
    return new Vector(
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
    );
}

export const dot = (a: IVector, b: IVector) => {
    return a.x * b.x + a.y* b.y + a.z * b.z;
}


export const range = (value:number, left: number, right: number) => {
    return value >= left && value <= right;
}

export const clamp = (value: number, left: number, right: number) => {
    return Math.min(Math.max(left, value), right)
}
