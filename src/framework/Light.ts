import { IPoint } from "../utils/Point";
import { Color } from "./Color";


export class Light {
    private intensity: number;

    declare private pos: IPoint;

    color  = new Color(255, 255, 255);

    constructor(intensity: number = 1) {
        this.intensity = intensity;
    }

    setPosition(pos: IPoint) {
        this.pos = pos;
    }


    getPosition() {
        return this.pos;
    }

    getIntensity() {
        return this.intensity;
    }

    setIntensity(value: number) {
        this.intensity = value;
    }
}
