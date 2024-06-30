import { IPoint, Point } from "../utils/Point";
import { Vector } from "../utils/Vector";
import { Matrix4 } from "../utils/Matrix4";
import { cross, dot } from "../utils/Math";

export class PerspectiveCamera {
    private position: IPoint = new Point(0, 0, 0);
    private lookPoint: IPoint = new Point(0, 0, 0);
    private up: Vector = new Vector(0, 1, 0);

    constructor(
        public fov: number,
        public aspect: number,
        public near: number,
        public far: number
    ) { }

    lookAt(point: IPoint) {
        this.lookPoint = point;
    }

    setUp(vect: Vector) {
        this.up = vect;
    }

    // 更新矩阵
    updateMatrix() {


    }

    setPosition(point: IPoint) {
        this.position = point;
    }

    getProjectionMatrix():Matrix4 {
        const matrix = new Matrix4();
        const aspect = this.aspect;
        const fov = this.fov * Math.PI / 180;
        const n = -this.near;
        const f = -this.far;
        matrix.set(
            -1/(aspect*Math.tan(fov/2)), 0, 0, 0,
            0, -1/(Math.tan(fov/2)), 0, 0,
            0, 0, (n+f)/(n-f), (-2*n*f)/(n-f),
            0, 0, 1, 0
        );

        return matrix;
    }

    getViewMatrix() {
        const lookVect = new Vector(
            this.lookPoint.x,
            this.lookPoint.y,
            this.lookPoint.z
        ).sub(
            new Vector(
                this.position.x, 
                this.position.y,
                this.position.z
            )
        ).norm();

        const upVect = this.up.clone().norm();
        const crossVect = cross(lookVect, upVect);
        const matrix = new Matrix4();
        matrix.set(
            crossVect.x, crossVect.y, crossVect.z, -dot(crossVect, this.position),
            upVect.x, upVect.y,  upVect.z, -dot(upVect, this.position),
            -lookVect.x, -lookVect.y, -lookVect.z,  dot(lookVect, this.position),
            0, 0, 0, 1
        );
        return matrix;
    }
}

