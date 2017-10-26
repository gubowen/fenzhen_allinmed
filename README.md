# vue-cli
Simple-page CLI for scaffolding Vue.js projects.

#### 基本使用方法
  本项目为Webpack+Vue.js多页面研发架构。
  请确保Node.js版本不低于6.0，Webpack2.0以上即可，但推荐使用3.3以上版本。

  开发人员编写的任何页面放置于/src/modules目录下，一个文件夹对应一个页面，每个文件夹中均有类似的文件结构。

  公有组件置于/src/components下，公有JS/CSS文件置于/src/common与Base下。
  常用目录已于Webpack中配置alias，方便直接引用。

  打包完成的文件将进入/dist目录下，但不再有目录路径的区分。
  目标模板为根目录下index.html


#### 基本构建命令
  `npm update` 更新依赖的模块

  `npm install` 安装依赖模块

  `npm run dev` 开启测试环境，在测试环境下开发

  `npm run build` 发布正式版本

  `npm run build --report` 发布正式版本的同时输出构建情况

#### 注意事项

  1、鉴于国内Npm环境的因素，建议使用阿里巴巴的npm镜像源安装node_modules；
  2、原则上不能私自执行打包操作，现阶段除强凯亮与谷博文外，其余同事请不要自行完成本项目打包构建。除强凯亮以外，任何同事不能私自改动/build下的Webpack配置文件；
  3、部分开发环境可能会由于缺少node-sass导致Vue-loader无法识别Sass语法，该情况除了需全局安装node-sass以外，建议安装Python2.6版本以上环境，即可解决；
  4、Vue.js开发着重于组件的重用性，各开发人员在编写时应尽量考虑全局项目的组件耦合程度，请明确区分聪明组件与笨组件的定义；
  5、本项目已部署至ES6开发环境。除Pass平台公用库文件难以解耦以外，其余任何场景严禁使用jQuery/Zepto进行编码。
