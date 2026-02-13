import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '前端知识库', // 你的网站标题
  description: '前端面试题、编程知识、算法',
  lang: 'zh-CN',
  lastUpdated: true, // 显示最后更新时间
  cleanUrls: true,    // 美化URL，去掉.html后缀

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '前端机试', link: '/huawei/前端开发者备考华为机试指南_deepseek' },
      { text: '面试题', link: '/interview/react面试题' },
      { text: 'javascript', link: '/javascript/async/general' },
      { text: 'InterviewQuestions', link: '/InterviewQuestions/1前端高频面试题' },
      { text: 'PracticalQuestions', link: '/PracticalQuestions/1前端二叉树机试准备-从基础到高频题型' },
    ],

    sidebar: {
      '/interview/': [
        {
          text: '面试题',
          items: [
            { text: '前端框架响应式原理对比：Vue2、Vue3 与 React', link: '/interview/前端框架响应式原理对比：Vue2、Vue3 与 React' },
            { text: '虚拟 DOM 对比：Vue2、Vue3 与 React', link: '/interview/虚拟 DOM 对比：Vue2、Vue3 与 React' },
            { text: 'JavaScript 对象属性赋值分析：从空对象到属性统计', link: '/interview/JavaScript 对象属性赋值分析：从空对象到属性统计' },
            { text: 'JavaScript 对象在前端面试中的关键要点总结', link: '/interview/JavaScript 对象在前端面试中的关键要点总结' },
            { text: 'JavaScript 前端面试中数据类型判断的全面解析', link: '/interview/JavaScript 前端面试中数据类型判断的全面解析' },
            { text: 'JavaScript 数组`reduce`方法的详细使用指南', link: '/interview/JavaScript 数组`reduce`方法的详细使用指南' },
            { text: 'JavaScript 数组属性与方法：面试高频考点解析', link: '/interview/JavaScript 数组属性与方法：面试高频考点解析' },
            { text: 'JavaScript 数组索引：数字与字符串的奥秘', link: '/interview/JavaScript 数组索引：数字与字符串的奥秘' },
            { text: 'JavaScript 中高效的数组构造方法解析', link: '/interview/JavaScript 中高效的数组构造方法解析' },
            { text: 'JavaScript 中数组遍历方法的全面比较', link: '/interview/JavaScript 中数组遍历方法的全面比较' },
            { text: 'JavaScript 字符串：面试高频考点及常用方法解析', link: '/interview/JavaScript 字符串：面试高频考点及常用方法解析' },
            { text: 'JavaScript ES6：Set 和 Map 的差异与应用', link: '/interview/JavaScript ES6：Set 和 Map 的差异与应用' },
            { text: 'React 类组件与函数组件生命周期对比解析', link: '/interview/React 类组件与函数组件生命周期对比解析' },
            { text: 'React 组件传值核心逻辑解析', link: '/interview/React 组件传值核心逻辑解析' },
            { text: 'JavaScript 中高效的数组构造方法解析', link: '/interview/JavaScript 中高效的数组构造方法解析' },
            { text: 'react面试题', link: '/interview/react面试题' },
            { text: 'Reduce 核心逻辑及手动模拟验证', link: '/interview/Reduce 核心逻辑及手动模拟验证' },
            { text: 'Redux Toolkit：React 状态管理的高效方案示例', link: '/interview/Redux Toolkit：React 状态管理的高效方案示例' },
            { text: 'Vue 2 与 Vue 3 生命周期的差异对比', link: '/interview/Vue 2 与 Vue 3 生命周期的差异对比' },
            { text: 'Vue2 与 Vue3 中组件传值核心知识点对比', link: '/interview/Vue2 与 Vue3 中组件传值核心知识点对比' },
          ]
        },
      ],
      '/huawei/': [
        {
          text: '前端机试',
          items: [
            { text: '华为机试JS版-核心算法题+优质解答（ACM模式）', link: '/huawei/doubaolixian/华为机试JS版-核心算法题+优质解答（ACM模式）' },
            { text: '华为机试JS版-易踩坑题目+避坑解答（ACM模式）', link: '/huawei/doubaolixian/华为机试JS版-易踩坑题目+避坑解答（ACM模式）' },
            { text: '华为机试Js避坑速记清单', link: '/huawei/doubaolixian/华为机试Js避坑速记清单' },
            { text: 'JS华为机试核心模板速查表', link: '/huawei/doubaolixian/JS华为机试核心模板速查表' },
            { text: '华为JavaScript 机试高效准备方案', link: '/huawei/doubaozaixian/华为JavaScript机试高效准备方案' },
            { text: '华为JS机试必记核心模板', link: '/huawei/doubaozaixian/华为JS机试必记核心模板' },
            { text: '华为JS机试高频知识点：经典题目及JS完整可运行解答', link: '/huawei/doubaozaixian/华为JS机试高频知识点：经典题目及JS完整可运行解答' },
            { text: '华为机考输入处理：从格式到代码的关键指南', link: '/huawei/doubaozaixian/华为机考输入处理：从格式到代码的关键指南' },
            { text: 'Array Map with Number_Type Conversion Explained', link: '/huawei/doubaozaixian/Array_Map_with_Number_ Type_Conversion_Explained' },
            { text: '华为机试元宝版', link: '/huawei/华为机试元宝版.md' },
            { text: '前端开发者备考华为机试指南_deepseek', link: '/huawei/前端开发者备考华为机试指南_deepseek' },
            { text: 'JavaScript数组去重方法总结', link: '/huawei/doubaozaixian/JavaScript数组去重方法总结' },
            { text: '华为机考高频题解析：快速排序、两数之和、二分查找', link: '/huawei/doubaozaixian/华为机考高频题解析：快速排序、两数之和、二分查找' },
            { text: 'JavaScript 正则表达式核心知识点总结', link: '/huawei/doubaozaixian/JavaScript 正则表达式核心知识点总结' },
            { text: '栈高频题型及解题模板（2023年10月01日）', link: '/huawei/doubaozaixian/栈高频题型及解题模板（2023年10月01日）' },
            { text: 'JavaScript数组排序常用方法总结', link: '/huawei/doubaozaixian/JavaScript数组排序常用方法总结' },
          ]
        },
      ],
      '/javascript/': [
        {
          text: 'javascript',
          items: [
            // {
            //   text: 'async',
            //   collapsed: false,
            //   items: [
            //     { text: 'general', link: '/javascript/async/general' },
            //     { text: 'promise', link: '/javascript/async/promise' },
            //     { text: 'timer', link: '/javascript/async/timer' },
            //   ]
            // },
            // {
            //   text: 'basic',
            //   collapsed: true,
            //   items: [
            //     { text: 'grammar', link: '/javascript/basic/grammar' },
            //     { text: 'history', link: '/javascript/basic/history' },
            //     { text: 'introduction', link: '/javascript/basic/introduction' },
            //   ]
            // },
            // {
            //   text: 'bom',
            //   collapsed: true,
            //   items: [
            //     { text: 'array', link: '/javascript/bom/array' },
            //     { text: 'buffer', link: '/javascript/bom/buffer' },
            //     { text: 'cookie', link: '/javascript/bom/cookie' },
            //     { text: 'cors', link: '/javascript/bom/cors' },
            //     { text: 'engine', link: '/javascript/bom/engine' },
            //     { text: 'file', link: '/javascript/bom/file' },
            //     { text: 'form', link: '/javascript/bom/form' },
            //     { text: 'history', link: '/javascript/bom/history' },
            //     { text: 'indexeddb', link: '/javascript/bom/indexeddb' },
            //     { text: 'location', link: '/javascript/bom/location' },
            //     { text: 'navigator', link: '/javascript/bom/navigator' },
            //     { text: 'same-origin', link: '/javascript/bom/same-origin' },
            //     { text: 'storage', link: '/javascript/bom/storage' },
            //     { text: 'webworker', link: '/javascript/bom/webworker' },
            //     { text: 'window', link: '/javascript/bom/window' },
            //     { text: 'xmlhttprequest', link: '/javascript/bom/xmlhttprequest' },
            //   ]
            // },
            // {
            //   text: 'dom',
            //   collapsed: true,
            //   items: [
            //     { text: 'attributes', link: '/javascript/dom/attributes' },
            //     { text: 'css', link: '/javascript/dom/css' },
            //     { text: 'document', link: '/javascript/dom/document' },
            //     { text: 'element', link: '/javascript/dom/element' },
            //     { text: 'general', link: '/javascript/dom/general' },
            //     { text: 'mutationobserver', link: '/javascript/dom/mutationobserver' },
            //     { text: 'node', link: '/javascript/dom/node' },
            //     { text: 'nodelist', link: '/javascript/dom/nodelist' },
            //     { text: 'parentnode', link: '/javascript/dom/parentnode' },
            //     { text: 'text', link: '/javascript/dom/text' },
            //   ]
            // },
            // {
            //   text: 'elements',
            //   collapsed: true,
            //   items: [
            //     { text: 'a', link: '/javascript/elements/a' },
            //     { text: 'button', link: '/javascript/elements/button' },
            //     { text: 'form', link: '/javascript/elements/form' },
            //     { text: 'image', link: '/javascript/elements/image' },
            //     { text: 'input', link: '/javascript/elements/input' },
            //     { text: 'option', link: '/javascript/elements/option' },
            //     { text: 'video', link: '/javascript/elements/video' },
            //   ]
            // },
            // {
            //   text: 'events',
            //   collapsed: true,
            //   items: [
            //     { text: 'common', link: '/javascript/events/common' },
            //     { text: 'drag', link: '/javascript/events/drag' },
            //     { text: 'event', link: '/javascript/events/event' },
            //     { text: 'eventtarget', link: '/javascript/events/eventtargets' },
            //     { text: 'form', link: '/javascript/events/form' },
            //     { text: 'globaleventhandlers', link: '/javascript/events/globaleventhandlers' },
            //     { text: 'keyboard', link: '/javascript/events/keyboard' },
            //     { text: 'model', link: '/javascript/events/model' },
            //     { text: 'mouse', link: '/javascript/events/mouse' },
            //     { text: 'progress', link: '/javascript/events/progress' },
            //     { text: 'touch', link: '/javascript/events/touch' },
            //   ]
            // },
            // {
            //   text: 'features',
            //   collapsed: true,
            //   items: [
            //     { text: 'console', link: '/javascript/features/console' },
            //     { text: 'conversion', link: '/javascript/features/conversion' },
            //     { text: 'error', link: '/javascript/features/error' },
            //     { text: 'style', link: '/javascript/features/style' },
            //   ]
            // },
            // {
            //   text: 'oop',
            //   collapsed: true,
            //   items: [
            //     { text: 'new', link: '/javascript/oop/new' },
            //     { text: 'object', link: '/javascript/oop/object' },
            //     { text: 'prototype', link: '/javascript/oop/prototype' },
            //     { text: 'strict', link: '/javascript/oop/strict' },
            //     { text: 'this', link: '/javascript/oop/this' },
            //   ]
            // },
            // {
            //   text: 'operators',
            //   collapsed: true,
            //   items: [
            //     { text: 'arithmetic', link: '/javascript/operators/arithmetic' },
            //     { text: 'bit', link: '/javascript/operators/bit' },
            //     { text: 'boolean', link: '/javascript/operators/boolean' },
            //     { text: 'comparison', link: '/javascript/operators/comparison' },
            //     { text: 'priority', link: '/javascript/operators/priority' },
            //   ]
            // },
            // {
            //   text: 'stdlib',
            //   collapsed: true,
            //   items: [
            //     { text: 'array', link: '/javascript/stdlib/array' },
            //     { text: 'attributes', link: '/javascript/stdlib/attributes' },
            //     { text: 'boolean', link: '/javascript/stdlib/boolean' },
            //     { text: 'date', link: '/javascript/stdlib/date' },
            //     { text: 'json', link: '/javascript/stdlib/json' },
            //     { text: 'math', link: '/javascript/stdlib/math' },
            //     { text: 'number', link: '/javascript/stdlib/number' },
            //     { text: 'object', link: '/javascript/stdlib/object' },
            //     { text: 'regexp', link: '/javascript/stdlib/regexp' },
            //     { text: 'string', link: '/javascript/stdlib/string' },
            //     { text: 'wrapper', link: '/javascript/stdlib/wrapper' },
            //   ]
            // },
            // {
            //   text: 'types',
            //   collapsed: true,
            //   items: [
            //     { text: 'array', link: '/javascript/types/array' },
            //     { text: 'function', link: '/javascript/types/function' },
            //     { text: 'general', link: '/javascript/types/general' },
            //     { text: 'null-undefined-boolean', link: '/javascript/types/null-undefined-boolean' },
            //     { text: 'number', link: '/javascript/types/number' },
            //     { text: 'object', link: '/javascript/types/object' },
            //     { text: 'string', link: '/javascript/types/string' },
            //   ]
            // },
          ]
        },
      ],
      
      '/InterviewQuestions/': [
        {
          text: 'InterviewQuestions',
          items: [
            { text: '1前端高频面试题', link: '/InterviewQuestions/1前端高频面试题' },
            { text: '2javaScript基础与原理', link: '/InterviewQuestions/2javaScript基础与原理' },
            { text: '3浏览器与网络', link: '/InterviewQuestions/3浏览器与网络' },
            { text: '4Css与布局', link: '/InterviewQuestions/4Css与布局' },
            { text: '5Vue高频细分面试题集', link: '/InterviewQuestions/5Vue高频细分面试题集' },
            { text: '6React高频细分面试题集', link: '/InterviewQuestions/6React高频细分面试题集' },
            { text: '7Electron高频细分面试题集', link: '/InterviewQuestions/7Electron高频细分面试题集' },
            { text: '8前端工程化', link: '/InterviewQuestions/8前端工程化' },
            { text: '9前端性能优化超细分题集', link: '/InterviewQuestions/9前端性能优化超细分题集' },
            { text: '10性能优化全面补全', link: '/InterviewQuestions/10性能优化全面补全' },
            { text: '11大厂前端面试查漏补缺清单', link: '/InterviewQuestions/11大厂前端面试查漏补缺清单' },
            { text: '12面试反问环节万能应对指南', link: '/InterviewQuestions/12面试反问环节万能应对指南' },
            { text: '13Nodejs超细分面试题集', link: '/InterviewQuestions/13Nodejs超细分面试题集' },
            { text: '14华为WeLink项目', link: '/InterviewQuestions/14华为WeLink项目' },
            { text: '15后台项目', link: '/InterviewQuestions/15后台项目' },
          ]
        },
      ],
      '/PracticalQuestions/': [
        {
          text: 'PracticalQuestions',
          items: [
            { text: '1前端二叉树机试准备-从基础到高频题型', link: '/PracticalQuestions/1前端二叉树机试准备-从基础到高频题型' },
            { text: '2前端机试-BFS_DFS考察概率及解题模板', link: '/PracticalQuestions/2前端机试-BFS_DFS考察概率及解题模板' },
            { text: '3二叉树核心题及完整解答', link: '/PracticalQuestions/3二叉树核心题及完整解答' },
            { text: '4BFS和DFS在二叉树及前端开发中的应用', link: '/PracticalQuestions/4BFS和DFS在二叉树及前端开发中的应用' },
            { text: '5深入解析-二叉树BFS和DFS在前端的应用', link: '/PracticalQuestions/5深入解析-二叉树BFS和DFS在前端的应用' },
            { text: '6前端机试-DP与贪心算法高效准备策略', link: '/PracticalQuestions/6前端机试-DP与贪心算法高效准备策略' },
            { text: '7前端机试-动态规划与贪心算法高频核心题整理', link: '/PracticalQuestions/7前端机试-动态规划与贪心算法高频核心题整理' }
          ]
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],

    search: {
      provider: 'local',
      options: {
        locales: { zh: { translations: { button: { buttonText: '搜索知识点' } } } }
      }
    },
    footer: { message: '前端开发复习网站' }
  }
})
