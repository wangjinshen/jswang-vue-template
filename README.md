# 利用vue-cli3.x 创建自己的UI组件库

## 第一步 创建项目
```js
    vue create .
```
或者 
```js
    vue ui
```
如图
![Image](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d187a2ef43e5435da655181e1594a344~tplv-k3u1fbpfcp-watermark.image)

创建项目时选择默认

## 第二步 修改文件目录结构
 在根目录添加`packages`文件夹

 `src` 文件改名为`example` 用作示例

 创建 `vue.config.js`后面配置修改
 
 如图：
![Image](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2c944d985f446b9b6a11214eb498fc1~tplv-k3u1fbpfcp-watermark.image)

## 第三步 添加配置
`vue-cli`的默认为`entry: 'examples/main.js'`所以文件修改后我们要把 入口路径 重新修改
```js
// vue.config.js
module.exports = {
    // 将 examples 目录添加为新的页面
    pages: {
      index: {
        // page 的入口
        entry: 'examples/main.js',
        // 模板来源
        template: 'public/index.html',
        // 输出文件名
        filename: 'index.html'
      }
    },
    css: { extract: false } //重要 
    // 官方解释：是否将组件中的 CSS 提取至一个独立的 CSS 文件中 
  }
```
` css: { extract: false }`当为`true`会把vue文件中的css文件单独抽离出来需要单独引用
我这里设置为 `false`直接关联在一起
修改完成后执行下  `npm run serve` 测试项目是否能正常运行
## 第四步 开发组件
之前已经创建了一个 packages 目录，用来存放组件

该目录下存放每个组件单独的开发目录，和一个 index.js 整合所有组件，并对外导出

每个组件都应该归类于单独的目录下，包含其组件源码目录 src，和 index.js 便于外部引用

这里以case为例
![Image](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6c3b3774677465d8cfddce17389f568~tplv-k3u1fbpfcp-watermark.image)

如图 `packages/case/src/main.vue`为组件的开发文件
需要注意的是，组件必须声明 name，这个 name 就是组件的标签
因为下面要用到
```js
    // packages/case/index.js
    // 导入组件，组件必须声明 name
    import Case from './src/main.vue'
    // 为组件添加 install 方法，用于按需引入
    Case.install = function (Vue) {
        Vue.component(Case.name, Case)
    }
    export default Case
```
## 第五步 整合组件并导出
```js
    // packages/index.js
    // 导入单个组件
    import Case from './case/index.js'

    // 以数组的结构保存组件，便于遍历
    const components = [
        Case
    ]
    // 定义 install 方法
    const install = function (Vue) {
        if (install.installed) return
        install.installed = true
        // 遍历并注册全局组件
        components.map(component => {
            Vue.component(component.name, component)
        })
    }
    if (typeof window !== 'undefined' && window.Vue) {
        install(window.Vue)
    }
    export default {
        // 导出的对象必须具备一个 install 方法
        install,
        // 组件列表
        ...components
    }
```
现在的话就组件开发完成了

在 `examples/main.js`中注册使用

```js
    import Vue from 'vue'
    import App from './App.vue'
    import Case from '../packages/index' //这里还没有打包我们暂时以相对路径的方式引用
    Vue.use(Case) //全剧注册
    new Vue({
    render: h => h(App),
    }).$mount('#app')
```

```vue
    // examples/App.vue
    <template>
    <div id="app">
        <div class="warp">
        <Case @caseData="oncaseData"></Case>
        </div>
    </div>
    </template>
    <script>
    export default {
    methods: {
        oncaseData (data) {
        console.log(data);
        }
    }
    };
    </script>

    <style>
    * {
    margin: 0;
    padding: 0;
    }
    .warp{
    width: 1000px;
    margin:  0  auto;
    }
    </style>

```
这时候可以 `npm run serve `启动项目，测试一下组件是否有 bug

## 第六步 组件打包
vue-cli 3.x 提供了一个[库文件打包命令](https://cli.vuejs.org/zh/guide/build-targets.html#%E5%BA%93)

主要需要四个参数：

1. target: 默认为构建应用，改为 `lib` 即可启用构建库模式

2. name: 输出文件名

3. dest: 输出目录，默认为 `dist`，这里我们改为 `lib`

4. entry: 入口文件路径，默认为 `src/App.vue`，这里改为 `packages/index.js`

基于此，在 `package.json` 里的 `scripts` 添加一个 `lib` 命令
```json
 "scripts": {
    "lib": "vue-cli-service build --target lib --name tag-textarea --dest lib packages/index.js",
  },
```
然后执行 `npm run lib` 命令，编译组件
## 第七步 准备发布
在根目录从新 `npm init `填写项目信息
注意：
private：是否私有，需要修改为 false 才能发布到 npm；
main: 入口文件，应指向编译后的包文件；

如图打包后我们得到了这个文件
![Image](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c81fedbe5bc4c1091b3f15e634816a8~tplv-k3u1fbpfcp-watermark.image)
把入口文件，应指向编译后的包文件；
```json
"main": "lib/tag-textarea.umd.min.js",
```
## 第八步 发布到npm
npm是不允许有重复包名到所以发布前查询是否有重复包名
登陆
```npm
npm login 
```
发布
```npm
npm publish
```
## 第八步 使用
```js
    import Vue from 'vue'
    import App from './App.vue'
    import Case from 'jswang-vue-template'
    Vue.use(Case) //全剧注册
    new Vue({
    render: h => h(App),
    }).$mount('#app')
```
## 项目地址 https://github.com/wangjinshen/jswang-vue-template.git