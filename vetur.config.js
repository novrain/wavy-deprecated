module.exports = {
  // **optional** default: `{}`
  // override vscode settings
  // Notice: It only affects the settings used by Vetur.
  settings: {
    "vetur.useWorkspaceDependencies": false,
    "vetur.experimental.templateInterpolationService": false
  },
  // **optional** default: `[{ root: './' }]`
  // support monorepos
  projects: [
    {
      root: './',
      // **optional**
      // Where is TypeScript config file in the project?
      // It is relative to root property.
      tsconfig: './tsconfig.vite.json',
    }
  ]
}