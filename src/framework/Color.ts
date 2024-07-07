import { clamp } from "../utils/Math";

export interface IColor {
    r: number;
    g: number;
    b: number;
    a: number;

    multiple(value:number):IColor;
    clone():IColor;
    add(color: IColor):IColor;
}


export class Color implements IColor {
    constructor(public r = 255, public g = 255, public b = 255, public a = 255) {}

    multiple(value: number) {
        this.r = clamp((this.r/256 * value), 0, 1) * 255;
        this.g = clamp((this.g/256 * value), 0, 1) * 255;
        this.b = clamp((this.b/256 * value), 0, 1) * 255;
        return this;
    }

    clone() {
        return new Color(this.r, this.g, this.b, this.a);
    }

    add(color:IColor) {
        this.r = clamp(this.r / 256 + color.r / 256, 0, 1) * 255;
        this.g = clamp(this.g / 256 + color.g / 256, 0, 1) * 255;
        this.b = clamp(this.b / 256 + color.b / 256, 0, 1) * 255;
        return this;
    }

    static Red() {
        return new this(255, 0, 0);
    }


    static Green() {
        return new this(0, 255, 0);
    }

    static Blue() {
        return new this(0, 0, 255);
    }

}
