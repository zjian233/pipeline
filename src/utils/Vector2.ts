

export interface IVector2 {
    x: number;
    y: number;
}


export class Vector2 implements IVector2 {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }


    cross(vect: IVector2) {
        return this.x * vect.y - vect.x * this.y;
    }
}
