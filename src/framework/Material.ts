import { Color, IColor } from "./Color";


export interface IMaterial {
    color: IColor;
    uvMap?: Float32Array;
    imageData?: ImageData;
    getColorFromUv: (u:number, v: number) => IColor;
}

export class Material implements IMaterial {

    //public color: IColor;
    constructor(public color: IColor, public uvMap?: Float32Array, public imageData?: ImageData){
        //this.color = color;
    }

    getColorFromUv(u:number, v:number) {
        if (!this.imageData) {
            return this.color;
        }
        const {width, height, data} = this.imageData;

        const x = Math.floor(u * (width - 1));
        // 这里翻转是因为图片的uvMap就是y轴翻转的
        const y = Math.floor((1-v) * (height - 1));

        const index = (y * width + x) * 4;

        return new Color(data[index], data[index+1], data[index+2], data[index+3]);
    }
    
}
