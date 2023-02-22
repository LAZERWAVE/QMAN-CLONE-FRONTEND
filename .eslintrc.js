module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": [
    "plugin:vue/essential",
    "google",
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "sourceType": "module",
  },
  "plugins": [
    "vue",
  ],
  "rules": {
    "semi": ["error", "always"],
    "quotes": ["error", "double"],
    "max-len": [2, {"code": 120, "tabWidth": 4, "ignoreUrls": true}],
  },
  "ignorePatterns": [
    "node_modules",
    "src/views/authentication/particles/*.js",
    "src/utils/encryptionHandler.js",
  ],
};
