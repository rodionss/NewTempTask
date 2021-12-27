import AsyncStorage from '@react-native-community/async-storage'

const TOKEN = 'token'
const APN_TOKEN = 'apntoken'
const FIRST_LAUNCH = 'firstlaunch_dev01'
const INVITE_ID = 'inviteid'

export const setToken = (token) => AsyncStorage.setItem(TOKEN, token)

export const getToken = () => AsyncStorage.getItem(TOKEN)

export const clearToken = () => AsyncStorage.removeItem(TOKEN)

export const setApnToken = (token) => AsyncStorage.setItem(APN_TOKEN, token)

export const getApnToken = () => AsyncStorage.getItem(APN_TOKEN)

export const setFirstLaunch = (is) => AsyncStorage.setItem(FIRST_LAUNCH, is)

export const getFirstLaunch = () => AsyncStorage.getItem(FIRST_LAUNCH)

export const setInviteId = (id) => AsyncStorage.setItem(INVITE_ID, id)

export const getInviteId = () => AsyncStorage.getItem(INVITE_ID)

export const clearAuthRepo = () => {
  clearToken()
  setFirstLaunch('')
  setInviteId('')
}
