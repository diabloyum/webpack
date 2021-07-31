const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const mockServer =require('./mock/server')
const argv = require('minimist')(process.argv.slice(0))
const production = argv.mode === 'production'
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports ={
    // 让 webpack 知道以哪个模块为入口，做依赖收集
    entry: {
    index: './src/pages/index.js',
    about: './src/pages/about.js'
    },
    // 告诉 webpack 打包好的文件存放在哪里，以及怎么命名
    output:{
        path: path.join(__dirname,'/dist'),
        filename:  'js/[name].js',

    },
    devServer:{
        after:(app)=>{
            mockServer(app)
        }
    },
    module:{
        // 使用 babel-loader 编译 es6/7/8、ts 和 jsx 语法
        // 注意：这里没有配置 preset，而是在 babel.config.js 文件里面配置
        rules:[{
            enforce:"pre",
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            exclude:/node_modules/,
            use:{
                loader:'eslint-loader',
                options:{
                    useEslintrc:false,
                    eslintPath: require.resolve('eslint'),
                    baseConfig:{
                        extends:[require.resolve('eslint-config-react-app')]
                    }
                }
            },
            use:{
                loader:'babel-loader'
            }
        },
        {
            test:/.(png|jpg|svg)$/,
            use:{
                loader:'file-loader',
                options:{
                    name:'img/[name].[ext]'
                }
            }
        },
        {
            test:/.css$/,
            use:['style-loader','css-loader']
        },
        {
            test: /\.less$/,
            use: [{
                   loader: "style-loader" 
                }, {
                    loader: "css-loader" 
                , 
                    loader: "less-loader"
                }]
        }
        ]
    },
    plugins:[
        // 这里通常想要指定自己的 html 文件模板，也可以指定生成的 html 的文件名
        new HtmlWebpackPlugin({
            template:'./src/pages/index.html',
            chunks: ['commons','index']
        }),
        new HtmlWebpackPlugin({
            template:'./src/pages/about.html',
            filename:'about.html',
            chunks: ['commons','about']
        }),
        new MiniCssExtractPlugin({
            filename:'[name].css',
            chunkFilename:'[id].css'
        })
    ],
    optimization:{
        minimize:production,
        minimizer:[
            new TerserPlugin({
                terserOptions:{
                    parse:{ecma:8,},
                    compress:{ecma:5,warnings:false,comparisons:false,inline:2,},
                    mangle:{safari10:true,},
                    output:{ecma:5,comments:false,ascii_only:true,},
                },
                parallel:true,
                cache:true,
                sourceMap:true,
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks:{
            cacheGroups:{
                commons:{
                    name:"commons",
                    chunks:"initial",
                    minChunks:2
                }
            }
        }
    }
}