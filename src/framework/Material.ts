import { IColor } from "./Color";


export interface IMaterial {
    color: IColor;
}

export class Material implements IMaterial {

    //public color: IColor;
    constructor(public color: IColor){
        //this.color = color;
    }
    
}
