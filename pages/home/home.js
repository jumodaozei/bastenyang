import {Theme} from "../../model/theme";
import {Banner} from "../../model/banner";
import {Category} from "../../model/category";
import {Activity} from "../../model/Activity";
import {SpuPaging} from "../../model/spu-paging";

Page({
    /**
     * 页面的初始数据
     */
    data: {
        themeA: null,
        bannerB: null,
        grid: [],
        activityD: null,
        themeE: null,
        bannerG: null,
        themeH: null,
        spuPaging: null,
        loadingType: 'loading'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.initAllData();
        this.initBottomSpuList();
    },

    async initBottomSpuList() {
        const paging = SpuPaging.getLatestPaging();
        this.data.spuPaging = paging;
        const data = await paging.getMoreData();
        if (!data) {
            return;
        }
        wx.lin.renderWaterFlow(data.items);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: async function () {
        const data = await this.data.spuPaging.getMoreData();
        if (!data) {
            return;
        }
        wx.lin.renderWaterFlow(data.items);
        if (!data.moreData) {
            this.setData({
                loadingType: 'end'
            });
        }
    },

    async initAllData() {
        const theme = new Theme();
        await theme.getThemes();

        const themeA = await theme.getHomeLocationA();
        const themeE = await theme.getHomeLocationE();
        let themeESpu = [];
        if (themeE.online) {
            const data = await Theme.getHomeLocationESpu();
            if (data) {
                themeESpu = data.spu_list.slice(0, 8);
            }
        }
        const themeF = await theme.getHomeLocationF();

        const bannerB = await Banner.getHomeLocationB();
        const grid = await Category.getHomeLocationC();
        const activityD = await Activity.getHomeLocationD();

        const bannerG = await Banner.getHomeLocationG();

        const themeH = await theme.getHomeLocationH();

        this.setData({
            themeA,
            bannerB,
            grid,
            activityD,
            themeE,
            themeESpu,
            themeF,
            bannerG,
            themeH
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})