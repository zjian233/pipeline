import { PerspectiveCamera,Canvas, Scene } from "./framework";
import { Box } from "./framework/Box";
import { Color } from "./framework/Color";
import { Light } from "./framework/Light";
import { Material } from "./framework/Material";
import { Point } from "./utils/Point";
import { Vector } from "./utils/Vector";

function main() {
    test();
}

function test() {
    // 
    const app = document.getElementById('app')!;
    const canvas = new Canvas(app);

    // 添加scene
    const scene = new Scene();
    canvas.setScene(scene);

    const box = new Box(2, 2, 2);
    box.setMaterial(new Material(new Color(0, 122, 255)));
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

