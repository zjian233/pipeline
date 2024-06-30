import { Matrix4 } from "./Matrix4";
import { IPoint } from "./Point";

export interface IVector {
    x: number;
    y: number;
    z: number;
}
export class Vector implements IVector {
    x: number;
    y: number;
    z: number;

    static setFromPoint(point: IPoint) {
        return new Vector(point.x, point.y, point.z);
    }

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    sub(v: Vector) {
        this.x = this.x - v.x;
        this.y = this.y - v.y;
        this.z = this.z - v.z;
        return this;
    }

    norm() {
        const norm = Math.sqrt(
            this.x*this.x + this.y* this.y + this.z* this.z
        );

        if (norm === 0) {
            return this;
        }

        this.x = this.x / norm;
        this.y = this.y / norm;
        this.z = this.z / norm;
        return this;
    }

    clone() {
        return new Vector(this.x, this.y, this.z);
    }


    applyMatrix4(mat: Matrix4) {
        const res = [];
        const vect = [this.x, this.y, this.z, 1];
        for (let i=0; i<4;i++) {
            let sum = 0;
            for (let j=0; j<4; j++) {
                sum += mat.getIndex(i+1, j+1) * vect[j];
            }
            res.push(sum);
        }
        this.x = res[0] / res[3];
        this.y = res[1] / res[3];
        this.z = res[2] / res[3];
        return this;
    }

}
