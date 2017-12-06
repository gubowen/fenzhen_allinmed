<template>
    <article>
        <figure class="messageList-item-content">
            <!--患者头像-->
            <figure class="messageList-item-img">
                <img :src="$store.state.currentItem.logoUrl" alt="">
            </figure>
            <figcaption class="messageList-item-text">
                <span>{{content}}点击至</span>
                <a href='#' class='link' @click='goToCheck'>"专科检查"</a>
                <span>查看。</span>
                <span v-if="showType==='videoTriage'||showType==='imageTriage'">若视频上传中，请稍候再次点击查看。</span>
            </figcaption>
        </figure>
    </article>
</template>
<script type="text/ecmascript-6">
    /**
     * @Desc：
     * @Usage:
     * @Notify：
     * @Depend：
     *
     * Created by Qiangkailiang on 17/11/1.
     */
    export default{
        data(){
            return {
                content: ""
            }
        },
        mounted(){
            this.contentSwitch(this.showType);
        },
        methods: {
            contentSwitch(type){
                let result = "";
                switch (type) {
                    case "videoTriage":
                    case "imageTriage":
                        result = "患者已上传视诊资料，";
                        break;
                    case "checkSuggessSendTips":
                        result = "患者已上传检查资料，";
                        break;
                }
                this.content=result;
            },
            goToCheck(){
                this.$router.push({
                    path: "/home/majorCheck/",
                    params: {
                        num: JSON.stringify(this.$store.state.currentItem)
                    }
                })
            }
        },
        props: {
            showType: {
                type: String
            }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">

</style>
