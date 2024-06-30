import { IPoint } from "../utils/Point";

export interface IObject3D {
    vertices: IPoint[];
    children: IObject3D[];
    getRenderVertices: () => IPoint[];
}


export class Object3D implements IObject3D {
    vertices: IPoint[] = [];
    children: IObject3D[] = [];
    getRenderVertices() {
        return this.vertices;
    }
}


