/**
 * 打包命令
 * node deploy 环境名
 * 运行仅支持单环境
 */
// 压缩插件
const compressing = require('compressing')
const dayjs = require('dayjs')
const fs = require('fs')
const colors = require('colors')
const path = require('path') //解析需要遍历的文件夹
const { spawnSync } = require('child_process')
const { envList } = require('./env.js')
// 运行文件夹
const cmdPath = `${path.resolve('./')}/node_modules/.bin`
// 打包文件路径
let vueCliService = ''
var opsys = process.platform;
if (opsys == "darwin") {
  vueCliService = `${cmdPath}/vite`
  // vueCliService = `${cmdPath}/vite.ps1`
} else if (opsys == "win32" || opsys == "win64") {
  vueCliService = `${cmdPath}/vite.cmd`
} else if (opsys == "linux") {
  vueCliService = `${cmdPath}/vite`
}
// if (process.platform.includes('win')) {
//   vueCliService = `${cmdPath}/vite.cmd`
// } else if (process.platform.includes('linux')) {
//   vueCliService = `${cmdPath}/vite`
// } else if (process.platform.includes('mac')) {
//   vueCliService = `${cmdPath}/vite.ps1`
// }
// 获取参数列表
let envKeyList = process.argv.splice(2)
// 当前平台
let nowPlatform = ''
// 当前环境
let nowEnvObj = {}
// 运行类型
let type = 'build'
// 打包列表
let nextEnvKeyList = []

console.log(colors.yellow('------------开始' + JSON.stringify(envKeyList)))
nextEnvKeyList = envKeyList.map((elem) => elem)
nextEnv()

/**
 * 执行下一条
 */
async function nextEnv() {
  if (nextEnvKeyList.length) {
    await runSerivce(nextEnvKeyList[0])
  }
}
/**
 * 执行 npm run build/serve 命令
 */
async function runSerivce(envKey) {
  nowPlatform = envKey
  nowEnvObj = envList[envKey] || {}
  if (!nowEnvObj?.VITE_APP_ENV) {
    console.log(colors.red('不存在该环境'))
    return
  }
  console.log(colors.yellow('执行参数', envKey, JSON.stringify(nowEnvObj)))
  Object.assign(process.env, nowEnvObj)
  console.log(colors.blue('开始运行...', `${vueCliService} ${type}`))
  await build()
}
/**
 * 打包1
 */
async function build() {
  // 同步执行
  try {
    spawnSync(vueCliService, [type], {
      stdio: 'inherit',
      shell: true, // 确保 Windows cmd 支持 .cmd 调用
    })
    // 成功
    console.log(colors.yellow('清理多余文件_mini'))
    nextEnvKeyList.shift()
    await miniDist()
    await addZip()
  } catch (err) {
    console.log(colors.red('运行失败', err))
  }
}

/**
 * 删除不需要的文件
 */
async function filterFileList(src, dist) {
  let docs = fs.readdirSync(src)
  let minDirList = ['resource', 'platform']
  let envKeys = Object.keys(envList).filter((key) => key != nowEnvObj.VITE_APP_ENV)
  for (let index = 0; index < docs.length; index++) {
    const doc = docs[index]
    let _src = src + '/' + doc,
      _dist = dist + '/' + doc
    let st = fs.statSync(_src)
    // 判断是否为文件
    if (st.isFile() && doc !== '.DS_Store') {
      // 常规打包
      if (
        minDirList.some((elem) => _src.indexOf(`/${elem}/`) > -1) &&
        envKeys.some((elem) => _dist.indexOf(`/${elem}/`) > -1)
      ) {
        // 删除其他平台相关文件
        fs.unlinkSync(_src)
      }
    } else if (st.isDirectory()) {
      // 如果是目录则递归调用自身
      if (
        minDirList.some((elem) => _dist.indexOf(`/${elem}/`) > -1) &&
        envKeys.some((elem) => _dist == `/platform/${elem}`)
      ) {
        // 删除其他平台相关文件夹
        fs.rmSync(_src, { recursive: true })
      } else {
        await filterFileList(_src, _dist)
      }
    }
  }
}

// 删除打包文件夹
function deleteFolder(filePath) {
  const files = []
  if (fs.existsSync(filePath)) {
    const files = fs.readdirSync(filePath)
    files.forEach((file) => {
      const nextFilePath = `${filePath}/${file}`
      const states = fs.statSync(nextFilePath)
      if (states.isDirectory()) {
        //recurse
        deleteFolder(nextFilePath)
      } else {
        //delete file
        fs.unlinkSync(nextFilePath)
      }
    })
    fs.rmdirSync(filePath)

  }
}


/**
 * 压缩软件
 */
async function addZip() {

  var path_name =  nowEnvObj.VITE_APP_META_BUILlD
  await wait(2000)
  await filterFileList(path.resolve(path_name), '')
  // let zipName = `./Echo_${nowPlatform}_${dayjs().format('YYYYMMDDHHmmss')}.zip`
  let zipName = `./${path_name}.zip`
  await compressing.zip.compressDir(path_name+'/', zipName)
  console.log(colors.green(zipName+'打包成功'))
  // 删除打包文件夹
  // fs.rmSync(path.resolve(path_name), { recursive: true })
  deleteFolder(path.resolve(path_name))

  console.log(`删除文件夹${path_name}成功`)
}

/**
 * 过滤文件
 */
async function miniDist() {

  var path_name =  nowEnvObj.VITE_APP_META_BUILlD
  await wait(2000)
  await filterFileList(path.resolve(path_name), '')
  console.log(colors.green(`打包成功_${nowPlatform}_${dayjs().format('YYYYMMDDHHmmss')}`))
}

// 函数实现，参数单位 毫秒 ；
function wait(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms))
}
