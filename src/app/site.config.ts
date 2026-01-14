
const SITE_CONFIG = {
  title: "Palemoons' Archive",
  description: "Palemoons' personal website",
  author: "Palemoons",
  generator: "Next.js",
  siteUrl: process.env.SITE_URL ?? "unknown",
  siteRepo: "https://github.com/palemoons/palemoons.github.io",
  commentRepo: "palemoons/blog-comment",
  landingPageListSize: 5,
  categoryPaginationSize: 20,
  tocMaxHeader: 3,
  maxCodeHeight: 300,
  buildTime: new Date(),

  categories: [
    { name: "技术笔记", url: "note" },
    { name: "生活杂谈", url: "article" },
  ],
  subpages: [
    { name: "文章文类", url: "tag" },
    { name: "关于本站", url: "about" },
  ],
};

export default SITE_CONFIG;
