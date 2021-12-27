import { Amplitude } from '@amplitude/react-native'
import moment from 'moment'
import { default as React, useEffect, useRef } from 'react'
import { Dimensions, Image, Platform, NativeModules } from 'react-native'
import RNFS from 'react-native-fs'
import ImageMarker, { ImageFormat } from 'react-native-image-marker'
import VideoWatermark from 'react-native-video-watermark'
import { assetList } from '../assets'
import { BUNDLE } from '../const'
import { getFirstLaunch } from '../modules/auth/repository'

const STATUSBAR_DEFAULT_HEIGHT = 20
const STATUSBAR_X_HEIGHT = 44
const STATUSBAR_IP12_HEIGHT = 47
const STATUSBAR_IP12MAX_HEIGHT = 47

const X_WIDTH = 375
const X_HEIGHT = 812

const XSMAX_WIDTH = 414
const XSMAX_HEIGHT = 896

const IP12_WIDTH = 390
const IP12_HEIGHT = 844

const IP12MAX_WIDTH = 428
const IP12MAX_HEIGHT = 926

const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window')

const getStatusBarHeight = () => {
  let statusBarHeight = STATUSBAR_DEFAULT_HEIGHT
  let isIPhoneX_v = false
  let isIPhoneXMax_v = false
  let isIPhone12_v = false
  let isIPhone12Max_v = false
  let isIPhoneWithMonobrow_v = false

  if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
    if (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) {
      isIPhoneWithMonobrow_v = true
      isIPhoneX_v = true
      statusBarHeight = STATUSBAR_X_HEIGHT
    } else if (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT) {
      isIPhoneWithMonobrow_v = true
      isIPhoneXMax_v = true
      statusBarHeight = STATUSBAR_X_HEIGHT
    } else if (W_WIDTH === IP12_WIDTH && W_HEIGHT === IP12_HEIGHT) {
      isIPhoneWithMonobrow_v = true
      isIPhone12_v = true
      statusBarHeight = STATUSBAR_IP12_HEIGHT
    } else if (W_WIDTH === IP12MAX_WIDTH && W_HEIGHT === IP12MAX_HEIGHT) {
      isIPhoneWithMonobrow_v = true
      isIPhone12Max_v = true
      statusBarHeight = STATUSBAR_IP12MAX_HEIGHT
    }
  }

  return Platform.select({
    ios: statusBarHeight,
    android: 10,
    default: 0,
  })
}

export const STATUS_BAR_HEIGHT = getStatusBarHeight()

export const validator = (schema) => async (formValues) => {
  try {
    await schema.validate(formValues, { abortEarly: false })
    return {}
  } catch (errors) {
    throw errors.inner.reduce(
      (errors, err) => ({
        ...errors,
        [err.path]: err.message,
      }),
      {},
    )
  }
}

export const createFormData = (uploads = [], fields = {}) => {
  const formData = new FormData()

  uploads.map((item) => {
    formData.append(item.name, {
      uri: item.uri,
      type: item.format == 'jpg' ? 'image/jpg' : 'video/mp4',
      name: `${moment().unix()}.${item.format}`,
    })
  })
  Object.keys(fields).map((key) => formData.append(key, fields[key]))

  return formData
}

export const getAmpInstance = () => {
  const ampInstance = Amplitude.getInstance()
  ampInstance.init('539561081eb6f87972a1b4b89e48b5f2')
  return ampInstance
}

export const useAnalytics = (message, data = {}, onlyFirst = false) => {
  const amp = useRef(getAmpInstance())
  const isDev = process.env.NODE_ENV !== 'production' && !BUNDLE.isProduction
  useEffect(() => {
    if (onlyFirst) {
      getFirstLaunch().then((isFirst) => {
        if (isFirst === 'true')
          amp.current.logEvent(message, { ...data, first_session: true })
      })
    } else if (message) amp.current.logEvent(message, data)
  }, [])
  return (message, data = {}) =>
    getFirstLaunch().then((isFirst) => {
      const params = { ...data, first_session: isFirst === 'true' }
      return isDev
        ? console.log(message, params)
        : amp.current.logEvent(message, params)
    })
}

export const withAmplitude = (message) => (BaseComponent) => {
  return class LogComponent extends React.Component {
    componentDidMount() {
      console.log(message)
    }
    render() {
      return <BaseComponent {...this.props} />
    }
  }
}

export const logAmplitude = (message, data = {}) => {
  const isDev = process.env.NODE_ENV !== 'production' && !BUNDLE.isProduction
  isDev ? console.log(message, data) : getAmpInstance().logEvent(message, data)
}

