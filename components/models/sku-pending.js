class SkuPending {
    pending = [];//记录用户选择

    constructor() {

    }

    insertCell(cell, x) {
        this.pending[x] = cell;
    }

    removeCell(x) {
        this.pending[x] = null;
    }

    findSelectedCellByX(x) {
        return this.pending[x];
    }

    isSelected(cell, x) {
        const pendingCell = this.pending[x];
        if (!pendingCell) {
            return false;
        }
        return cell.id === pendingCell.id;
    }

}

export {SkuPending}