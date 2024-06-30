import { range } from "../utils/Math";
import { IPoint } from "../utils/Point";
import { Vector } from "../utils/Vector";
import { PerspectiveCamera } from "./Camera";
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

    constructor(el: HTMLElement, props = {width: 500, height: 500}) {
        const canvas = document.createElement('canvas');
        const { width, height} = props;
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

    render() {
        this.initImageData();
        for (let i=0; i<this.scene.children.length; i++) {
            const object = this.scene.children[i];
            this.renderObject(object);
        }
        this.drawImageData();
    }

    private initImageData() {
        //this.renderMap = new Array(this.canvas.height).fill(new Array(this.canvas.width).fill(0));
        const {height, width} = this.canvas;
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height) as ImageData;
        this.zBuffers = new Array(height*width);
        for (let i=0; i<height * width; i++) {
            this.zBuffers[i] = -1000000;
        }
    }

    private drawImageData() {
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    renderObject(object: IObject3D) {
        const transformedVetexs = this.transformPoint(object.getRenderVertices())
        console.log('vertex:', transformedVetexs);
        // 裁剪
        const clipVetexs = this.clipping(transformedVetexs);
        const screenPosArr = this.getScreenPos(clipVetexs);
        this.draw(screenPosArr);

        for (let i=0; i<object.children.length; i++) {
            this.renderObject(object.children[i]);
        }
    }

    draw(vertices: IPoint[]) {
        const len = vertices.length;
        if (len < 3) {
            return;
        }
        for (let i=0; i<vertices.length; i+=3) {
            const a = vertices[i],b = vertices[i+1], c=vertices[i+2];
            this.drawTriangle(a, b, c);
            //this.ctx.beginPath();
            //this.ctx.moveTo(a.x, a.y);
            //this.ctx.lineTo(b.x, b.y);
            //this.ctx.lineTo(c.x, c.y);
            //this.ctx.lineTo(a.x, a.y);
            //this.ctx.strokeStyle = 'blue';
            //this.ctx.lineWidth = 1;
            //this.ctx.stroke();
        }
        
    }

    drawTriangle(a:IPoint, b: IPoint, c: IPoint) {
        for (let i=0; i<this.canvas.height; i++) {
            for (let j=0; j<this.canvas.width; j++) {
                const pointValue = this.getPointValue([j, i], a, b, c);
                
                if (pointValue > 0) {
                    // 判断zBuffers
                    const [w1,w2,w3] = this.getBarycentric([j+0.5, i+0.5], a, b, c);
                    const z = w1*a.z +w2*b.z +w3*c.z; 

                    const idx = i*this.canvas.width + j;

                                        //const z = this.zBuffers[i][j] +1;
                    //console.log('z, ', i, j);
                    // console.log('i j', i, j);
                    
                    if ( z >= this.zBuffers[idx]) {
                        this.zBuffers[idx] = z;
                        const index = (i * this.canvas.width + j) *4;
                        this.imageData.data[index] = 250;
                        this.imageData.data[index+1] = 10;
                        this.imageData.data[index+2] = 10;
                        this.imageData.data[index+3] = 255 * pointValue;
                    //this.renderMap[i][j] = 0x33333;
                    }
                }
            }
        }
    }

    // 获取点的重心
    getBarycentric(p: number[], a:IPoint, b: IPoint, c:IPoint){
        const px = p[0], py = p[1];
        const w1 = (
            (b.y-c.y)*(px-b.x)+(c.x-b.x)*(py-b.y))/(
            (b.y-c.y)*(a.x-b.x)+(c.x-b.x)*(a.y-b.y)
        );
        const w2 = (
            (c.y-a.y)*(px-c.x)+(a.x-c.x)*(py-c.y))/(
            (c.y-a.y)*(b.x-c.x)+(a.x-c.x)*(b.y-c.y)
        );
        const w3 = 1 - w1 - w2;

        return [w1, w2, w3];
    }

    getPointValue(p:number[], a:IPoint, b: IPoint, c: IPoint) {
        let res = 0;
        const iter = [0.25, 0.75];
        for (let i=0; i<iter.length; i+=1) {
            for (let j=0; j<iter.length; j++) {
                const x = p[0] + iter[i];
                const y = p[1] + iter[j];    
                const cross1 = (b.x-a.x)*(y-a.y) - (b.y-a.y)*(x - a.x);
                const cross2 = (c.x-b.x)*(y -b.y) - (c.y-b.y)*(x - b.x);
                const cross3 = (a.x-c.x)*(y-c.y) - (a.y-c.y)*(x - c.x);

                if (cross1 > 0 && cross2 > 0 && cross3 > 0) {
                    res ++;
                }

                if (cross1 <0 && cross2 < 0 && cross3 < 0) {
                    res ++;
                }
            }
            
        }
        return res / 4;
    }

    private transformPoint(vertices: IPoint[]):IPoint[] {
        const res =[];
        for (let i=0; i<vertices.length; i++) {
            const viewMatrix = this.camera.getViewMatrix();
            const projectionMatrix = this.camera.getProjectionMatrix();
            const result = Vector.setFromPoint(vertices[i]).applyMatrix4(viewMatrix).applyMatrix4(projectionMatrix);
            res.push(result);
        }
        return res;
    }

    // Todo;
    private clipping(vertices: IPoint[]):IPoint[] {
        const isAllIn = vertices.every(vertex => range(vertex.x, -1, 1) && range(vertex.y, -1, 1) && range(vertex.z, -1, 1));

        if (isAllIn) {
            return vertices;
        }

        return vertices;

    }

    private getScreenPos(vertices: IPoint[]):IPoint[] {
        const {width, height} = this.canvas;
        const res = vertices.map(vertex => ({
            x: 0 + (vertex.x + 1)/2*width, 
            y: height - (vertex.y + 1)/2 * height,
            z: vertex.z,
        }));
        return res;
    }

}


