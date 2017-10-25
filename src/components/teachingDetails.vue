<template>
    <section class="check-suggestion-box" v-if="knowledgeShow">
      <header class="check-suggestion-title">
        <button class="check-suggestion-back" @click="goBack()">
          <i class="icon-leftArrow"></i>
          <span>返回</span>
        </button>
      </header>
      <section class="disease-detail-content">
        <header class="disease-detail-title">
          <h2>{{teachingDetail.knowledgeTitle}}</h2>
        </header>
        <section class="tc-articleMain" v-html="teachingDetail.knowledgeContent">{{teachingDetail.knowledgeContent}}</section>
        <footer class="disease-detail-footer"><p>©著作权归作者所有</p></footer>
      </section>
    </section>
</template>
<script type="text/ecmascript-6">
  import ajax from "../common/js/ajax";
   const XHRList = {
     getTeachingDetail:"/call/comm/data/knowledge/content/v1/getMapById/"
   }
    export default{
        data(){
            return {
              teachingDetail:""
            }
        },
        mounted(){
          this.getTeachingDetail();
        },
        methods:{
          getTeachingDetail(){
            let that = this;
            ajax({
              url: XHRList.getTeachingDetail,
              method: 'POST',
              data: {
                isValid:1,
                firstResult:0,
                maxResult:999,
                knowledgeId:that.knowledgeId
              },
              done(data){
                if (data.responseObject.responseData.dataList) {
                  that.teachingDetail = data.responseObject.responseData.dataList[0];
                }
              }
            })
          },
          goBack(){
            this.$emit('update:knowledgeShow',false);
            this.$emit('goBack',true);
          }
        },
        props:{
          knowledgeShow:{
            type:Boolean
          },
          knowledgeId:{
            type:String
          }
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../scss/base.scss";
  .disease-teach-detail {
    .check-suggestion-box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 800px;
      background-color: #fff;
      transition: all 0.3s ease-in-out;
    }
    .check-suggestion-title {
      position: relative;
      background: #d9dfec;
      text-align: center;
      color: #222;
      font-size: 18px;
      padding: 22px 0;
      height: 60px;
      box-sizing: border-box;
      .check-suggestion-back{
        position: absolute;
        left: 40px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
        .icon-leftArrow{
          display: inline-block;
          background: url(../assets/img00/check/qustion_arrow_left.png) no-repeat;
          background-size: 100% 100%;
          width: 16px;
          height: 16px;
        }
        span{
          display: inline-block;
          font-size: 16px;
          color: #555;
        }
      }
    }
  }

  .disease-detail-content {
    padding: 40px;
    box-sizing: border-box;
    overflow: auto;
    height:520px;
    img{
      display:block;
      width:100%;
    }
  }

  .disease-detail-title {
    padding-bottom: 20px;
    & > h2 {
      font-size: 22px;
      color: #222;
      margin-bottom: 20px;
    }
    & > article {
      font-size: 0;
      & > p{
        font-size: 13px;
        color: #909090;
        opacity: 0.9;
        display: inline-block;
        vertical-align: middle;
        margin-right: 12px;
      }
    }
  }
  .tc-articleMain{
    & > p{
      padding-top:30px;
      font-size:16px;
      color:#333333;
      line-height:28px;
    }
    & > figure{
      img{
        padding-top:30px;
        display:block;
        width:100%;
      }
      p{
        margin:12px 0;
        color:#aaaaaa;
        text-align:center;
        font-size:14px;
      }
    }
    .disease-detail-item-img{
      width: 100%;
      margin:10px 0;
      & > img{
        width: 100%;
        vertical-align: top;
      }
    }
    .disease-detail-item-img-tips{
      text-align: center;
      font-size: 14px;
      color: #AAAAAA;
    }
  }

  .disease-detail-footer{
    text-align: right;
    font-size: 14px;
    color: #AAAAAA;
  }
</style>
