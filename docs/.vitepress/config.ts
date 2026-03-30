import { defineConfig } from "vitepress";
import llmstxt from "vitepress-plugin-llms";
import { teekConfig } from "./teekConfig";

const description = [
  "欢迎来到 vitepress-theme-teek 使用文档",
  "Teek 是一个基于 VitePress 构建的主题，是在默认主题的基础上进行拓展，支持 VitePress 的所有功能、配置",
  "Teek 拥有三种典型的知识管理形态：结构化、碎片化、体系化，可以轻松构建一个结构化知识库，适用个人博客、文档站、知识库等场景",
].toString();

// https://vitepress.dev/reference/site-config
export default defineConfig({
  extends: teekConfig,
  title: "vitepress-theme-teek",
  description: description,
  cleanUrls: false,
  lastUpdated: true,
  lang: "zh-CN",
  head: [
    [
      "link",
      { rel: "icon", type: "image/svg+xml", href: "/teek-logo-mini.svg" },
    ],
    ["link", { rel: "icon", type: "image/png", href: "/teek-logo-mini.png" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:locale", content: "zh-CN" }],
    ["meta", { property: "og:title", content: "Teek | VitePress Theme" }],
    ["meta", { property: "og:site_name", content: "Teek" }],
    ["meta", { property: "og:image", content: "" }],
    ["meta", { property: "og:url", content: "" }],
    ["meta", { property: "og:description", description }],
    ["meta", { name: "description", description }],
    ["meta", { name: "author", content: "Teek" }],
    // 禁止浏览器缩放
    // [
    //   "meta",
    //   {
    //     name: "viewport",
    //     content: "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
    //   },
    // ],
    ["meta", { name: "keywords", description }],
  ],
  markdown: {
    // 开启行号
    lineNumbers: true,
    image: {
      // 默认禁用；设置为 true 可为所有图片启用懒加载。
      lazyLoading: true,
    },
    // 更改容器默认值标题
    container: {
      tipLabel: "提示",
      warningLabel: "警告",
      dangerLabel: "危险",
      infoLabel: "信息",
      detailsLabel: "详细信息",
    },
  },
  sitemap: {
    hostname: "https://vp.teek.top", // ** 换成你的域名
    transformItems: (items) => {
      const permalinkItemBak: typeof items = [];
      // 使用永久链接生成 sitemap
      const permalinks = (globalThis as any).VITEPRESS_CONFIG.site.themeConfig
        .permalinks;
      items.forEach((item) => {
        const permalink = permalinks?.map[item.url];
        if (permalink)
          permalinkItemBak.push({ url: permalink, lastmod: item.lastmod });
      });
      return [...items, ...permalinkItemBak];
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/teek-logo-mini.svg",
    darkModeSwitchLabel: "主题",
    sidebarMenuLabel: "菜单",
    returnToTopLabel: "返回顶部",
    lastUpdatedText: "上次更新时间",
    outline: {
      level: [2, 4],
      label: "本页导航",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    nav: [
      { text: "首页", link: "/" },
      {
        text: "指南",
        link: "/guide/intro",
        activeMatch: "/01.指南/",
      },
      { text: "配置", link: "/reference/config", activeMatch: "/10.配置/" },
      { text: "开发", link: "/develop/intro", activeMatch: "/15.主题开发/" },
      {
        text: "功能页",
        items: [
          { text: "归档页", link: "/archives" },
          { text: "清单页", link: "/articleOverview" },
          { text: "登录页", link: "/login" },
          {
            text: "风险链接提示页",
            link: "/risk-link?target=https://vp.teek.top",
          },
          { text: "分类页", link: "/categories" },
          { text: "标签页", link: "/tags" },
        ],
      },
      { text: "面试", link: "/interview/facetoface", activeMatch: "/100.面试/" },
      { text: "HTML&CSS", link: "/css", activeMatch: "/200.html&css/" },
      { text: "JavaScript", link: "/js", activeMatch: "/300.javascript/" },
      { text: "TypeScript", link: "/ts", activeMatch: "/400.typescript/" },
      { text: "框架",
        items: [
          { text: "vue", link: "/vue" },
          { text: "react", link: "/react" },
          { text: "electron", link: "/electron" },
          { text: "nodejs", link: "/nodejs" },
          { text: "小程序", link: "/小程序" },
        ]
       },
      { text: "工程化", link: "/package", activeMatch: "/600.工程化/" },
      { text: "性能", link: "/performance", activeMatch: "/700.性能/" },
      { text: "安全", link: "/secure", activeMatch: "/800.安全/" },
      { text: "工具", link: "/tools", activeMatch: "/900.工具/" },
      { text: "资源", 
        items: [
          { text: "路线", link: "/routes" },
          { text: "教程", link: "/educate" },
          { text: "面试网站", link: "/sites" },
          { text: "项目", link: "/projects" },
        ]
      },
      { text: "机试", link: "/interview/computer", activeMatch: "/920.机试/" },
      { text: "✨ 赞赏", link: "/personal/" },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/Kele-Bingtang/vitepress-theme-teek",
      },
    ],
    search: {
      provider: "local",
    },
    editLink: {
      text: "在 GitHub 上编辑此页",
      pattern:
        "https://github.com/Kele-Bingtang/vitepress-theme-teek/edit/master/docs/:path",
    },
  },
  vite: {
    plugins: [llmstxt() as any],
  },
  // transformHtml: (code, id, context) => {
  //   if (context.page !== "404.md") return code;
  //   return code.replace("404 | ", "");
  // },
});
