module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    BigInt: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    quotes: ["error", "double"],
    semi: ["error", "always"],
    "space-before-function-paren": ["error", {
      anonymous: "never",
      named: "never",
      asyncArrow: "always"
    }],
    indent: ["error", 4, {
      SwitchCase: 1
    }],
    "no-case-declarations": ["off"],
    "no-async-promise-executor": ["off"],
    "keyword-spacing": ["error", {
      before: false,
      after: false,
      overrides: {
        of: {
          after: true
        },
        var: {
          after: true
        },
        else: {
          before: true,
          after: true
        },
        return: {
          before: true,
          after: true
        },
        finally: {
          before: true,
          after: true
        },
        try: {
          after: true
        },
        catch: {
          before: true
        },
        const: {
          after: true
        },
        case: {
          after: true
        },
        continue: {
          before: true
        },
        of: {
          before: true
        }
      }
    }]
  }
}
