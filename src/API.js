import { BUNDLE } from './const'

export const BASE_URL = BUNDLE.isProduction
  ? 'https://ppa.happyo.app'
  : 'https://dev.happyo.app'

const VERSION = 'v2/'
const BASE_URL_API = `${BASE_URL}/api/${VERSION}`

export default {
  USER_V2: `${BASE_URL_API}user`,
  CHALLENGE_V2: `${BASE_URL_API}challenge`,
  NOTIFICATION_v2: `${BASE_URL_API}profile/notifications`,

  SIGNUP: `${BASE_URL_API}auth/signup`,
  SIGNIN: `${BASE_URL_API}auth/signin`,
  REGISTER: `${BASE_URL_API}register`,
  CHALLENGE: `${BASE_URL_API}challenge`,
  INVITE: `${BASE_URL_API}invite`,
  USER: `${BASE_URL_API}user`,
  FEED: `${BASE_URL_API}profile/feed`,
  CONTACTS: `${BASE_URL_API}profile/contacts`,
  COMPLAINT: {
    url: `${BASE_URL_API}complaint`,
    types: {
      CHALLENGE: 'challenge',
      FEED: 'feed',
    },
    complaints: {
      SPAM: 'spam',
      VIOLENCE: 'violence',
      SUICIDE: 'suicide',
      FALSE_INFORMATION: 'false_information',
      OTHER: 'other',
    },
  },
  FOLLOW: `${BASE_URL_API}profile/follow`,
  EXPLORE: `${BASE_URL_API}explore`,
  FOLLOW_ACCEPT: `${BASE_URL_API}profile/follow/accept`,
  FOLLOW_DECLINE: `${BASE_URL_API}profile/follow/decline`,
  UNFOLLOW: `${BASE_URL_API}profile/unfollow`,
  QUEUE: `${BASE_URL_API}queue`,
  VERIFY_PHONE: `${BASE_URL_API}auth/verify-phone`,
  PHOTO: `${BASE_URL_API}profile/photo`,
  VERIFY_CODE: `${BASE_URL_API}auth/verify-phone/code`,
  LOGIN: `${BASE_URL_API}login`,
  PROFILE: `${BASE_URL_API}profile`,
  NOTIFICATION: `${BASE_URL_API}profile/notifications`,
}
