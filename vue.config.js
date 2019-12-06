module.exports = {
    publicPath: process.env.NODE_ENV === 'production' ? '/PaediatricDiabetesApp/' : '/',
    configureWebpack: {
        devtool: 'source-map'
    },
    devServer: {
        https: true
    },
    lintOnSave: process.env.NODE_ENV !== 'production',
    pwa: {
        name: 'Paediatric Diabetes',
        themeColor: '#6d3176',
        iconPaths: {
            appleTouchIcon: 'img/icons/YDH-circle-white-150.png'
        },
        workboxPluginMode: 'InjectManifest',
        workboxOptions: {
            // swSrc is required in InjectManifest mode.
            swSrc: 'public/service-worker.js',
        }
    },
}
