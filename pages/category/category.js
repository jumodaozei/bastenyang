// pages/category/category.js
import {getSystemSize} from "../../utils/system";
import {px2rpx} from "../../utils/util";
import {Categories} from "../../model/categories";
import {SpuListType} from "../../core/enum";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        defaultRootId: 2
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setDynamicSegmentHeight();
        this.initCategoryData();
    },

    async initCategoryData() {
        const categories = new Categories();
        this.data.categories = categories;
        await categories.getAll();
        const roots = categories.getRoots();
        const defaultRoot = this.getDefaultRoot(roots);
        const currentSubs = categories.getSubs(defaultRoot.id);
        this.setData({
            roots,
            currentSubs,
            currentBannerImg: defaultRoot.img
        });
    },

    getDefaultRoot(roots) {
        let defaultRoot = roots.find(r => r.id === this.data.defaultRootId);
        if (!defaultRoot) {
            defaultRoot = roots[0];
        }
        return defaultRoot;
    },

    async setDynamicSegmentHeight() {
        const res = await getSystemSize();
        const windowHeihtRpx = px2rpx(res.windowHeight);
        const h = windowHeihtRpx - 60 - 20 - 2;
        this.setData({
            segHeight: h
        });
    },

    onSegChange(event) {
        const rootId = event.detail.activeKey;
        const currentSubs = this.data.categories.getSubs(rootId);
        const currentRoot = this.data.categories.getRoot(rootId);
        this.setData({
            currentSubs,
            currentBannerImg: currentRoot.img
        });
    },

    onJumpToSpuList(event) {
        const cid = event.detail.cid;
        console.log(cid)
        wx.navigateTo({
            url: `/pages/spu-list/spu-list?cid=${cid}&type=${SpuListType.SUB_CATEGORY}`
        })
    },

    onGotoSearch(event) {
        wx.navigateTo({
            url: `/pages/search/search`
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})