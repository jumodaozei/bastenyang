import {combination} from "../../utils/util";

class SkuCode {

    code;
    spuId;
    totalsegments = [];

    constructor(code) {
        this.code = code;
        this._splitToSeqment();
    }

    _splitToSeqment() {
        const spuAndSpec = this.code.split('$');
        this.spuId = spuAndSpec[0];
        const specCodeArray = spuAndSpec[1].split('#');
        const length = specCodeArray.length;
        for (let i = 1; i <= length; i++) {
            const segments = combination(specCodeArray, i);
            const newSegments = segments.map(segs => {
                return segs.join('#');
            });
            this.totalsegments = this.totalsegments.concat(newSegments);
            // console.log(newSegments);
        }
    }
}

export {SkuCode}