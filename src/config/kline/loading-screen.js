export const getLoadingScreen = (theme) => {
  let themes = {
    light: {
      // 背景色
      backgroundColor: '#ffffff',
      foregroundColor: '#00e291'
    },
    dark: {
      // 背景色
      backgroundColor: '#161a33',
      foregroundColor: '#00e291'
    }
  }
  return themes[theme]
}
