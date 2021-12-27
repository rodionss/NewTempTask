import { Notifications } from 'react-native-notifications'
import { reset } from 'redux-form'
import { call, delay, put, select, takeLatest } from 'redux-saga/effects'
import { handleSagaErrors } from '../../aspects'
import { STATE } from '../../const'
import { DropdownService } from '../../services'
import { logAmplitude } from '../../utils'
import {
  getToken,
  setProfile,
  updateInteractions,
  updateProfile,
} from '../auth'
import * as AuthManager from '../auth/managers'
import { goBack, popToTop, navigate } from '../NavigationService'
import {
  clearViews,
  complaintChallenge,
  completeChallenge,
  createChallenge,
  disconnectChallenge,
  editChallenge,
  setExploreLoading,
  setRandomGames,
  editProfile,
  fetchExploreData,
  followIntrestingPeople,
  followPosibleFriend,
  getFeed,
  joinChallenge,
  joinChallengeSuccess,
  likeCompletion,
  manageFollowUser,
  refreshFeed,
  refreshProfile,
  selectUser,
  sendViews,
  setFeaturesGames,
  setFeed,
  setFeedPagination,
  setGlobalLoading,
  setInterestingUsers,
  setPopularGames,
  setPosibleFriends,
  setTopics,
  setVideoState,
  successFormChallenge,
} from './duck'
import * as Manager from './managers'
import { getFeedList, getFeedPagination, getViewsIds } from './selectors'
import { VideoConverter } from '@utils/VideoConverter'

const getFeedSaga = handleSagaErrors()(function* ({ payload: page }) {
  const token = yield select(getToken)
  const {
    challenges,
    has_more,
    page: newPage,
  } = yield call(Manager.getFeed, token, page)
  const paginationFeed = yield select(getFeedPagination)
  if (newPage === 1) {
    yield put(setFeed(challenges))
  } else if (paginationFeed.page + 1 === newPage) {
    const currentFeed = yield select(getFeedList)
    yield put(setFeed([...currentFeed, ...challenges]))
  }
  yield put(setFeedPagination({ hasMore: has_more, page: newPage }))
})

const refreshFeedSaga = function* () {
  yield put(getFeed(1))
}

const manageFollowUserSaga = handleSagaErrors()(function* ({ payload }) {
  const token = yield select(getToken)
  logAmplitude('Follow on user', { screen: 'list' })
  yield call(
    payload.follow ? Manager.follow : Manager.unfollow,
    token,
    payload.id,
  )
})

const manageFollowProfileUserSaga = handleSagaErrors()(function* ({ payload }) {
  const token = yield select(getToken)
  if (payload.userStats.follow_state == 'none') {
    logAmplitude('Follow on user', { screen: 'profile' })
    yield call(Manager.follow, token, payload.id)
  } else {
    yield call(Manager.unfollow, token, payload.id)
  }

  const user = yield call(Manager.getUserById, token, payload.id)
  yield put(selectUser(user))
  const profile = yield call(AuthManager.getProfile, token)
  yield put(updateProfile(profile.user))
  yield call(refreshFeedSaga)
})

const createChallengeSaga = handleSagaErrors()(function* ({ payload }) {
  const token = yield select(getToken)
  const body = {
    title: payload.title,
    description: payload.description,
    public: payload.public ? 1 : 0,
    done: 1,
  }
  yield call(popToTop)
  yield call(navigate, 'Feed')
  yield put(setVideoState(STATE.UPLOAD_VIDEO.CONVERTING))
  try {
    const { videoUri, thumbnailUri } = yield call(
      VideoConverter.convert,
      payload.videoProps,
    )

    yield put(setVideoState(STATE.UPLOAD_VIDEO.LOADING))

    const { result } = yield call(
      Manager.addChallenge,
      token,
      body,
      videoUri,
      thumbnailUri,
    )
    logAmplitude('Game created')
    if (payload.taggedUsers && payload.taggedUsers.length) {
      const user_ids = payload.taggedUsers
      yield call(Manager.inviteChallenge, token, result.challenge.id, {
        user_ids,
        tag: true,
      })
    }
    yield put(successFormChallenge())
    yield put(reset('challenge'))
    yield call(
      DropdownService.alert,
      'success',
      'Hooray!',
      `The ${payload.title} game was created successfuly`,
    )
    yield put(setVideoState(STATE.UPLOAD_VIDEO.COMPLETE))
    yield call(refreshFeedSaga)
    yield delay(2000)
    yield put(setVideoState(STATE.UPLOAD_VIDEO.INIT))
  } catch (error) {
    yield call(
      DropdownService.alert,
      'error',
      'Error',
      'Failed to convert video, please use another one',
    )
    yield put(setVideoState(STATE.UPLOAD_VIDEO.INIT))
    yield put(successFormChallenge())
  }
})

const editChallengeSaga = handleSagaErrors()(function* ({ payload }) {
  const token = yield select(getToken)
  const body = {
    title: payload.title,
    description: payload.description,
    category_id: payload.categoryId,
    duration: payload.duration,
    public: payload.public ? 1 : 0,
  }
  yield call(Manager.editChallenge, token, payload.id, body)
  yield call(goBack)
})

