<template>
    <section class="big-confirm-box">
        <section class="big-confirm-inner">
            <header class="big-confirm-title"><h4>{{comfirmData.title}}</h4><i class="icon-close window-close" @click="cancel"></i></header>
            <article class="big-confirm-content"><p>{{comfirmData.content}}</p></article>
            <footer class="big-confirm-btn">
                <button class="btn-border" @click="cancel">取消</button>
                <button class="btn-primary" @click="ensure">确定</button>
             </footer>
         </section>
    </section>
</template>
<script type="text/ecmascript-6">
    /**
     * @Desc：
     * @Usage:
     * @Notify：
     * @Depend：
     *
     * Created by Qiangkailiang on 17/10/22.
     */
    export default{
        data(){
            return {}
        },
        mounted(){
        },
        methods:{
            ensure(){
                this.$emit("ensureCallback");
            },
            cancel(){
                this.$emit("cancelCallback");
            }
        },
        props: {
            comfirmData:{
                type:Object
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
    @import "../scss/base.scss";
    .big-confirm-box {
        position: absolute;
        bottom: 0;
        right: 0;
        top: 0;
        left: 0;
        text-align: center;
        background-color: rgba(0,0,0,0.64);
        z-index: 5;
        &:before {
            content: '';
            display: inline-block;
            vertical-align: middle;
            height: 100%;
        }
        .big-confirm-inner {
            display: inline-block;
            vertical-align: middle;
            background-color: #fff;
            border-radius: 4px;
            width: 550px;
            height: 300px;
        }
        .big-confirm-title {
            background: #D9DFEC;
            border-radius: 4px 4px 0 0;
            width: 100%;
            height: 40px;
            position: relative;
            & > h4 {
                font-weight: normal;
                font-size: 14px;
                color: #222222;
                height: 100%;
                line-height: 40px;
            }
            .window-close {
                position: absolute;
                right: 0;
                top: 0;
                margin-right: -34px;
                cursor: pointer;
            }
        }
        .big-confirm-content {
            margin-top: 90px;
            text-align: center;
            & > p {
                font-size: 18px;
                color: #222222;
            }
        }
        .big-confirm-btn {
            text-align: center;
            margin-top: 72px;
            font-size: 0;
            & > button {
                display: inline-block;
                vertical-align: middle;
                width: 70px;
                height: 30px;
                line-height: 30px;
                margin: 0 10px;
                cursor: pointer;
                &.disabled{
                    background-color: #CCCCCC;
                }
            }
        }
        .big-confirm-input {
            width: 100%;
            resize: none;
            height: 175px;
            padding: 20px;
            border: 1px solid #F6FAFA;
            box-sizing: border-box;
            font-size: 15px;
            color: #222222;
            @include placeholder() {
                font-size: 14px;
                color: #AAAAAA;
            }
            & + .big-confirm-btn {
                margin-top: 23px;
            }
        }
    }
</style>
