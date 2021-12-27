import * as R from 'ramda'
import { combineReducers } from 'redux'
import { createAction, handleAction, handleActions } from 'redux-actions'
import { STATE } from '../../const'

// ACTIONS

const prefix = 'MAIN'

// FEED
export const refreshFeed = createAction(`${prefix}/REFRESH_FEED`)
export const getFeed = createAction(`${prefix}/GET_FEED`)
export const setFeed = createAction(`${prefix}/SET_FEED`)
export const addFeed = createAction(`${prefix}/ADD_FEED`)
export const setFeedPagination = createAction(`${prefix}/SET_PAGINATION`)

export const setMuted = createAction(`${prefix}/SET_MUTED`)
export const sendViews = createAction(`${prefix}/SEND_VIEWS`)
export const addViewToSession = createAction(`${prefix}/ADD_VIEW`)
export const setViews = createAction(`${prefix}/SET_VIEWS`)
export const clearViews = createAction(`${prefix}/CLEAR_VIEWS`)

// USER
export const selectUser = createAction(`${prefix}/SELECT_USER`)
export const manageFollowUser = createAction(`${prefix}/FOLLOW_MANAGE`)
export const editProfile = createAction(`${prefix}/EDIT_PROFILE`)
export const refreshProfile = createAction(`${prefix}/REFRESH_PROFILE`)

// CHALLENGE
export const setPendingChallenges = createAction(`${prefix}/SET_ACTIVE_CHS`)
export const successFormChallenge = createAction(`${prefix}/SUCCESS_FORM_CH`)
export const createChallenge = createAction(`${prefix}/CREATE_CHALLENGE`)
export const editChallenge = createAction(`${prefix}/EDIT_CHALLENGE`)
export const disconnectChallenge = createAction(`${prefix}/DISCONNCET_CH`)
export const joinChallenge = createAction(`${prefix}/JOIN_CHALLENGE`)
export const joinChallengeSuccess = createAction(`${prefix}/JOIN_CHALLENGE_S`)
export const completeChallenge = createAction(`${prefix}/COMPLETE_CHALLENGE`)
export const complaintChallenge = createAction(`${prefix}/COMPLAINT_CHALLENGE`)
export const likeCompletion = createAction(`${prefix}/LIKE_COMPLETION`)

// NOTIFICATIONS
export const setNotifications = createAction(`${prefix}/SET_ANOTOFICATIONS`)
export const setLastNotificationId = createAction(`${prefix}/SET_LAST_NOTIF_ID`)
export const setGlobalLoading = createAction(`${prefix}/GLOBAL_LOADER`)

// VIDEO EDITOR
export const setVideoEditorState = createAction(`${prefix}/SET_VIDEO_ED_STATE`)
export const setVideoState = createAction(`${prefix}/SET_VIDEO_STATE`)

// EXPLORE
export const fetchExploreData = createAction(`${prefix}/FETCH_EXPLORE_DATA`)
export const setTopics = createAction(`${prefix}/SET_TOPICS`)
export const setFeaturesGames = createAction(`${prefix}/SET_FEATURES_GAMES`)
export const setRandomGames = createAction(`${prefix}/SET_RANDOM_GAMES`)
export const setPosibleFriends = createAction(`${prefix}/SET_POSIBLE_FRIENDS`)
export const setPopularGames = createAction(`${prefix}/SET_POPULAR_GAMES`)
export const setInterestingUsers = createAction(`${prefix}/SET_INTERES_USERS`)

export const setExploreLoading = createAction(`${prefix}/SET_EXPLORE_LOADING`)

export const followPosibleFriend = createAction(`${prefix}/FOLLOW_POSIBLE_FRIE`)
export const followIntrestingPeople = createAction(`${prefix}/FOLLOW_INTRESING`)

// REDUCERS

const feed = handleActions(
  {
    [setFeed]: (_, { payload }) => payload,
    [addFeed]: (state, { payload }) => [...state, ...payload],
    [completeChallenge]: (state, { payload: { id } }) => {
      const index = R.findIndex((x) => x.id === id, state)
      return index === -1
        ? state
        : R.update(index, {
            ...state[index],
            user_stats: { completed_at: true },
          })(state)
    },
    [joinChallengeSuccess]: (state, { payload: { id } }) => {
      const index = R.findIndex((x) => x.id === id, state)
      return index === -1
        ? state
        : R.update(index, {
            ...state[index],
            user_stats: { joined_at: true },
          })(state)
    },
    [disconnectChallenge]: (state, { payload: { id } }) => {
      const index = R.findIndex((x) => x.id === id, state)
      return index === -1
        ? state
        : R.update(index, {
            ...state[index],
            user_stats: { joined_at: false },
          })(state)
    },
  },
  [],
)

