import {Matrix} from "./matrix";
import {Fence} from "./fence";

class FenceGroup {
    spu;
    skuList = [];

    constructor(spu) {
        this.spu = spu;
        this.skuList = spu.sku_list;
    }

    initFences1() {
        const martix = this._createMatrix(this.skuList);
        const fences = [];
        let currentJ = -1;//当前列号
        martix.forEach((element, i, j) => {
            if (currentJ !== j) {
                //开启了一个新列
                currentJ = j;
                fences[currentJ] = this._createFence();
            }
            fences[currentJ].pushValueTitle(element.value);
        })
        //console.log(fences);
    }

    initFences() {
        const martix = this._createMatrix(this.skuList);
        const fences = [];
        const AT = martix.transpose();
        //console.log(AT);
        AT.forEach(r => {
            const fence = new Fence(r);
            fence.init();
            fences.push(fence);
        })
        //console.log(fences);
    }

    _createFence() {
        const fence = new Fence();
        return fence;
    }

    _createMatrix(skuList) {
        const m = [];
        skuList.forEach(sku => {
            m.push(sku.specs);
        });
        return new Matrix(m);
    }
}

export {FenceGroup}