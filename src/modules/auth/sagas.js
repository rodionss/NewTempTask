import { VideoConverter } from '@utils/VideoConverter'
import DeviceInfo from 'react-native-device-info'
import SplashScreen from 'react-native-splash-screen'
import { call, put, select, takeLatest } from 'redux-saga/effects'
import { handleSagaErrors } from '../../aspects'
import { DropdownService } from '../../services'
import { logAmplitude } from '../../utils'
import {
  fetchExploreData,
  setFeed,
  setFeedPagination,
  setLastNotificationId,
  setNotifications,
  setPendingChallenges,
} from '../main/duck'
import * as MainManager from '../main/managers'
import * as MainRepository from '../main/repository'
import { navigate } from '../NavigationService'
import {
  addToRegistrationQueue,
  checkAuth,
  completeWelcomeChallenge,
  logout,
  saveDeviceToken,
  sendCode,
  sendCodeSuccess,
  sendSmsCode,
  setProfile,
  setToken,
  signinFailure,
  signup,
  verifyInviteCode,
} from './duck'
import * as Manager from './managers'
import * as AuthRepository from './repository'
import {
  getInitialData,
  getProfileApnToken,
  getProfileForm,
  getToken,
} from './selectors'

const DEVICE_NAME = `${DeviceInfo.getBrand()} ${DeviceInfo.getDeviceId()}`

const checkAuthSaga = handleSagaErrors()(function* () {
  const token = yield call(AuthRepository.getToken)
  try {
    if (token) {
      yield put(setToken(token))

      const result = yield call(Manager.getProfile, token)
      yield put(setProfile(result.user))
      const {
        challenges,
        has_more,
        page: newPage,
      } = yield call(MainManager.getFeed, token, 1)
      yield put(setFeed(challenges))
      yield put(setFeedPagination({ hasMore: has_more, page: newPage }))
      yield put(fetchExploreData())

      yield call(navigate, 'Feed')
      SplashScreen.hide()

      const pendingChallenges = yield call(
        MainManager.getPendingChallenges,
        token,
      )
      yield put(setPendingChallenges(pendingChallenges))
      const response = yield call(MainManager.getNotifications, token)
      const lastId = yield call(MainRepository.getLastNotificationId)
      yield put(setLastNotificationId(lastId))
      yield response.notifications &&
        put(setNotifications(response.notifications))
    } else {
      SplashScreen.hide()
      yield call(navigate, 'Authorization')
      yield call(AuthRepository.clearAuthRepo)
    }
  } catch (e) {
    console.log(e)
    SplashScreen.hide()
    yield call(navigate, 'Authorization')
    yield call(AuthRepository.clearAuthRepo)
    throw new Error('Session expired ' + e)
  }
})

const addToRegistrationQueueSaga = handleSagaErrors()(function* ({ payload }) {
  const response = yield call(
    Manager.addToQueue,
    payload.phone,
    payload.apnToken,
  )
  if (!response.success) {
    DropdownService.alert('error', 'Oops...', 'Try again later')
    return
  }
})

const signupSaga = handleSagaErrors({ action: signinFailure() })(function* () {
  const profileForm = yield select(getProfileForm)
  const apnToken = yield AuthRepository.getApnToken()
  const inviteId = yield AuthRepository.getInviteId()
  const {
    result: { token, user },
  } = yield call(Manager.signup, profileForm, inviteId, DEVICE_NAME, apnToken)

  if (token) {
    yield call(navigate, 'WelcomeChallenge')
    yield call(AuthRepository.setToken, token)
    yield call(Manager.uploadAvatar, token, profileForm.newAvatarUri)

    yield put(setToken(token))
    yield put(fetchExploreData())
    yield put(setProfile({ ...user, photo_url: profileForm.newAvatarUri }))
    logAmplitude('Create profile', {
      photo: !!profileForm.newAvatarUri,
      bio: !!profileForm.bio,
    })
  }
})

