module.exports = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/palemoons.github.io" : "",
  images: { unoptimized: true },
};
