module.exports = {
  extends: [
      'eslint-config-alloy',
  ],
  globals: {
    // 这里填入你的项目需要的全局变量
    // 这里值为 false 表示这个全局变量不允许被重新赋值，比如：
    
    // jQuery: false,
    // $: falses
  },
  rules: {
    // 这里填入你的项目需要的个性化配置，比如：
    // 一个缩进必须用两个空格替代
    'semi': ["error", "never"],
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ]
  }
};