const verifyInviteCodeSaga = handleSagaErrors()(function* ({ payload: code }) {
  const response = yield call(Manager.verifyInviteCode, code)
  const profileForm = yield select(getProfileForm)
  yield call(
    navigate,
    profileForm && profileForm.phone ? 'Onboarding' : 'Authorization',
  )
  logAmplitude('Invite code verified')
  yield call(AuthRepository.setInviteId, `${response.result.invite_id}`)
})

const sendSmsCodeSaga = handleSagaErrors()(function* ({ payload: profile }) {
  logAmplitude('Enter phone number')
  yield call(navigate, 'PhoneCodeRegistration')
  yield call(Manager.verifyPhone, profile.phone)
})

const sendCodeSaga = handleSagaErrors()(function* ({ payload: profile }) {
  const apnToken = yield call(AuthRepository.getApnToken)
  const res = yield call(
    Manager.signin,
    { phone: profile.phone, code: profile.code },
    DEVICE_NAME,
    apnToken,
  )
  yield put(sendCodeSuccess())

  if (res.status === 400) {
    yield call(DropdownService.alert, 'error', res.message)
  } else if (res.status === 404) {
    logAmplitude('Enter SMS code')
    if (res.result && res.result.invite_id) {
      yield call(AuthRepository.setInviteId, `${res.result.invite_id}`)
      yield call(navigate, 'Onboarding')
    } else {
      yield call(navigate, 'InviteCodeRegistration')
    }
  } else if (res.status === 200) {
    logAmplitude('Enter SMS code')
    yield call(AuthRepository.setToken, res.result.token)
    yield put(setToken(res.result.token))
    yield put(setProfile(res.result.user))

    yield put(fetchExploreData())

    const data = yield select(getInitialData)
    if (data) {
      const { id, object, extra } = data
      if (object == 'challenge') {
        yield call(navigate, 'ChallengeDetailed', {
          direct: true,
          challenge: {
            id: id,
            access_url: extra.token
              ? `://challenge?token=${extra.token}`
              : null,
          },
        })
      } else if (object == 'user') {
        yield call(navigate, 'AlienProfile', { user: { id } })
      }
    } else {
      const {
        challenges,
        has_more,
        page: newPage,
      } = yield call(MainManager.getFeed, res.result.token, 1)

      yield put(setFeed(challenges))
      yield put(setFeedPagination({ hasMore: has_more, page: newPage }))
      yield call(navigate, 'Feed')
    }
  }
})

const saveDeviceTokenSaga = function* ({ payload: deviceToken }) {
  console.log('APN_TOKEN', deviceToken)
  yield AuthRepository.setApnToken(deviceToken)

  const token = yield select(getToken)
  if (!token) return
  const apnToken = yield select(getProfileApnToken)
  if (apnToken === deviceToken) return
  yield call(MainManager.updateApnToken, token, apnToken)
}

const completeWelcomeChallengeSaga = handleSagaErrors()(function* ({
  payload,
}) {
  try {
    const { videoUri, thumbnailUri } = yield call(
      VideoConverter.convert,
      payload.videoProps,
    )

    const token = yield select(getToken)
    yield call(Manager.completeWelcomeChallenge, token, videoUri, thumbnailUri)
  } catch (error) {
    yield call(
      DropdownService.alert,
      'error',
      'Error',
      'Failed to convert video, please use another one',
    )
  }
})

const logoutSaga = handleSagaErrors()(function* () {
  yield call(AuthRepository.clearAuthRepo)
  yield call(navigate, 'Authorization')
  logAmplitude('Logout')
})

const authSaga = function* () {
  yield takeLatest(signup, signupSaga)
  yield takeLatest(completeWelcomeChallenge, completeWelcomeChallengeSaga)
  yield takeLatest(verifyInviteCode, verifyInviteCodeSaga)
  yield takeLatest(sendCode, sendCodeSaga)
  yield takeLatest(addToRegistrationQueue, addToRegistrationQueueSaga)
  yield takeLatest(sendSmsCode, sendSmsCodeSaga)
  yield takeLatest(saveDeviceToken, saveDeviceTokenSaga)
  yield takeLatest(checkAuth, checkAuthSaga)
  yield takeLatest(logout, logoutSaga)
}

export default authSaga