export const logAppsflyer = (name, value) => {
  appsFlyer.logEvent(name, value, console.log, console.log)
}

export const parseUrlToObj = (url) =>
  !url || url.indexOf('?') == -1
    ? {}
    : url
        .split('?')[1]
        .split('&')
        .reduce(
          (acc, param) => ({
            ...acc,
            [param.split('=')[0]]: param.split('=')[1],
          }),
          {},
        )

export const parseDeepLink = (reg, url) => {
  const matches = reg.exec(url)
  return matches
    ? { object: matches[1], id: matches[2], extra: parseUrlToObj(url) }
    : null
}

export const getParamFromUrl = (param, url) => {
  const params = parseUrlToObj(url)
  return param in params ? params[param] : null
}

export const keyExtractor = (item, i) =>
  item && item.id ? item.id.toString() + i : 'item-' + i

export const generateTimeArray = (min, max) =>
  new Array(24 * 6)
    .fill(0)
    .map((_, i) =>
      ('0' + ~~(i / 6) + ':0' + Math.round(60 * ((i / 6) % 1))).replace(
        /\d(\d\d)/g,
        '$1',
      ),
    )

export const stringToColour = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff
    colour += ('00' + value.toString(16)).substr(-2)
  }

  return colour
}

export const lightenDarkenColor = (color, amount) => {
  color = color.slice(1)
  let num = parseInt(color, 16)

  let r = (num >> 16) + amount
  r = r > 255 ? 255 : r < 0 ? 0 : r

  let g = (num & 0x0000ff) + amount
  g = g > 255 ? 255 : g < 0 ? 0 : g

  let b = ((num >> 8) & 0x00ff) + amount
  b = b > 255 ? 255 : b < 0 ? 0 : b

  return '#' + ('000000' + (g | (b << 8) | (r << 16)).toString(16)).substr(-6)
}

export const addWatermark = async (completion, challenge, callback) => {
  const username = `@${completion.user.username}`
  const secondsToEnd = moment(challenge.finishes_at).diff(moment(), 'seconds')
  const countdown = moment.utc(secondsToEnd * 1000).format('HH:mm:ss')
  const title = challenge.title.toUpperCase()

  const LOCAL_VIDEO_PATH = `${RNFS.DocumentDirectoryPath}/happyo.mp4`
  const LOCAL_IMAGE_PATH = `${RNFS.DocumentDirectoryPath}/watermark.png`

  await RNFS.downloadFile({
    fromUrl: completion.media.video_url,
    toFile: LOCAL_VIDEO_PATH,
  }).promise

  const { uri } = Image.resolveAssetSource(assetList.watermark)
  await RNFS.downloadFile({ fromUrl: uri, toFile: LOCAL_IMAGE_PATH }).promise
  let res = await ImageMarker.markText({
    src: LOCAL_IMAGE_PATH,
    text: title,
    X: 320,
    Y: 2950,
    color: '#FFFFFF',
    fontName: 'Inter-Bold',
    fontSize: 102,
    shadowStyle: {
      dx: 2,
      dy: 2,
      radius: 1.39,
      color: '#000000',
    },
    scale: 1,
    quality: 100,
    saveFormat: ImageFormat.png,
  })

  res = await ImageMarker.markText({
    src: res,
    text: countdown,
    X: 382,
    Y: 3150,
    color: '#FFFFFF',
    fontName: 'Inter-Bold',
    shadowStyle: {
      dx: 2,
      dy: 2,
      radius: 1.39,
      color: '#000000',
    },
    fontSize: 72,
    scale: 1,
    quality: 100,
    saveFormat: ImageFormat.png,
  })

  res = await ImageMarker.markText({
    src: res,
    text: username,
    X: 320,
    Y: 3330,
    color: '#FFFFFF',
    fontName: 'Inter',
    fontSize: 72,
    shadowStyle: {
      dx: 2,
      dy: 2,
      radius: 1.39,
      color: '#000000',
    },
    scale: 1,
    quality: 100,
    saveFormat: ImageFormat.png,
  })

  VideoWatermark.convert(LOCAL_VIDEO_PATH, res, callback)
}

export const getLongestFromArray = (array) =>
  array.reduce((a, b) => (a.length > b.length ? a : b))

export const setAppIconBadgeNumber = (number) => {
  if (Platform.OS !== 'ios') {
    console.log('Setting app icon badge number is not implemented on Android')
    return
  }

  NativeModules.Util.setAppIconBadgeNumber(number)
}
