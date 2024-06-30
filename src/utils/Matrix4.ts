

export class Matrix4 {
    elements: Array<number>;
    constructor() {
        this.elements = new Array(16).fill(0);
    }

    set(
        n11:number, n12:number, n13:number, n14:number,
        n21: number, n22:number, n23:number, n24:number,
        n31: number, n32:number, n33: number, n34: number,
        n41:number, n42:number, n43:number, n44:number
       ) {
        this.elements = [
            n11, n12, n13, n14,
            n21, n22, n23, n24,
            n31, n32, n33, n34,
            n41, n42, n43, n44
        ];

    }

    clone() {
        const cloneMat = new Matrix4();
        cloneMat.elements = [...this.elements];
        return cloneMat;
    }

    apply(mat: Matrix4) {
        for (let row=1; row<=4;row++) {
            for (let column=1; column<=4;column++) {
                let val = 0;
                for (let i=1; i<=4; i++) {
                    val += mat.getIndex(row, i) * this.getIndex(i, column);
                }
                this.setElement(row, column, val);
            }
        }

        return this;

    }

    getIndex(row: number, column: number) {
        return this.elements[(row-1) * 4 + column - 1];
    }

    private setElement(row: number, column: number, val: number) {
        this.elements[(row-1)*4+column-1] = val;
    }
}