const notifications = handleActions(
  {
    [setNotifications]: (_, { payload }) => payload,
  },
  [],
)

const muted = handleAction(setMuted, (_, { payload }) => payload, true)

const isGlobalLoading = handleAction(
  setGlobalLoading,
  (_, { payload }) => payload,
  false,
)

const isLoadingExplore = handleAction(
  setExploreLoading,
  (_, { payload }) => payload,
  false,
)

const pendingChallenges = handleActions(
  {
    [setPendingChallenges]: (_, { payload }) => payload,
    [joinChallengeSuccess]: (state, { payload }) => {
      payload.challenge.user_stats.inspiring_participant =
        payload.fromCompletion
      return [...state, payload.challenge]
    },
    [disconnectChallenge]: (state, { payload: { id } }) =>
      state.filter((x) => x.id !== id),
    [completeChallenge]: (state, { payload: { id } }) =>
      state.filter((x) => x.id !== id),
  },
  [],
)

const selectedUser = handleActions(
  {
    [selectUser]: (_, { payload }) => payload,
    [manageFollowUser]: (state, { payload }) => {
      let newState = 'none'
      if (payload.userStats.follow_state == 'none') {
        newState = payload.isPrivate ? 'pending' : 'follow'
      }

      state.user_stats.follow_state == newState // FIXME? ==
      return state
    },
  },
  [],
)

const views = handleActions(
  {
    [setViews]: ({ payload }) => payload,
    [addViewToSession]: (state, { payload }) => ({ ...state, [payload]: true }),
    [clearViews]: () => ({}),
  },
  {},
)

const isLoadingFormChallenge = handleActions(
  {
    [createChallenge]: R.T,
    [editChallenge]: R.T,
    [successFormChallenge]: R.F,
  },
  false,
)

const videoUploadState = handleAction(
  setVideoState,
  (_, { payload }) => payload,
  STATE.UPLOAD_VIDEO.INIT,
)

const lastNotificationId = handleAction(
  setLastNotificationId,
  (_, { payload }) => payload,
  0,
)

const feedPagination = handleAction(
  setFeedPagination,
  (_, { payload }) => payload,
  { hasMore: false, page: 1 },
)

const videoEditorState = handleAction(
  setVideoEditorState,
  (_, { payload }) => payload,
  0,
)

const topics = handleAction(setTopics, (_, { payload }) => payload, [])

const featuresGames = handleAction(
  setFeaturesGames,
  (_, { payload }) => payload,
  [],
)

const randomGames = handleAction(
  setRandomGames,
  (_, { payload }) => payload,
  [],
)

const posibleFriends = handleActions(
  {
    [setPosibleFriends]: (_, { payload }) => payload,
    [followPosibleFriend]: (state, { payload }) =>
      R.update(
        payload.index,
        {
          ...payload,
          user_stats: {
            ...payload.user_stats,
            follow_state: payload.follow ? 'follow' : 'none',
          },
        },
        state,
      ),
  },
  [],
)

const popularGames = handleAction(
  setPopularGames,
  (_, { payload }) => payload,
  [],
)

const interestingUsers = handleActions(
  {
    [setInterestingUsers]: (_, { payload }) => payload,
    [followIntrestingPeople]: (state, { payload }) => {
      const key = payload.key
      const users = R.update(
        payload.index,
        {
          ...payload,
          user_stats: {
            ...payload.user_stats,
            follow_state: payload.follow ? 'follow' : 'none',
          },
        },
        state[key],
      )
      return { ...state, [key]: users }
    },
  },
  { new: [], featured: [] },
)

const main = combineReducers({
  feed,
  views,
  muted,
  videoEditorState,
  selectedUser,
  feedPagination,
  isGlobalLoading,
  notifications,
  lastNotificationId,
  isLoadingExplore,
  randomGames,
  videoUploadState,
  pendingChallenges,
  isLoadingFormChallenge,
  //explore
  topics,
  featuresGames,
  posibleFriends,
  popularGames,
  interestingUsers,
})

export default main
