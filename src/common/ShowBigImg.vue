<template>
  <!--<transition name="fade">-->
  <section class="show-big-img show-big-img-masker full-screen" v-if="$store.state.SBIFlag">
    <div class="background-hidden " >
      <div class="rotate-button"></div>
      <div class="bigger-button"></div>
      <div class="smaller-button"></div>
      <div class="download-button" ></div>
      <div class="gallery-top">
        <div class="swiper-container topSwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide swiper-no-swiping" v-for="item in imgList">
              <img :src="item.url"/>
            </div>
          </div>
          <div class="swiper-pagination swiper-pagination-white"></div>
        </div>
        <div class="swiper-left-gray" v-show="imgList.length>1"></div>
        <div class="swiper-right-gray" v-show="imgList.length>1"></div>
      </div>
      <div class="close" @click="close()"></div>
      <div class="gallery-thumbs" v-show="imgList.length>1">
        <div class="swiper-container thumbSwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="item in imgList">
              <img :src="item.url"/>
            </div>
          </div>
          <div class="swiper-button-prev" slot="button-prev" v-show="imgList.length>6"></div>
          <div class="swiper-button-next" slot="button-next" v-show="imgList.length>6"></div>
          <div class="swiper-pagination swiper-pagination-white"></div>
        </div>
      </div>
    </div>
  </section>
  <!--</transition>-->
