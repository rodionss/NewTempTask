import { Dimensions } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import { STATUS_BAR_HEIGHT } from '@utils/functions'

export const PROFILE = {
  imageSize: 150,
  imageQuality: 100,
}

export const TUTORIAL = {
  SWIPE_UP: 'up',
  SWIPE_LEFT: 'left',
  COMPLETIONS: 'completions',
  SAVE_GAME: 'save',
  INVITE: 'invite',
  PROFILE_VIEW: 'profile',
  RANDOM: 'random',
  SHAKE: 'shake',
  CREATE_GAME: 'create_game',
}

export const REACTION_ALIAS = {
  ALL: 'all',
  LIKE: 'like',
  SUPER: 'super',
  WOW: 'wow',
  LOL: 'lol',
  TOGETHER: 'together',
  CUTE: 'cute',
}

export const THEME = {
  primaryBackgroundColor: '#050505',
  secondaryBackgroundColor: '#111313',
  tertiaryBackground: '#474747',
  textColor: '#d1d2d2',
  textFont: 'Inter',
  dangerColor: '#f13c3c',

  navBarBackground: '#000000',
  navBarFont: 'Sora',
  navBarColor: '#e6e6e6',
  navBarFontSize: '20px',
  navBarFontWeight: '600',

  tabBarTintColor: '#9D9D9D',
  tabBarBackgroundColor: '#060606',

  formFieldTitleColor: '#7D7D7D',
  formFieldValueColor: '#ffffff',
  formFieldPlaceholderColor: '#aaaaaa',
  formFieldBorderColor: '#323434',

  separatorColor: '#303030',
  primaryButtonColor: '#FF430E',

  containerPaddingWithTabBar: 100,
  containerPadding: 50,
}

export const URLS = {
  terms: 'https://ppa.happyo.app/terms-of-use',
  privacyPolicy: 'https://ppa.happyo.app/privacy-policy',
  support: 'mailto:support@happyo.app?subject=Help me',
  instagram: 'https://www.instagram.com/happyo_app/',
  facebook: 'https://www.facebook.com/happyopage',
  appStore: 'https://itunes.apple.com/app/soberman/id1559792724',
}

export const BUNDLE = {
  production: 'com.happyo',
  development: 'com.dev.happyo',
  isProduction: DeviceInfo.getBundleId() === 'com.happyo',
}

export const STATE = {
  UPLOAD_VIDEO: {
    INIT: 'initial',
    CONVERTING: 'converting',
    LOADING: 'loading',
    COMPLETE: 'complete',
  },
}

const { height } = Dimensions.get('window')
export const TAB_HEIGHT = STATUS_BAR_HEIGHT + 40
export const HEADER_HEIGHT = 64
export const HEIGHT_FEED_VIDEO = height - TAB_HEIGHT
export const HEIGHT_OLD_VIDEO = height - 32 * 2 - HEADER_HEIGHT - TAB_HEIGHT
