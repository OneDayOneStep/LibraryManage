const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    app.use(createProxyMiddleware('/api',
        {
            target: "http://library.networkteam.cn/api",
            changeOrigin:true,
            pathRewrite: {
                "^/api": "/"
            },
            "secure": false
        }));
};
