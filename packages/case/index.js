// packages/textarea/index.js

// 导入组件，组件必须声明 name
import Case from './src/main.vue'

// 为组件添加 install 方法，用于按需引入
Case.install = function (Vue) {
    Vue.component(Case.name, Case)
}

export default Case