var path = require("path");
var webpack = require("webpack");
//HtmlWebpackPlugin是webpack生成html的插件
var HtmlWebpackPlugin = require("html-webpack-plugin");
//ExtractTextPlugin将样式单独提取到css文件里，而不是写在js里
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//自动添加css3样式前缀
var autoprefixer = require("autoprefixer");
module.exports = {
  context:path.resolve(__dirname,"src"),
  entry: {
    index: "./js/index.js",         //首页入口
    artical: "./js/artical.js",         //搜索页入口
    knowledge: "./js/knowledge.js"    //发布项目页入口
  },
  output: {
    path: path.resolve(__dirname,"dist"),              //输出的打包文件相对于这个路径
    //publicPath: "/",
    filename: "js/[name].js", //打包后的JS文件名字
    chunkFilename:"js/[id].chunk.js"     //chunk生成配置
  },
  devServer:{
    contentBase: path.join(__dirname, "asstes"),
    inline:true,
    compress: true,
    port:8080,
    hot:true,
    publicPath:"/dist", 
  },
  module: {
    rules: [
      {
        //css加载器,执行顺序从右到左
        test: /\.css$/,
        exclude: path.resolve(__dirname, "node_modules"),
        //use:ExtractTextPlugin.extract({
          //fallback:"style-loader",
          //use:"css-loader!postcss-loader",
        //})
        loader: "style-loader!css-loader!postcss-loader"
      },
      {
        //less加载器
        test:/\.less$/,
        exclude: path.resolve(__dirname, "node_modules"),
        //use: ExtractTextPlugin.extract({
          //fallback: "style-loader",
          //use: "css-loader!postcss-loader!less-loader"
        //})
        loader: "style-loader!css-loader!postcss-loader!less-loader"
      },
      {
        //html模板加载器
        test: /\.html$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: "html-loader"
      },
        //ejs模板加载器
      {
        test: /\.ejs$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: "ejs-loader"
      },
      {
        //图片加载器,可以将较小的图片转成base64，减少http请求
        //如下配置，将小于8192byte的图片转成base64码
        test: /\.(png|jpg|gif)$/i,
        exclude: path.resolve(__dirname, "node_modules"),
        use: 'url-loader?limit=8192&name=./img/[hash].[ext]'
      },
      {
        //文件加载器,处理静态资源
        test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: 'file-loader?name=./fonts/[name].[ext]',
        exclude: path.resolve(__dirname, "node_modules")
      }
    ]
  },
  plugins: [
    //index页面的配置
    new HtmlWebpackPlugin({
      filename: "index.html",          //index页面打包后的文件名
      template: "./common.ejs",   //index页面的模板文件
      inject: "body",                  //js文件放在body
      chunks: ["index"],      //需要加入的js文件
      hash: true,
      title: "index",
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    //search页面的配置
    new HtmlWebpackPlugin({
      filename: "artical.html",
      template: "./common.ejs",
      inject: "body",
      chunks:["artical"],
      hash: true,
      title: "artical",
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    //release页面你的配置
    new HtmlWebpackPlugin({
      filename: "knowledge.html",
      template: "./common.ejs",
      inject: "body",
      chunks:["knowledge"],
      hash: true,
      title: "knowledge",
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new ExtractTextPlugin('css/[name].css'),
    new webpack.HotModuleReplacementPlugin(),
    //代码压缩
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return [autoprefixer];
        }
      }
    })
  ],
  externals: {
    jquery: "window.$"
  },
  resolve: {
   extensions: ['.js', '.jsx']
 }
}