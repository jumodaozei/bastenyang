class HistoryKeyword {
    static MAX_ITEM_COUNT = 20;

    keywords = [];

    static KEY = "keywords";

    constructor() {
        this.keywords = this._getLocalKeyWords();
    }

    save(keyword) {
        const items = this.keywords.filter(k => {
            return k === keyword;
        })
        if (items.length !== 0) {
            return;
        }
        if (this.keywords.length >= HistoryKeyword.MAX_ITEM_COUNT) {
            this.keywords.pop();
        }
        this.keywords.unshift(keyword);
        this._refreshLocal();
    }

    get() {
        return this.keywords;
    }

    clear() {
        this.keywords = [];
        this._refreshLocal();
    }

    _refreshLocal() {
        wx.setStorageSync(HistoryKeyword.KEY, this.keywords);
    }

    _getLocalKeyWords() {
        const keywords = wx.getStorageSync(HistoryKeyword.KEY);
        if (!keywords) {
            wx.setStorageSync(HistoryKeyword.KEY, []);
            return [];
        }
        return keywords;
    }
}

export {HistoryKeyword}