<template>
    <div :class="classObj" class="app-wrapper">
        <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
        <sidebar class="sidebar-container"/>
        <div class="main-container">
            <div :class="{'fixed-header':fixedHeader}">
                <navbar/>
                <tags-view v-if="needTagsView"/>
            </div>
            <app-main/>
            <el-footer class="el-main-footer" style="display: flex;align-items: center;">
                <a href="https://www.csnight.xyz">@CSNight - </a>
                <a  href="http://www.beian.miit.gov.cn"
                   target="_blank">RMS开源小站 - 京ICP备20008725号 - </a>
                <img :src="ba"  alt=""/>
                <a target="_blank"
                   href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502040454">
                    京公网安备 11010502040454号 - </a>
                <a href="https://github.com/CSNight/RedisMonitorServices/blob/master/LICENSE"
                   target="_blank"> MIT License</a>
            </el-footer>
        </div>
    </div>
</template>

<script>
    import AppMain from './AppMain'
    import Sidebar from './sider/SideBar'
    import Navbar from "./nav/Navbar";
    import TagsView from "./TagsView"
    import {mapState} from "vuex";

    export default {
        name: "Index",
        data() {
            return {
                // eslint-disable-next-line no-undef
                ba: require('../assets/ba.png'),
            }
        },
        components: {
            AppMain,
            Navbar,
            Sidebar,
            TagsView
        }, computed: {
            ...mapState({
                needTagsView: state => state.dynamic.showTagsView,
            }),
            sidebar() {
                return this.$store.state.app.sidebar
            },
            device() {
                return this.$store.state.app.device
            },
            fixedHeader() {
                return true
            },
            classObj() {
                return {
                    hideSidebar: !this.sidebar.opened,
                    openSidebar: this.sidebar.opened,
                    withoutAnimation: this.sidebar.withoutAnimation,
                    mobile: this.device === 'mobile',

                }
            }
        },
        methods: {
            handleClickOutside() {
                this.$store.dispatch('app/closeSideBar', {withoutAnimation: false})
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-main-footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #aaaaaa;
        font-size: 12px;
        text-align: left;
        line-height: 20px;
        height: 20px !important;
        background: linear-gradient(#ffffff 0%, #eeeeee 100%, #ffffff 0%);
        color: #7a8b9a;

        a {
            position: relative;
            bottom: 0;
        }
    }
</style>