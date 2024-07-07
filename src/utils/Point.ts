

export interface IPoint {
    x: number;
    y: number;
    z: number;
}



export class Point implements IPoint {
    public x: number;
    public y: number;
    public z: number;

    constructor(x:number = 0, y: number = 0, z:number = 0) {
       this.x = x;
       this.y = y;
       this.z = z;
    }

    set(x:number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}


