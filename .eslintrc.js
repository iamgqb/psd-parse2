module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    parser: "@typescript-eslint/parser",
    plugins: ['@typescript-eslint/eslint-plugin'],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        quotes: ["error", "single"],
        "@typescript-eslint/explicit-function-return-type": 0,
    }
};