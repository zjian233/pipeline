import { cross } from "../utils/Math";
import { Point } from "../utils/Point";
import { IVector, Vector } from "../utils/Vector";
import { Color } from "./Color";
import { IMaterial, Material } from "./Material";
import { IObject3D } from "./Object3D";

export class Box implements IObject3D {
    declare renderList: number[];

    declare vertices: Point[];
    public children = [];

    declare material: IMaterial;

    declare vertexNormals: IVector[];

    constructor(width: number = 1, height: number = 1, deep: number = 1) {
        // super();
        const w = width, h = height, d = deep;
        this.vertices = [
            new Point(-w/2, -h/2, -d/2), new Point(w/2, -h/2, -d/2),new Point(w/2, -h/2, d/2),
            new Point(-w/2, -h/2, d/2),new Point(-w/2, h/2, -d/2),new Point(w/2, h/2, -d/2),
            new Point(w/2, h/2, d/2),new Point(-w/2, h/2, d/2)
        ];
        this.renderList = [
            0, 1, 2,
            0, 2, 3,
            0, 4, 5,
            0, 5, 1,
            0, 3, 7,
            0, 7, 4,
            1, 6, 2,
            1, 5, 6,
            3, 6, 7,
            2, 6, 3,
            5, 4, 6,
            4, 7, 6 

        ]

        this.setMaterial(new Material(Color.Red()));

    }
    getRenderVertices() {
        const res = [];
        for (let i=0; i<this.renderList.length; i++) {
            res.push(this.vertices[this.renderList[i]]);
        }

        return res;
    }

    getMaterial() {
        return this.material;
    }

    setMaterial(material: IMaterial) {
        this.material = material;

    }

    computeVertexNormals(): void {
        this.vertexNormals = this.vertices.map(_ => new Vector(0, 0, 0));

        const renderVertices = this.getRenderVertices();
        for (let i=0; i<this.renderList.length; i+=3) {
            const v1 = renderVertices[i],
                v2 = renderVertices[i+1],
                v3 = renderVertices[i+2];

            const l1 = new Vector(v2.x-v1.x, v2.y-v1.y, v2.z-v1.z);
            const l2 = new Vector(v3.x-v2.x, v3.y-v2.y, v3.z-v2.z);
            const normal = cross(l1, l2).norm();

            this.vertexNormals[this.renderList[i]].add(normal);
            this.vertexNormals[this.renderList[i+1]].add(normal);
            this.vertexNormals[this.renderList[i+2]].add(normal);
        }

        for (let i=0; i<this.vertexNormals.length;i++) {
            this.vertexNormals[i].norm();
        }
    }
}


