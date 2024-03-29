import {SkuCode} from "./sku-code";
import {CellStatus} from "../../core/enum";
import {SkuPending} from "./sku-pending";
import {Joiner} from "../../utils/joiner";

class Judger {

    fenceGroup;
    pathDict = [];//字典
    skuPending;

    constructor(fenceGroup) {
        this.fenceGroup = fenceGroup;
        this._initPathDict();
        this._initSkuPending();
    }

    isSkuIntact() {
        return this.skuPending.isIntact();
    }

    getCurrentValues() {
        return this.skuPending.getCurrentSpecValues();
    }

    getMissingKeys() {
        const missingKeysIndex = this.skuPending.getMissingSpecKeysIndex();
        return missingKeysIndex.map(i => {
            return this.fenceGroup.fences[i].title;
        })
    }

    _initSkuPending() {
        const specsLength = this.fenceGroup.fences.length;
        this.skuPending = new SkuPending(specsLength);
        const defaultSku = this.fenceGroup.getDefaultSku();
        if (!defaultSku) {
            return;
        }
        this.skuPending.init(defaultSku);
        this._initSelectedCell();
        this.judge(null, null, null, true);
    }

    //给默认的sku cell 加上选中状态
    _initSelectedCell() {
        this.skuPending.pending.forEach(cell => {
            this.fenceGroup.setCellStatusById(cell.id, CellStatus.SELECTED);
        })
    }

    _initPathDict() {
        this.fenceGroup.spu.sku_list.forEach(s => {
            const skuCode = new SkuCode(s.code);
            this.pathDict = this.pathDict.concat(skuCode.totalsegments);
        })
        console.log(this.pathDict);
    }

    judge(cell, x, y, isInit = false) {
        if (!isInit) {
            this._changeCurrentCellStatus(cell, x, y);
        }

        this.fenceGroup.eachCell((cell, x, y) => {
            const path = this._findPotentialPath(cell, x, y);
            const isIn = this._isInDict(path);
            if (!path) {
                return;
            }
            if (isIn) {
                this.fenceGroup.setCellStatusByXY(x, y, CellStatus.WAITING);
                //this.fenceGroup.fences[x].cells[y].status = CellStatus.WAITING;
            } else {
                this.fenceGroup.setCellStatusByXY(x, y, CellStatus.FORBIDDEN);
                //this.fenceGroup.fences[x].cells[y].status = CellStatus.FORBIDDEN;
            }
        });
    }


    //得到一个完整的sku
    getDeterminateSku() {
        const code = this.skuPending.getSkuCode();
        const sku = this.fenceGroup.getSku(code);
        return sku;
    }

    _isInDict(path) {
        return this.pathDict.includes(path);
    }

    //寻找潜在路径
    _findPotentialPath(cell, x, y) {
        const joiner = new Joiner('#');
        for (let i = 0; i < this.fenceGroup.fences.length; i++) {
            const selected = this.skuPending.findSelectedCellByX(i);
            if (x === i) {
                //当前行
                if (this.skuPending.isSelected(cell, x)) {
                    return;
                }
                const cellCode = this._getCellCode(cell.spec);
                joiner.join(cellCode);
            } else {
                //其他行
                //找到其他行的已选元素
                if (selected) {
                    const selectedCellCode = this._getCellCode(selected.spec);
                    joiner.join(selectedCellCode);
                }
            }
        }
        return joiner.getStr();
    }

    _getCellCode(spec) {
        return spec.key_id + '-' + spec.value_id;
    }

    _changeCurrentCellStatus(cell, x, y) {
        if (cell.status === CellStatus.WAITING) {
            // cell.status = CellStatus.SELECTED;
            //this.fenceGroup.fences[x].cells[y].status = CellStatus.SELECTED;
            this.fenceGroup.setCellStatusByXY(x, y, CellStatus.SELECTED);
            this.skuPending.insertCell(cell, x);
        }
        if (cell.status === CellStatus.SELECTED) {
            // cell.status = CellStatus.WAITING;
            //this.fenceGroup.fences[x].cells[y].status = CellStatus.WAITING
            this.fenceGroup.setCellStatusByXY(x, y, CellStatus.WAITING);
            this.skuPending.removeCell(x);
        }
    }
}

export {Judger}