//启用的功能
import enabled_features from './enabled-features'
//面板上禁用的功能
import disabled_features from './disabled-features'
//柱状图颜色
import studies_overrides from './studies-overrides'
//主要配置
import { getOverrides } from './overrides'
//设置初始化加载条样式
import { getLoadingScreen } from './loading-screen'

export const getConfig = (theme) => {
  return {
    enabled_features,
    disabled_features,
    studies_overrides,
    overrides: getOverrides(theme),
    loading_screen: getLoadingScreen(theme)
  }
}

import { _t18 } from '@/utils/public'

/**
 * 分辨率
 */
export const getIntervalList = () => {
  let tempList = [
    // { label: `1${_t18('second')}`, value: '1s', interval: '1', key: 'ONE_SECOND', defalut: true },
    {
      label: `1${_t18('minute')}`,
      value: '1m',
      interval: '1',
      key: 'ONE_MIN',
      default: true,
      // market: 'mt5',//测试
      platform: ['turbo', 'blackrock', 'smartfundBB']
    },
    { label: `3${_t18('minute')}`, value: '3m', interval: '3', key: 'THREE_MIN', default: false },
    {
      label: `5${_t18('minute')}`,
      value: '5m',
      interval: '5',
      key: 'FIVE_MIN',
      default: true,
      market: 'mt5',
      platform: ['turbo', 'blackrock', 'smartfundU', 'smartfundBB']
    },
    {
      label: `15${_t18('minute')}`,
      value: '15m',
      interval: '15',
      key: 'FIFTEEN_MIN',
      default: false,
      market: 'mt5',
      platform: ['turbo', 'blackrock', 'smartfundU', 'smartfundBB']
    },
    {
      label: `30${_t18('minute')}`,
      value: '30m',
      interval: '30',
      key: 'THIRTY_MIN',
      default: true,
      market: 'mt5',
      platform: ['turbo', 'blackrock', 'smartfundU', 'smartfundBB']
    },
    {
      label: `1${_t18('hour')}`,
      value: '1h',
      interval: '60',
      key: 'ONE_HOUR',
      default: true,
      market: 'mt5',
      platform: ['turbo', 'blackrock', 'smartfundU', 'smartfundBB']
    },
    { label: `2${_t18('hour')}`, value: '2h', interval: '120', key: 'TWO_HOUR', default: false },
    { label: `4${_t18('hour')}`, value: '4h', interval: '240', key: 'FOUR_HOUR', default: false },
    { label: `6${_t18('hour')}`, value: '6h', interval: '360', key: 'SIX_HOUR', default: false },
    { label: `8${_t18('hour')}`, value: '8h', interval: '480', key: 'EIGHT_HOUR', default: false },
    {
      label: `12${_t18('hour')}`,
      value: '12h',
      interval: '720',
      key: 'TWELVE_HOUR',
      default: false
    },
    {
      label: `1${_t18('day')}`,
      value: '1d',
      interval: '1440',
      key: 'ONE_DAY',
      default: true,
      market: 'mt5',
      marketnsdk: 'nsdk',
      platform: ['turbo', 'blackrock', 'smartfundU', 'smartfundBB']
    },
    { label: `3${_t18('day')}`, value: '3d', interval: '4320', key: 'THREE_DAY', default: false },
    {
      label: `1${_t18('week')}`,
      value: '1w',
      interval: '10080',
      key: 'ONE_WEEK',
      default: false,
      marketnsdk: 'nsdk',
      platform: ['smartfundU', 'smartfundBB']
    },
    { label: `1${_t18('month')}`, value: '1M', interval: '43200', key: 'ONE_MOON', default: false },
    {
      label: `1${_t18('month')}`,
      value: '1M',
      interval: '432001',
      key: 'ONE_MON',
      default: false,
      marketnsdk: 'nsdk'
    },
  ]

  return tempList
}

/**
 * 指标配置
 */
export const getStudyList = () => [
  {
    label: 'MA',
    name: 'Moving Average',
    colorList: ['#E5BF39', '#7CC7BA', '#C5A0E0'],
    cycleList: [5, 10, 30],
    studyList: []
  },
  {
    label: 'EMA',
    name: 'Moving Average Exponential',
    colorList: ['#E5BF39', '#7CC7BA', '#C5A0E0'],
    cycleList: [5, 10, 30],
    studyList: []
  },
  {
    label: 'BOLL',
    name: 'Bollinger Bands',
    colorList: ['#E5BF39', '#7CC7BA', '#C5A0E0'],
    cycleList: [14],
    studyList: []
  },
  {
    label: 'MACD',
    name: 'MACD',
    colorList: ['#E5BF39', '#7CC7BA', '#C5A0E0'],
    cycleList: [12],
    studyList: []
  },
  // {
  //   label: 'KDJ',
  //   name: 'KDJ Indicator',
  //   colorList: ['#7B2B8C', '#5FABAC', '#886024'],
  //   cycleList: [9, 3],
  //   studyList: []
  // },
  {
    label: 'RSI',
    name: 'Relative Strength Index',
    colorList: ['#7B2B8C', '#5FABAC', '#886024'],
    cycleList: [6],
    studyList: []
  },
  {
    label: 'WR',
    name: 'Williams %R',
    colorList: ['#886024'],
    cycleList: [14],
    studyList: []
  }
]
