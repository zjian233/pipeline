import { clamp, dot, range } from "../utils/Math";
import { IPoint, Point } from "../utils/Point";
import { IVector, Vector } from "../utils/Vector";
import { PerspectiveCamera } from "./Camera";
import { Color, IColor } from "./Color";
import { Light } from "./Light";
import { IMaterial } from "./Material";
import { IObject3D } from "./Object3D";
import { Scene } from "./Scene";

export class Canvas {

    private canvas: HTMLCanvasElement;
    // private ctx: CanvasRenderingContext2D;

    declare scene: Scene;
    declare private camera: PerspectiveCamera;
    declare private ctx: CanvasRenderingContext2D;

    // declare private renderMap: number[][];
    declare private imageData: ImageData;
    declare private zBuffers: number[];

    private lights: Light[] = [];

    constructor(el: HTMLElement, props = { width: 500, height: 500 }) {
        const canvas = document.createElement('canvas');
        const { width, height } = props;
        canvas.width = width;
        canvas.height = height;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.mount(el);

    }

    mount(el: HTMLElement) {
        el?.append(this.canvas);
    }

    setScene(scene: Scene) {
        this.scene = scene;
    }

    setCamera(camera: PerspectiveCamera) {
        this.camera = camera;
    }

    addLight(light: Light) {
        this.lights.push(light);
    }

    render() {
        this.initImageData();
        for (let i = 0; i < this.scene.children.length; i++) {
            const object = this.scene.children[i];
            this.renderObject(object);
        }
        this.drawImageData();
    }

