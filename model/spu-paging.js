import {Paging} from "../utils/paging";

export class SpuPaging {
    static getLatestPaging() {
        return new Paging({
            url: `spu/latest`
        }, 5)
    }
} 