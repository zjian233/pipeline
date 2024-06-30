import { PerspectiveCamera,Canvas, Object3D, Scene } from "./framework";
import { IPoint, Point } from "./utils/Point";
import { Vector } from "./utils/Vector";


class Trangle extends Object3D {
    constructor(p1: IPoint, p2: IPoint, p3: IPoint) {
        super();
        this.vertices = [p1, p2, p3];
    }
    
}

class Box extends Object3D {
    declare renderList: number[];

    constructor(width: number = 1, height: number = 1, deep: number = 1) {
        super();
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
            1, 2, 6,
            1, 6, 5,
            3, 7, 6,
            3, 6, 2,
            4, 5, 6,
            4, 6, 7
        ]

    }
    getRenderVertices() {
        const res = [];
        for (let i=0; i<this.renderList.length; i++) {
            res.push(this.vertices[this.renderList[i]]);
        }

        return res;
    }
}

function main() {
    test();
}


function test() {
    // 
    const app = document.getElementById('app')!;
    const canvas = new Canvas(app);

    const scene = new Scene();
    canvas.setScene(scene);
    //scene.add(
    //    new Trangle(
    //        new Point(0, 0, 1),
    //        new Point(0, 1, 0),
    //        new Point(1, 0, 1)
    //    )
    //);
    scene.add(new Box(1, 1, 1));

    const camera = new PerspectiveCamera(90, 1, 1, 10);

    camera.setPosition(new Point(3, 2, 2));
    camera.setUp(new Vector(0, 1, 0));
    camera.lookAt(new Point(0, 0, 0));

    canvas.setCamera(camera);

    canvas.render();

}

window.onload = main;
