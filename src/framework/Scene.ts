import { IObject3D } from "./Object3D";

export class Scene {
    public children: IObject3D[] = [];

    add(object: IObject3D) {
        this.children.push(object);
    }
}


