import {Matrix} from "./matrix";
import {Fence} from "./fence";
import {CellStatus} from "../../core/enum";

class FenceGroup {
    spu;
    skuList = [];
    fences = [];

    constructor(spu) {
        this.spu = spu;
        this.skuList = spu.sku_list;
    }

    getDefaultSku() {
        const defaultSkuId = this.spu.default_sku_id;
        if (!defaultSkuId) {
            return;
        }
        return this.skuList.find(s => s.id === defaultSkuId);
    }

    getSku(skuCode) {
        const fullSkuCode = this.spu.id + '$' + skuCode;
        const sku = this.spu.sku_list.find(s => s.code === fullSkuCode);
        return sku ? sku : null;
    }

    setCellStatusById(cellId, status) {
        this.eachCell((cell) => {
            if (cell.id === cellId) {
                cell.status = status;
            }
        })
    }

    setCellStatusByXY(x, y, status) {
        this.fences[x].cells[y].status = status;
    }

    initFences1() {
        const martix = this._createMatrix(this.skuList);
        const fences = [];
        let currentJ = -1;//当前列号
        martix.each((element, i, j) => {
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
            if (this._hasSketchFence() && this._isSketchFence(fence.id)) {
                fence.setFenceSketch(this.skuList);
            }
            fences.push(fence);
        })
        this.fences = fences;
        // console.log(fences);
    }

    _hasSketchFence() {
        return this.spu.sketch_spec_id ? true : false;
    }


    //判断是不是可视规格
    _isSketchFence(fenceId) {
        return this.spu.sketch_spec_id === fenceId ? true : false;
    }

    eachCell(cb) {
        for (let i = 0; i < this.fences.length; i++) {
            for (let j = 0; j < this.fences[i].cells.length; j++) {
                const cell = this.fences[i].cells[j];
                cb(cell, i, j);
            }
        }
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