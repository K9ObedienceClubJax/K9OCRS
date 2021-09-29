module.exports = {
  "presets": [
    ["@babel/env", {
      "targets": {
        "browsers": [
          "last 2 versions",
          "safari >= 7",
          "ie >= 11"
        ]
      }
    }],
    "@babel/preset-react"
  ],
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    ["@babel/plugin-proposal-class-properties", { "loose": true }]
  ]
};