/**
 * @Desc：Dllplugin 独立库编译脚本
 * @Usage:
 * @Notify：
 * @Depend：
 *
 * Created by Qiangkailiang on 17/11/23.
 */

const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        vendor: ['vue', 'vuex', 'vue-router','axios','exif-js','vee-validate','swiper','jquery']
    },

    output: {
        path: path.join(__dirname, 'dist-[hash]'),
        filename: '[name].js',
        library: '[name]',
    },

    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'dll', '[name]-manifest.json'),
            filename: '[name].js',
            name: '[name]',
        }),
    ]
};