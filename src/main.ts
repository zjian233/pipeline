import { PerspectiveCamera,Canvas, Scene } from "./framework";
import { Box } from "./framework/Box";
import { Color } from "./framework/Color";
import { Light } from "./framework/Light";
import { Material } from "./framework/Material";
import { Point } from "./utils/Point";
import { Vector } from "./utils/Vector";

async function loadTexture() {
    // const res = await fetch('/cubetexture.png');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = '/cubetexture.png';
    const imageData:ImageData = await new Promise((resolve) => {
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;

            ctx!.drawImage(image, 0, 0);
            resolve(ctx!.getImageData(0, 0, image.width, image.height));
            
        }
    });

    // console.log('imageData, ', imageData);
    // 每个像素对应的uv坐标
    const uvMap = new Float32Array(image.width * image.height * 2);

    for (let i=0; i<imageData?.height; i++) {
        for (let j=0; j<imageData.width; j++) {
            const u = j / (imageData.width -1);
            const v = i / (imageData.height - 1);

            const index = (i*imageData.width + j) * 2;
            uvMap[index] = u;
            uvMap[index+1] = v;
        }
    }
    
    return {uvMap, imageData};
    // console.log('res:', res);
    // return res as any;
}

async function main() {
    const textureUvMap = await loadTexture();
    test(textureUvMap);
}

function test(texture: any) {
    // 
    const app = document.getElementById('app')!;
    const canvas = new Canvas(app);

    // 添加scene
    const scene = new Scene();
    canvas.setScene(scene);

    const box = new Box(2, 2, 2);
    box.setMaterial(new Material(new Color(0, 122, 255), texture.uvMap, texture.imageData));
    scene.add(box);

    // 添加光
    const light = new Light();
    light.setPosition(new Point(-2, 3, 3));
    light.setIntensity(20);
    canvas.addLight(light);

    // 设置相机位置
    const camera = new PerspectiveCamera(90, 1, 1, 10);
    camera.setPosition(new Point(4, 3, 3));
    camera.setUp(new Vector(0, 1, 0));
    camera.lookAt(new Point(0, 0, 0));
    canvas.setCamera(camera);

    // 渲染
    canvas.render();
}

window.onload = main;

