# vuecli3_ssr

## vuecli3 服务端渲染

vue cli 3 脚手架搭建项目，对比 vue-cli（2）有些不同，去除 build 文件夹，看不到默认配置。而 cli3 搭建的项目已满足几乎所有条件，
可以直接进行开发，但是都是客户端渲染，如果项目要求服务端渲染还需另外自己修改配置，查看 cli3 的默认可以查看官方文档
`vue inspect --mode production > output_prod.js` 查看生产环境的配置
`vue inspect > output.js` 查看开发环境配置
而要修改webpack配置需在项目目录下新建 `.vue.config.js` 里面修改
因为想学习并尝试服务端渲染，所以并没有按照 vue.config.js 方式修改配置，且按照官方文档的方式学习更容易理解、深入。所以此次尝试都
按照官方文档说明，并参考官网示例，还有网上的一些其他示例说明，通过搭建服务端渲染项目，对vue的服务端渲染有了一个比较深入的理解

**说明：官方文档的示例webpack的版本不是最新版本，而webpack已经升级到v4+，所以官方文档的配置有些已不适用，此示例的配置已参考新版webpack文档配置方式和网上的诸多配置说明，已做适当修改**

## Project setup

``` bash
# install dependencies
npm install # or yarn

# serve in dev mode, with hot reload at localhost:8756
npm run dev

# build for production
npm run build

# serve in production mode
npm start
```
