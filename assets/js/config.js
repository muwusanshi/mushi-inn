/* ============================================================
 *  config.js —— 「木石客栈」全站内容配置中心
 *  ------------------------------------------------------------
 *  你只需要改这一个文件，所有页面会自动更新。改完保存，浏览器
 *  按 Ctrl+F5 强刷即可看到效果。
 *
 *  安全说明（重要，请先读）：
 *  · 「进站口令」和「单文件口令」都是“门槛”，不是“锁”。
 *    因为这是纯静态站，文件本身是公开存在的，懂技术的人仍可绕过。
 *    它只挡“随便点一下”的人——对你这种“本来就要分享文件”的站够用。
 *  · 「个人简历」除外：简历用的是真正的浏览器端加密（见 resume-data.js），
 *    密码不在服务器，明文也不会被直链下载到。
 * ============================================================ */

window.MUSHI = {

  /* ---------- 站点信息 ---------- */
  site: {
    name: "木石客栈",
    subtitle: "一个二次元风格的个人文件小站 · 欢迎常来",
    mascot: "小树",
    // 看板娘立绘图片路径；留空 "" 用内置的 emoji 占位（以后有了立绘就填这里）
    mascotImg: "",
    footer: "木石客栈 · 欢迎常来 · 有缘自会相遇",
    year: 2026,
  },

  /* ---------- 进站口令 ---------- */
  gate: {
    // enabled=true 表示进站要先输口令；改成 false 则全站公开。
    enabled: true,
    // 明文口令（默认是 xiaoshu）。想换口令，直接改这里的文字即可。
    // 再强调一次：这是“门槛”不是“锁”，明文放着是为了让你好改。
    password: "xiaoshu",
  },

  /* ---------- 主题 ---------- */
  theme: {
    // "light" 浅色(默认) / "dark" 深色 / "auto" 跟随系统
    default: "light",
  },

  /* ---------- 文件分类 ---------- */
  categories: [
    { id: "software", name: "软件工具", icon: "🛠️", desc: "常用软件与绿色小工具" },
    { id: "game",     name: "游戏资源", icon: "🎮", desc: "游戏本体、补丁与存档" },
    { id: "doc",      name: "文档教程", icon: "📚", desc: "教程、PDF 与学习笔记" },
    { id: "other",    name: "其他",     icon: "📦", desc: "杂七杂八的好东西" },
    // hidden=true 的分类不会出现在导航里（简历入口单独隐藏处理）
    { id: "resume",   name: "个人简历", icon: "🔒", desc: "仅凭密码可见", hidden: true },
  ],

  /* ---------- 文件清单 ----------
   * 每条含义：
   *  id        唯一标识（英文，别重复）
   *  title     显示名
   *  category  所属分类 id（对应上面 categories 的 id）
   *  desc      一句话简介
   *  version   版本号（可留空）
   *  size      显示用的大小文本（自己写，如 "12 MB"）
   *  date      更新日期（YYYY-MM-DD）
   *  tags      标签数组，供搜索
   *  download  下载地址：站内小文件填 "files/文件名.zip"；大文件填完整 https 外链
   *  password  单文件口令；留空 "" 表示不需要
   *  md5       校验值（可留空）
   *  downloads 展示用的下载数（纯静态站没有真实统计，这个数你自己估）
   *  featured  true 会在首页“最近更新/推荐”更靠前展示
   *  note      小提示（可选，如“解压密码：xxx”）
   */
  files: [
    {
      id: "sample-green-tool", title: "示例：绿色小工具包", category: "software",
      desc: "这是一个占位示例，请按使用说明替换成你的真实文件。",
      version: "1.0", size: "12 MB", date: "2026-10-20",
      tags: ["工具", "示例"], download: "files/示例-绿色小工具包.zip",
      password: "", md5: "", downloads: 320, featured: true, note: ""
    },
    {
      id: "sample-game", title: "示例：游戏资源合集", category: "game",
      desc: "占位示例：游戏补丁 / 存档之类放这里（大文件记得用外链）。",
      version: "v2.1", size: "800 MB", date: "2026-10-18",
      tags: ["游戏", "示例"], download: "https://example.com/sample-game.zip",
      password: "666", md5: "", downloads: 1580, featured: true, note: "示例外链，请替换成真实地址"
    },
    {
      id: "sample-doc", title: "示例：入门教程合集", category: "doc",
      desc: "占位示例：PDF / 教程 / 学习笔记。",
      version: "", size: "5 MB", date: "2026-10-12",
      tags: ["教程", "文档"], download: "files/示例-教程.pdf",
      password: "", md5: "", downloads: 96, featured: false, note: ""
    },
    {
      id: "sample-other", title: "示例：杂项小文件", category: "other",
      desc: "占位示例：壁纸、表情包等杂七杂八。",
      version: "", size: "3 MB", date: "2026-10-05",
      tags: ["杂项"], download: "files/示例-杂项.zip",
      password: "", md5: "", downloads: 41, featured: false, note: ""
    },
  ],
};