</template>
<script>
    //  import {swiper, swiperSlide} from 'vue-awesome-swiper'
    import Vue from 'vue'
    import VueAwesomeSwiper from 'vue-awesome-swiper'
    import Swiper from 'swiper';
    import 'swiper/dist/css/swiper.css';
    import showBigImg  from '../common/js/showBigImg';

    Vue.use(VueAwesomeSwiper);
    export default{
        name: 'show-big-img',
        data(){
            return {
                imgList: [
//          {
//            url: "https://nos.netease.com/nim/NDI3MzI1NQ==/bmltYV85NTkwMjczOTBfMTUwODQwNDY5OTg2Nl81OThiYjE4ZC1hZTNjLTRjMDYtYjE0ZS05MDk0ZmVkMzdhZjM="
//          }
//          ,
//          {
//            url: "https://nos.netease.com/nim/NDI3MzI1NQ==/bmltYV85NTkwMjczOTBfMTUwODQwNDY5OTg2Nl81OThiYjE4ZC1hZTNjLTRjMDYtYjE0ZS05MDk0ZmVkMzdhZjM="
//          },
//          {
//            url: "https://nos.netease.com/nim/NDI3MzI1NQ==/bmltYV85NTkwMjczOTBfMTUwODQwNDY5OTg2Nl81OThiYjE4ZC1hZTNjLTRjMDYtYjE0ZS05MDk0ZmVkMzdhZjM="
//          },
//          {
//            url: "https://nos.netease.com/nim/NDI3MzI1NQ==/bmltYV85NTkwMjczOTBfMTUwODQwNDY5OTg2Nl81OThiYjE4ZC1hZTNjLTRjMDYtYjE0ZS05MDk0ZmVkMzdhZjM="
//          }
                ]
            }
        },
        components: {
            VueAwesomeSwiper
        },
        props: {
            showBigImgFlag: {
                type: Boolean
            }
        },
        watch: {
            '$store.state.SBIList'(content){
                this.init();
            }
        },
        methods: {
            init(){
                this.imgList = [];
                this.imgList = this.$store.state.SBIObject[this.$store.state.SBIType];
                let that = this;
                this.imgList.forEach(function (element,value) {
                    that.imgList[value].url = that.clipImg(element.url);
                })
            },
            close(){
                this.$store.commit("setSBIFlag", false);
            },
            clipImg(imgUrl){
                if(imgUrl.indexOf("_c") != -1){
                    let beforeUrl = imgUrl.substring(0,imgUrl.indexOf("_c")+2);
                    let afterUrl = imgUrl.substring(imgUrl.lastIndexOf("."));
                    return beforeUrl+afterUrl;
                }else{
                    return imgUrl;
                }
            }
        },
        mounted(){
            this.init();
        },
        updated(){

            let index = this.$store.state.SBIIndex?this.$store.state.SBIIndex : 0 ;
            let topSwiper = new Swiper('.topSwiper', {
                direction: 'horizontal',
                zoom: true,
                initialSlide: index,
                prevButton: '.swiper-left-gray',
                nextButton: '.swiper-right-gray',//前进按钮的css选择器或HTML元素。
                onInit: function (swiper) {
                    console.log(swiper.activeIndex + "当前索引");
                    console.log("sipwer初始化完成!,回调函数，初始化后执行。");
                    //  setTimeout(function(){
                    $.openPhotoGallery($(".swiper-slide-active").eq(0));
                    //  },500);
                },
                onTap: function (swiper, event) {
                    console.log(swiper.activeIndex); //swiper当前的活动块的索引
                },
                onSlideChangeStart(swiper){
                    console.log(swiper.activeIndex + "当前索引");
                    // setTimeout(function(){
                    $.openPhotoGallery($(".swiper-slide-active").eq(0));
                    // },500);


                }
            });

            let thumbSwiper = new Swiper('.thumbSwiper', {
                initialSlide: index,
                spaceBetween: 10,
                direction: 'horizontal',
                centeredSlides: true,
                slidesPerView: 'auto',
                touchRatio: 1,
                slideToClickedSlide: true,
                observer: true,
                prevButton: '.swiper-button-prev',
                nextButton: '.swiper-button-next',//前进按钮的css选择器或HTML元素。
                loopedSlides: 5,
                paginationType: '',
                imgElementCallBack: function () {
                    console.log("为每个指定的图片（会触发大图）单击事件绑定回调函数");
                },
                onTap:function (swiper,event) {
                    swiper.slideTo(swiper.activeIndex)
                }


            });
            topSwiper.params.control = thumbSwiper;//需要在Swiper2初始化后，Swiper1控制Swiper2
            thumbSwiper.params.control = topSwiper;//需要在Swiper1初始化后，Swiper2控制Swiper1
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../scss/base.scss";
  .show-big-img-masker {
    position: absolute;
    bottom: 0;
    right: 0;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 5;
    .background-hidden {
      position: absolute;
      top: 65px;
      bottom: 65px;
      left: 250px;
      right: 250px;
      background: #000;
      padding: 65px 135px;

      .bigger-button {
        background: url("/static/img/img00/employee/picture_zoom.png") 50% 50% no-repeat;
        background-color: rgba(255, 255, 255, .3);
        border-radius: 4px;
        width: 34px;
        height: 34px;
        position: absolute;
        top: 72px;
        right: 27px;
        box-sizing: border-box;
        cursor: pointer;

        &.on {
          background: url("/static/img/img00/employee/photo_zoom out.png") 50% 50% no-repeat;
          background-color: rgba(255, 255, 255, .3);
        }

      }
      .rotate-button {
        background: url("/static/img/img00/employee/picture_rotate.png") 50% 50% no-repeat;
        background-color: rgba(255, 255, 255, .3);
        border-radius: 4px;
        width: 34px;
        height: 34px;
        position: absolute;
        top: 31px;
        right: 27px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .smaller-button {
        background: url("/static/img/img00/employee/picture_narrow.png") 50% 50% no-repeat;
        background-color: rgba(255, 255, 255, .3);
        border-radius: 4px;
        width: 34px;
        height: 34px;
        position: absolute;
        top: 113px;
        right: 27px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .download-button {
        background: url("/static/img/img00/employee/picture_down.png") 50% 50% no-repeat;
        background-color: rgba(255, 255, 255, .3);
        border-radius: 4px;
        width: 34px;
        height: 34px;
        position: absolute;
        top: 154px;
        right: 27px;
        box-sizing: border-box;
        cursor: pointer;
      }

      .gallery-top {
        width: 100%;
        height: 100%;
        .swiper-container {
          margin-left: auto;
          margin-right: auto;
          height: 100%;
          width: 100%;

          .swiper-wrapper {
            .swiper-slide {
              border: 1px solid grey;
              box-sizing: border-box;
              width: 100%;
              height: 100%;
              overflow: hidden;
              img {
                display: block;
                position: absolute;
                height: 100%;
                -webkit-user-select:none;
                -moz-user-select:none;
                -ms-user-select:none;
                user-select:none;

              }
            }

            .swiper-slide-active {
              .scalePic {
                width: 120px;
                position: absolute;
                height: 120px;
                bottom: 0;
                right: 0;
                border: 1px solid #fff;
                background-size: 100% 100%;
                background: #000;
                display: none;
                text-align: center;
                img {
                  background-size: 100% 100%;
                  max-height: 100%;
                  max-width: 100%;
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  top: 0;
                  display: block;
                  margin: auto;
                  opacity: 0.6;
                  filter: Alpha(opacity=60);
                }
                .demoPic {
                  width: 100%;
                  height: 100%;
                  position: relative;
                  .demoPicArea {

                    position: absolute;
                    span {
                      border: 1px solid #fff;
                      height: 100%;
                      display: block;
                    }

                  }

                }

              }
              .percentTip {
                position: absolute;
                width: 80px;
                height: 25px;
                background: #000;
                border-radius: 5px;
                color: #fff;
                font-size: 14px;
                text-align: center;
                line-height: 25px;
                top: 50%;
                left: 50%;
              }

            }
          }
        }

        .swiper-button-prev {
          display: none;
        }
        .swiper-button-next {
          display: none;
        }

        .swiper-left-gray {
          background: url("/static/img/img00/employee/photo_arrow_left_big.png") no-repeat;
          width: 50px;
          height: 50px;
          left: 55px;
          position: absolute;
          top: 50%;
          &.swiper-button-disabled{
            background: url("/static/img/img00/employee/photo_arrow_left_big_disabled.png") no-repeat;
          }
        }

        .swiper-right-gray {
          background: url("/static/img/img00/employee/photo_arrow_right_big.png") no-repeat;
          width: 50px;
          height: 50px;
          right: 55px;
          position: absolute;
          top: 50%;
          &.swiper-button-disabled{
            background: url("/static/img/img00/employee/photo_arrow_right_big_disabled.png") no-repeat;
          }
        }

        .rotate90 {
          transform: rotate(90deg);
          -webkit-transform: rotate(90deg);
        }

        .rotate180 {
          transform: rotate(180deg);
          -webkit-transform: rotate(180deg);
        }

        .rotate270 {
          transform: rotate(270deg);
          -webkit-transform: rotate(270deg);
        }

      }
      .gallery-thumbs {
        height: 100px;
        box-sizing: border-box;
        padding: 18px 0;
        top: auto;
        bottom: 0;
        background: rgba(63, 63, 63, .9);
        left: 0;
        right: 0;
        width: auto;
        position: absolute;
        z-index: 1;
        @include animate-fadeOut(1s, 2s, linear, forwards, 1);
        &:hover {
          @include animate-fadeIn(0.1s, 0s, linear, forwards, 1);
        }
        .swiper-wrapper-center {
          justify-content: center;

        }
        .swiper-container {
          margin-left: auto;
          margin-right: auto;
          height: 100%;
          width: 100%;
          .swiper-wrapper {
            .swiper-slide {
              width: 64px;
              height: 64px;
              border: 2px solid #fff;
              box-sizing: border-box;
              text-align: center;
              background: #fff;
              &.swiper-slide-active {
                border: 2px solid #00d6c6;
                background: white;
                img {
                }
              }

              img {
                display: inline-block;
                max-width:100%;
                max-height:100%;
                margin:0 auto;
                cursor: pointer;
              }
            }
          }
          .swiper-button-prev {
            width: 8px;
            height: 12px;
            background-size: 100% 100%;
            left: 12px;
            margin-top: -6px;
          }
          .swiper-button-next {
            width: 8px;
            height: 12px;
            background-size: 100% 100%;
            right: 12px;
            margin-top: -6px;
          }
        }

      }
    }

    &.full-screen{
      .background-hidden{
        top:0;
        bottom:0;
        left:0;
        right:0;
      }
      .close{

        background:url("/static/img/img00/employee/picture_close.png") 50% 50% no-repeat;
        background-color: rgba(255, 255, 255, 0.3);
        cursor: pointer;
        width:60px;
        height:60px;
        top: -10px;
        right: -15px;
        border-radius: 50%;
      }
      .close:hover{
        background-color: rgba(255, 255, 255, 0.6);
      }
      .rotate-button{
        top: 72px;
        right: 27px;
      }

      .bigger-button {
        top: 113px;
        right: 27px;
      }

      .smaller-button{
        top: 154px;
        right: 27px;
      }
      .download-button{
        top: 195px;
        right: 27px;
      }
    }
  }

  .close {
    width: 16px;
    height: 16px;
    background: url("/static/img/img00/employee/picture_close.png") 50% 50% no-repeat;
    position: absolute;
    top: 0;
    right: -36px;
    cursor: pointer;
  }

  .centerTip {
    width: 320px;
    height: 240px;
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 4px 4px 0 0;
    z-index: 5;
    .tip-head {
      width: 100%;
      height: 56px;
      background: #d9dfec;
      border-radius: 4px 4px 0 0;
      text-align: center;
      line-height: 56px;
      font-size: 18px;
      color: #222
    }
    .tip-content {
      width: 100%;
      height: 184px;
      padding-top: 32px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box
    }
    .tip-btn {
      width: 200px;
      height: 48px;
      margin: 0 auto 18px;
      background: #7a8ec1;
      -webkit-box-shadow: 0 2px 6px 0;
      box-shadow: 0 2px 6px 0;
      font-size: 16px;
      color: #fff;
      line-height: 48px;
      text-align: center;
      cursor: pointer
    }
    .tip-close {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(0,0,0,.5) url(/static/img/img00/employee/picture_close.png) 50% 50% no-repeat;
      position: absolute;
      top: -14px;
      right: -46px;
      cursor: pointer;
    }
  }

  .tip-save-result {
    width: 120px;
    height: 120px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #000;
    border-radius: 8px;
    opacity: 0.9;
    text-align: center;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: 16px;
    z-index: 7;
    -webkit-transition: opacity 0.5s;
    img {
      margin-top: 20px;
    }
    .text {
      margin-top: 14px;
    }
    &.on {
      -webkit-animation: fadeOut 2s linear 0s forwards 1;
    }
  }
</style>
