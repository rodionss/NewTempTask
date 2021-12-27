import * as R from 'ramda'
import { combineReducers } from 'redux'
import { createAction, handleActions, handleAction } from 'redux-actions'
import { assetList } from '../../assets'
import { editProfile } from '../main/duck'

// ACTION

const prefix = 'AUTH'

export const addToRegistrationQueue = createAction(`${prefix}/ADD_TO_REGISTRATION_QUEUE`)

export const verifyInviteCode = createAction(`${prefix}/VERIFY_INVITE_CODE`)
export const sendSmsCode = createAction(`${prefix}/SEND_SMS`)
export const sendCode = createAction(`${prefix}/SEND_CODE`)
export const sendCodeSuccess = createAction(`${prefix}/SEND_CODE_S`)
export const sendCodeFailure = createAction(`${prefix}/SEND_CODE_F`)
export const uploadAvatar = createAction(`${prefix}/UPLOAD_AVATAR`)

export const setToken = createAction(`${prefix}/SET_TOKEN`)
export const setInitialData = createAction(`${prefix}/SET_INIT_DATA`)

export const signup = createAction(`${prefix}/SIGNUP`)
export const login = createAction(`${prefix}/LOGIN`)
export const checkAuth = createAction(`${prefix}/CHECK_AUTH`)
export const saveDeviceToken = createAction(`${prefix}/SAVE_DEVICE_TOKEN`)
export const setInvited = createAction(`${prefix}/SET_INVITED`)
export const logout = createAction(`${prefix}/LOGOUT`)
export const signinFailure = createAction(`${prefix}/SIGNIN_FAIL`)
export const deleteProfile = createAction(`${prefix}/DELETE_PROFILE`)

export const setProfile = createAction(`${prefix}/SET_PROFILE`)
export const changeProfile = createAction(`${prefix}/CHANGE_PROFILE`)
export const updateProfile = createAction(`${prefix}/UPDATE_PROFILE`)

export const completeWelcomeChallenge = createAction(`${prefix}/C_WELCOME_GAME`)
export const updateInteractions = createAction(`${prefix}/UPDATE_INTERACTIONS`)
// REDUCER

const token = handleActions(
  { [setToken]: (_, { payload }) => payload, [logout]: () => null },
  null,
)

const isLoadingSmsCode = handleActions(
  { [sendCode]: R.T, [sendCodeSuccess]: R.F, [sendCodeFailure]: R.F },
  false,
)

const isLoadingSignin = handleActions(
  { [signup]: R.T, [login]: R.T, [setToken]: R.F, [signinFailure]: R.F },
  false,
)

const profile = handleActions(
  {
    [setProfile]: (_, { payload }) => payload,
    [updateProfile]: (state, { payload }) => ({ ...state, ...payload }),
    [changeProfile]: (state, { payload }) => ({
      ...state,
      [payload.name]: payload.value,
    }),
    [updateInteractions]: (state, { payload }) => {

      let interactions = state.interactions.recent
        .filter(item => item.id != payload.id)
      interactions.unshift(payload)

      state.interactions.recent = interactions.slice(0, 15)
      return state
    }
  },
  {},
)

const isLodaingProfile = handleActions(
  { [editProfile]: R.T, [setProfile]: R.F, [updateProfile]: R.F },
  false,
)

const isInvited = handleAction(setInvited, (_, { payload }) => payload, false)

const welcomeChallenges = handleActions(
  { [completeWelcomeChallenge]: (state, { payload }) => [payload, ...state] },
  [
    { name: 'Nati Ko', avatar: '', video: assetList.smileVideo1 },
    { name: 'Serdoteskii Nikolai', avatar: '', video: assetList.smileVideo2 },
    { name: 'Anastasia Netyliova', avatar: '', video: assetList.smileVideo5 },
    { name: 'Kanstantsin Netyliov', avatar: '', video: assetList.smileVideo3 },
    { name: 'Daria Brusnik', avatar: '', video: assetList.smileVideo4 },
    { name: 'Tatiana Serdoteskaya', avatar: '', video: assetList.smileVideo6 },
  ],
)

const initialData = handleAction(
  setInitialData,
  (_, { payload }) => payload,
  null,
)

const auth = combineReducers({
  token,
  welcomeChallenges,
  initialData,
  isLoadingSmsCode,
  isLoadingSignin,
  profile,
  isInvited,
  isLodaingProfile,
})

export default auth