const completeChallengeSaga = handleSagaErrors()(function* ({
  payload: { id, videoProps, screen, fromCompletion },
}) {
  yield call(popToTop)
  yield call(navigate, 'Feed')
  yield call([Notifications, 'cancelLocalNotification'], id)
  yield put(setVideoState(STATE.UPLOAD_VIDEO.CONVERTING))

  try {
    const { videoUri, thumbnailUri } = yield call(
      VideoConverter.convert,
      videoProps,
    )

    const token = yield select(getToken)
    yield put(setVideoState(STATE.UPLOAD_VIDEO.LOADING))
    yield call(
      Manager.doNowChallenge,
      token,
      videoUri,
      thumbnailUri,
      id,
      fromCompletion.user.id,
    )
    logAmplitude('Game completed', { screen })
    yield put(updateInteractions(fromCompletion.user))
    yield call(refreshFeedSaga)
    yield put(setVideoState(STATE.UPLOAD_VIDEO.COMPLETE))
    yield delay(2000)
    yield put(setVideoState(STATE.UPLOAD_VIDEO.INIT))
  } catch (error) {
    yield call(
      DropdownService.alert,
      'error',
      'Error',
      'Failed to convert video, please use another one',
    )
    yield put(setVideoState(STATE.UPLOAD_VIDEO.INIT))
  }
})

const joinChallengeSaga = handleSagaErrors()(function* ({
  payload: { id, fromCompletion, joinToken, screen, joined, challenge },
}) {
  const token = yield select(getToken)
  if (!joined) {
    yield put(joinChallengeSuccess({ challenge, id, fromCompletion }))
    yield call(
      Manager.challengeJoin,
      token,
      id,
      joinToken,
      fromCompletion.user.id,
    )
    yield put(updateInteractions(fromCompletion.user))
    logAmplitude('Game saved for later', { screen })
  } else {
    yield call([Notifications, 'cancelLocalNotification'], id)
    yield put(disconnectChallenge({ id }))
    yield call(Manager.removeMeFromChallenge, token, id)
  }
})

const likeCompletionSaga = handleSagaErrors()(function* ({
  payload: { gameCompletion, reaction },
}) {
  const token = yield select(getToken)
  reaction
    ? yield call(Manager.reactCompletion, token, gameCompletion.id, reaction)
    : yield call(Manager.removeReaction, token, gameCompletion.id)
})

const editProfileSaga = handleSagaErrors()(function* ({ payload: { form } }) {
  const token = yield select(getToken)
  yield call(Manager.editProfile, token, form)
  if (form.newAvatarUri) {
    yield call(AuthManager.uploadAvatar, token, form.newAvatarUri)
    form.photo_url = form.newAvatarUri
  }
  yield put(updateProfile(form))
  yield call(goBack)
})

const refreshProfileSaga = handleSagaErrors()(function* () {
  const token = yield select(getToken)
  const result = yield call(AuthManager.getProfile, token)

  yield put(setProfile(result.user))
})

const complaintChallengeSaga = handleSagaErrors()(function* ({ payload }) {
  const token = yield select(getToken)
  yield call(Manager.sendComplaint, token, payload)
  yield call(
    DropdownService.alert,
    'success',
    'Thank you',
    'The complaint has been sent',
  )
})

const sendViewsSaga = function* () {
  try {
    const token = yield select(getToken)
    const ids = yield select(getViewsIds)
    if (ids && ids.length) {
      yield call(Manager.sendViews, token, ids)
      yield put(clearViews())
    }
  } catch (e) {}
}

// EXPLORE
const fetchExploreDataSaga = function* () {
  const token = yield select(getToken)

  yield put(setExploreLoading(true))
  const topics = yield call(Manager.getFeaturedCategories, token)
  yield put(setTopics(topics.featured_categories))

  const posibleFriends = yield call(Manager.getMutualFriends, token)
  yield put(setPosibleFriends(posibleFriends.users))

  const newUsers = yield call(Manager.getNewUsers, token)
  const featuredUsers = yield call(Manager.getFeaturedUsers, token)
  const intresting = { new: newUsers.users, featured: featuredUsers.users }
  yield put(setInterestingUsers(intresting))

  // const featuredGames = yield call(Manager.getFeaturedGames, token)
  // yield put(setFeaturesGames(featuredGames.challenges))
  const randomGames = yield call(Manager.getRandomGames, token)
  yield put(setRandomGames(randomGames.challenges))

  const popularGames = yield call(Manager.getPopularGames, token)
  yield put(setPopularGames(popularGames.challenges))

  yield put(setExploreLoading(false))
}

const mainSaga = function* () {
  yield takeLatest(getFeed, getFeedSaga)
  yield takeLatest(refreshFeed, refreshFeedSaga)
  yield takeLatest(likeCompletion, likeCompletionSaga)
  yield takeLatest(createChallenge, createChallengeSaga)
  yield takeLatest(editChallenge, editChallengeSaga)
  yield takeLatest(joinChallenge, joinChallengeSaga)
  yield takeLatest(completeChallenge, completeChallengeSaga)
  yield takeLatest(editProfile, editProfileSaga)
  yield takeLatest(sendViews, sendViewsSaga)
  yield takeLatest(fetchExploreData, fetchExploreDataSaga)
  yield takeLatest(refreshProfile, refreshProfileSaga)
  yield takeLatest(manageFollowUser, manageFollowProfileUserSaga)
  yield takeLatest(followPosibleFriend, manageFollowUserSaga)
  yield takeLatest(followIntrestingPeople, manageFollowUserSaga)
  yield takeLatest(complaintChallenge, complaintChallengeSaga)
}

export default mainSaga
