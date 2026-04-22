---
title: 工具 
date: 2026-03-29 21:25:02
permalink: /tools
categories:
  - 工具
tags:
  - 工具
---

# 包管理器核心命令总结

## 一、核心：pnpm 用 i 还是 add？

### 区别与标准用法
表格

| 命⁠令 | 等⁠价⁠全⁠称 | 核⁠心⁠功⁠能 | ✅ 标⁠准⁠使⁠用⁠场⁠景 |
| --- | --- | --- | --- |
| pnpm i | pnpm install | 安⁠装⁠项⁠目⁠所⁠有⁠依⁠赖（读⁠取package.json+ 锁⁠文⁠件） | 克⁠隆⁠项⁠目、拉⁠取⁠新⁠代⁠码⁠后，安⁠装⁠全⁠部⁠已⁠有⁠依⁠赖 |
| pnpm add | - | 安⁠装⁠单⁠个 / 多⁠个⁠新⁠依⁠赖 | 新⁠增⁠项⁠目⁠需⁠要⁠的⁠包（如axios/vue） |

### 官方推荐实践
1. **装新包** → 用 `pnpm add 包名`（语义化，清晰区分「新增依赖」）
2. **装全部依赖** → 用 `pnpm i`（简写，高效）
3. 兼容说明：`pnpm i 包名` 也能装新包，但**不推荐**，违背语义化规范

---

## 二、三大包管理器 常用标准命令对照表

### 通用简写规则（全平台通用）

`i` = `install`、`D` = `--save-dev`、`g` = `--global`
表格

| 操⁠作⁠场⁠景 | npm | pnpm | yarn |
| --- | --- | --- | --- |
| ### 1. 初⁠始⁠化⁠项⁠目 | npm init -y | pnpm init -y | yarn init -y |
| ### 2. 安⁠装⁠全⁠部⁠依⁠赖(克⁠隆⁠项⁠目⁠必⁠用) | npm i | pnpm i | yarn |
| ### 3. 安⁠装⁠生⁠产⁠依⁠赖(项⁠目⁠运⁠行⁠必⁠需) | npm i 包⁠名 | pnpm add 包⁠名 | yarn add 包⁠名 |
| ### 4. 安⁠装⁠开⁠发⁠依⁠赖(仅⁠开⁠发⁠用) | npm i 包⁠名 -D | pnpm add 包⁠名 -D | yarn add 包⁠名 -D |
| ### 5. 全⁠局⁠安⁠装⁠工⁠具 | npm i 包⁠名 -g | pnpm add 包⁠名 -g | yarn add 包⁠名 -g |
| ### 6. 卸⁠载⁠依⁠赖 | npm uninstall 包⁠名 | pnpm remove 包⁠名 | yarn remove 包⁠名 |
| ### 7. 更⁠新⁠依⁠赖 | npm update 包⁠名 | pnpm update 包⁠名 | yarn upgrade 包⁠名 |
| ### 8. 运⁠行⁠脚⁠本(package.json 中 scripts) | npm run 脚⁠本⁠名 | pnpm run 脚⁠本⁠名 | yarn 脚⁠本⁠名 |
| ### 9. 查⁠看⁠版⁠本 | npm -v | pnpm -v | yarn -v |
| ### 10. 清⁠除⁠缓⁠存 | npm cache clean --force | pnpm cache clean | yarn cache clean |

---

## 三、关键补充说明
1. **语义化核心差异**
    - `npm`：统一用 `install` 做所有安装操作
    - `pnpm/yarn`：用 `install` 装全部依赖，`add` 装新包（更直观）
    
    
2. **兼容性**
    pnpm **完全兼容 npm 命令**，npm 的所有写法 pnpm 都能直接运行；
3. **锁文件**
    npm → `package-lock.json`、pnpm → `pnpm-lock.yaml`、yarn → `yarn.lock`（切勿手动修改）；
4. **yarn 极简特性**
    运行脚本无需加 `run`（如 `yarn dev` = `npm run dev`）。

---

### 总结
1. pnpm：**装新包用 `add`，装全部依赖用 `i`**；
2. 三大管理器命令高度对齐，记一套即可通用；
3. 日常开发优先用表格里的**标准命令**，可读性和维护性最优。