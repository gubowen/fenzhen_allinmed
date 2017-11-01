<template>
  <transition name="slide-corner">
    <section class="show-video show-big-img-masker" v-if="$store.state.videoFlag">
    <div class="background-hidden">
      <div class="gallery-top">
        <div class="swiper-container topSwiper">
          <div class="swiper-wrapper">
            <div class="swiper-slide swiper-no-swiping">
              <div class="swiper-zoom-container">
                <video controls="controls" width="500" height="300" style="width: 100%;height: 100%;">
                  <source :src="videoList"></source>
                </video>
              </div>
            </div>
          </div>
          <div class="swiper-pagination swiper-pagination-white"></div>
        </div>
      </div>
      <div class="close" @click="close()"></div>
    </div>
  </section>
  </transition>
</template>
<script>

  export default{
    name: 'show-video',
    data(){
      return {
        videoList: ''
      }
    },
    components: {

    },
    props: {
      showVideoFlag: {
        type: Boolean
      }
    },
    watch: {
      '$store.state.videoFlag'(content){
        this.init();
      }
    },
    methods: {
      init(){
        this.videoList = '';
        this.videoList = this.$store.state.videoObject;
        console.log(this.$store.state.videoObject)
      },
      close(){
         this.$store.commit("setVideoFlag",false);
      }
    },
    mounted(){
      this.init();
    },
    updated(){
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../scss/base.scss";
  .slide-corner-enter-active,.slide-corner-leave-active {
    transition: all 0.5s linear;
  }
  .slide-corner-enter,.slide-corner-leave-to{
    opacity: 0;
    transform: translate(100%,100%);
  }

  .show-big-img-masker {
    position: absolute;
    bottom: 0;
    right: 0;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 5;
    opacity: 1;
  }

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
            img {
              display: block;
              height: 100%;
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
      }

      .swiper-right-gray {
        background: url("/static/img/img00/employee/photo_arrow_right_big.png") no-repeat;
        width: 50px;
        height: 50px;
        right: 55px;
        position: absolute;
        top: 50%;
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
            width: auto;
            &.swiper-slide-active {
              img {
                border: 2px solid #fff;
                background: white;

              }
            }

            img {
              display: inline-block;
              height: 100%;
              width: auto;
              border: 2px solid rgba(63, 63, 63, 0.9);
              box-sizing: border-box;
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
    z-index: 5
  }

  .centerTip .tip-head {
    width: 100%;
    height: 56px;
    background: #d9dfec;
    border-radius: 4px 4px 0 0;
    text-align: center;
    line-height: 56px;
    font-size: 18px;
    color: #222
  }

  .centerTip .tip-content {
    width: 100%;
    height: 184px;
    padding-top: 32px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box
  }

  .centerTip .tip-btn {
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

  .centerTip .tip-close {
    width: 16px;
    height: 16px;
    background: url(/image/img00/employee/picture_close.png) 50% 50% no-repeat;
    position: absolute;
    top: 0;
    right: -36px;
    cursor: pointer
  }

  .tip-save-result{
    width:120px;
    height:120px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #000;
    border-radius: 8px;
    opacity: 0.9;
    text-align:center;
    font-size: 16px;
    color: #FFFFFF;
    letter-spacing: 0;
    line-height: 16px;
    z-index: 7;
    -webkit-transition:opacity 0.5s;
    img{
      margin-top:20px;
    }
    .text{
      margin-top:14px;
    }
    &.on{
      -webkit-animation: fadeOut 2s  linear 0s forwards 1;
    }
  }
</style>
