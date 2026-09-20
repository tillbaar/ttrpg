export default {
  extends: [
    "stylelint-config-standard",
    "@stylistic/stylelint-config",
    "stylelint-config-recess-order",
  ],
  ignoreFiles: [
    "_site/**",
    "node_modules/**",
  ],
  rules: {
    "@stylistic/indentation": [2],
    "color-hex-length": "long",
  },
};
