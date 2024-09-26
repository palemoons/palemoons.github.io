module.exports = {
  output: "export",
  basePath: "/palemoons.github.io",
  images: { unoptimized: true },
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString().split('T')[0],
    TITLE: "Palemoons' Archive"
  },
};
