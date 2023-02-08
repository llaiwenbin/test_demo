module.exports = {
  presets: [
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
    "@babel/preset-typescript",

  ],
  env: {
    "test": {
      // 用于测试环境
      "presets": [['@babel/preset-env', { targets: { node: 'current' } }]],
    }
  }
};