    private initImageData() {
        //this.renderMap = new Array(this.canvas.height).fill(new Array(this.canvas.width).fill(0));
        const { height, width } = this.canvas;
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height) as ImageData;
        this.zBuffers = new Array(height * width);
        for (let i = 0; i < height * width; i++) {
            this.zBuffers[i] = Number.MIN_SAFE_INTEGER;
        }
    }

    private drawImageData() {
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    renderObject(object: IObject3D) {
        const vertices = object.getRenderVertices();
        object.computeVertexNormals();
        const vertexNormals = object.vertexNormals;

        for (let i = 0; i < object.renderList.length; i += 3) {
            const transformedVetexs = this.transformPoint(
                [vertices[i], vertices[i + 1], vertices[i + 2]]
            );
            const clipVetexs = this.clipping(transformedVetexs);
            const screenPosArr = this.getScreenPos(clipVetexs);
            const v1Normal = object.vertexNormals[object.renderList[i]];
            const v2Normal = object.vertexNormals[object.renderList[i + 1]];
            const v3Normal = object.vertexNormals[object.renderList[i + 2]];

            const uvIdx = i * 2
            const v1Uv = object.vertexUvs.slice(uvIdx, uvIdx+2);
            const v2Uv = object.vertexUvs.slice(uvIdx+2, uvIdx+4);
            const v3Uv = object.vertexUvs.slice(uvIdx+4, uvIdx+6);

            const params = [
                {
                    vertex: vertices[i],
                    vertexNormal: v1Normal,
                    screenPos: screenPosArr[0],
                    uv: v1Uv,
                },
                {
                    vertex: vertices[i+1],
                    vertexNormal: v2Normal,
                    screenPos: screenPosArr[1],
                    uv: v2Uv,
                },
                {
                    vertex: vertices[i+2],
                    vertexNormal: v3Normal,
                    screenPos: screenPosArr[2],
                    uv: v3Uv
                }
            ]
            // console.log('params:', params);
            this.drawTriangle(params, object.getMaterial());
        }
        //const transformedVetexs = this.transformPoint(object.getRenderVertices())
        ////console.log('vertex:', transformedVetexs);
        //// 裁剪
        //const clipVetexs = this.clipping(transformedVetexs);
        //const screenPosArr = this.getScreenPos(clipVetexs);

        //const material = object.getMaterial();
        //this.draw(screenPosArr, material);

        for (let i = 0; i < object.children.length; i++) {
            this.renderObject(object.children[i]);
        }
    }

    //draw(vertices: IPoint[], material: IMaterial) {
    //    const len = vertices.length;
    //    if (len < 3) {
    //        return;
    //    }
    //    for (let i=0; i<vertices.length; i+=3) {
    //        const a = vertices[i],b = vertices[i+1], c=vertices[i+2];
    //        this.drawTriangle(a, b, c, material.color);
    //        //this.ctx.beginPath();
    //        //this.ctx.moveTo(a.x, a.y);
    //        //this.ctx.lineTo(b.x, b.y);
    //        //this.ctx.lineTo(c.x, c.y);
    //        //this.ctx.lineTo(a.x, a.y);
    //        //this.ctx.strokeStyle = 'blue';
    //        //this.ctx.lineWidth = 1;
    //        //this.ctx.stroke();
    //    }
    //    
    //}

    drawTriangle(
        verticesParams: {
            vertex:IPoint,
            vertexNormal: IVector,
            screenPos:IPoint,
            uv: number[]
        }[],
        material: IMaterial
    ) {
        const [v1, v2, v3] = verticesParams;
        // const [v1, v2, v3] = screenPos;
        // const color = material.color;

        //const [v1Normal, v2Normal, v3Normal] = normals;

        for (let i = 0; i < this.canvas.height; i++) {
            for (let j = 0; j < this.canvas.width; j++) {
                // 判断点是否在三角形内
                const pointValue = this.getPointValue([j, i], v1.screenPos, v2.screenPos, v3.screenPos);
                if (pointValue > 0) {
                    // 判断zBuffers
                    // 获取重心坐标
                    const [w1, w2, w3] = this.getBarycentric([j + 0.5, i + 0.5], v1.screenPos, v2.screenPos, v3.screenPos);
                    // 根据重心坐标算出当前的z值
                    const z = w1 * v1.screenPos.z + w2 * v2.screenPos.z + w3 * v3.screenPos.z;

                    const u = w1 * v1.uv[0] + w2 * v2.uv[0] + w3 * v3.uv[0];
                    const v = w1 * v1.uv[1] + w2 * v2.uv[1] + w3 * v3.uv[1];

                    const baseColor = material.getColorFromUv(u, v);

                    const normal = v1.vertexNormal.clone()
                        .multipleScale(w1)
                        .add(v2.vertexNormal.clone()
                            .multipleScale(w2))
                        .add(v3.vertexNormal.clone()
                            .multipleScale(w3)).norm();

                    const worldPos = new Point(
                        v1.vertex.x * w1 + v2.vertex.x*w2 + v3.vertex.x*w3,
                        v1.vertex.y * w1 + v2.vertex.y*w2 + v3.vertex.y*w3,
                        v1.vertex.z * w1 + v2.vertex.z*w2 + v3.vertex.z*w3,
                    )

                    // 计算光照 , blin-phong模型
                    const difuseK = 0.5;
                    const specularK = 0.4;
                    let IDifuse = 0;
                    let ISpecular = 0;
                    for (let i=0; i<this.lights.length;i++) {
                        const light = this.lights[i];

                        // 光照强度
                        const intensity = light.getIntensity();

                        // 点到光照的向量
                        const vect = Vector.setFromPoint(light.getPosition()).sub(Vector.setFromPoint(worldPos));

                        // 距离
                        const r = vect.length();

                        IDifuse += difuseK * (intensity / (r*r)) * Math.max(0, dot(vect.clone().norm(), normal));

                        // 点到相机的向量 半程向量法
                        const v = Vector.setFromPoint(this.camera.getPosition()).sub(Vector.setFromPoint(worldPos)).norm();

                        const halfVect = vect.clone().norm().add(v).norm();

                        ISpecular = specularK * (intensity/(r*r)) * Math.pow(Math.max(0, dot(normal, halfVect)), 64);
                    }

                    const difuseColor = baseColor.clone().multiple(clamp(IDifuse, 0, 1));
                    const specularColor = new Color(255, 255, 255).multiple(clamp(ISpecular, 0, 1));
                    const ambientColor = baseColor.clone().multiple(0.4);
                    const finalColor = difuseColor.add(ambientColor).add(specularColor);

                    const idx = i * this.canvas.width + j;

                    //console.log('pointValue,', pointValue);

                    if (z >= this.zBuffers[idx]) {
                        // 更新zBuffers
                        this.zBuffers[idx] = z;
                        const index = (i * this.canvas.width + j) * 4;
                        this.imageData.data[index] = finalColor.r * pointValue;
                        this.imageData.data[index + 1] = finalColor.g * pointValue;
                        this.imageData.data[index + 2] = finalColor.b * pointValue;
                        this.imageData.data[index + 3] = finalColor.a;
                    }
                }
            }
        }
    }

    // 获取点的重心
    getBarycentric(p: number[], a: IPoint, b: IPoint, c: IPoint) {
        const px = p[0], py = p[1];
        const w1 = (
            (b.y - c.y) * (px - b.x) + (c.x - b.x) * (py - b.y)) / (
                (b.y - c.y) * (a.x - b.x) + (c.x - b.x) * (a.y - b.y)
            );
        const w2 = (
            (c.y - a.y) * (px - c.x) + (a.x - c.x) * (py - c.y)) / (
                (c.y - a.y) * (b.x - c.x) + (a.x - c.x) * (b.y - c.y)
            );
        const w3 = 1 - w1 - w2;

        return [w1, w2, w3];
    }

    // 点是否在三角形内以及点
    getPointValue(p: number[], a: IPoint, b: IPoint, c: IPoint) {
        let res = 0;
        const cnt = 4;
        for (let i = 0; i < cnt; i += 1) {
            for (let j = 0; j < cnt; j++) {
                const x = p[0] + i * (1/cnt) +(1/cnt/2);
                const y = p[1] + j * (1/cnt) + (1/cnt/2);
                const cross1 = (b.x - a.x) * (y - a.y) - (b.y - a.y) * (x - a.x);
                const cross2 = (c.x - b.x) * (y - b.y) - (c.y - b.y) * (x - b.x);
                const cross3 = (a.x - c.x) * (y - c.y) - (a.y - c.y) * (x - c.x);

                if (cross1 >= 0 && cross2 >= 0 && cross3 >= 0) {
                    res++;
                }

                if (cross1 <= 0 && cross2 <= 0 && cross3 <= 0) {
                    res++;
                }
            }

        }
        return res / (cnt * cnt);
    }

    private transformPoint(vertices: IPoint[]): IPoint[] {
        const res = [];
        for (let i = 0; i < vertices.length; i++) {
            const viewMatrix = this.camera.getViewMatrix();
            const projectionMatrix = this.camera.getProjectionMatrix();
            const result = Vector.setFromPoint(vertices[i]).applyMatrix4(viewMatrix).applyMatrix4(projectionMatrix);
            res.push(result);
        }
        return res;
    }

    // Todo;
    private clipping(vertices: IPoint[]): IPoint[] {
        return vertices;
        //const isAllIn = vertices.every(vertex => range(vertex.x, -1, 1) && range(vertex.y, -1, 1) && range(vertex.z, -1, 1));

        //if (isAllIn) {
        //    return vertices;
        //}

        //return vertices;

    }

    private getScreenPos(vertices: IPoint[]): IPoint[] {
        const { width, height } = this.canvas;
        const res = vertices.map(vertex => ({
            x: 0 + (vertex.x + 1) / 2 * width,
            y: height - (vertex.y + 1) / 2 * height,
            z: vertex.z,
        }));
        return res;
    }

}


