class Matrix {
    m;

    constructor(martix) {
        this.m = martix;
    }

    get rowsNum() {
        return this.m.length;
    }

    get colsNum() {
        return this.m[0].length;
    }

    forEach(cb) {
        for (let j = 0; j < this.colsNum; j++) {
            for (let i = 0; i < this.rowsNum; i++) {
                const element = this.m[i][j];
                cb(element, i, j);
            }
        }
    }

    //自己实现矩阵的转置
    transpose() {
        const desArr = [];
        for (let j = 0; j < this.colsNum; j++) {
            desArr[j] = [];
            for (let i = 0; i < this.rowsNum; i++) {
                desArr[j][i] = this.m[i][j];
            }
        }
        return desArr;
    }
}

export {Matrix}