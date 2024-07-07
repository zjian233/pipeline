import { IPoint } from "../utils/Point";
import { IVector } from "../utils/Vector";
import { Material } from "./Material";

export interface IObject3D {
    // vertices: IPoint[];
    renderList: number[];
    vertexNormals: IVector[];
    children: IObject3D[];
    getRenderVertices: () => IPoint[];

    getMaterial:() => Material;

    computeVertexNormals:() => void;
    vertexUvs: number[];
}


