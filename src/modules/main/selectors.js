import * as R from 'ramda'

const getMainStore = R.prop('main')

export const getFeedList = R.pipe(getMainStore, R.prop('feed'))

export const getViewsIds = R.pipe(
  getMainStore,
  R.prop('views'),
  R.keys,
  R.map(parseInt),
  R.filter((x) => !!x),
)

export const getFeedPagination = R.pipe(getMainStore, R.prop('feedPagination'))

export const getIsGlobalLoading = R.pipe(
  getMainStore,
  R.prop('isGlobalLoading'),
)

export const getVideoEditorState = R.pipe(
  getMainStore,
  R.prop('videoEditorState'),
)
export const getMuted = R.pipe(getMainStore, R.prop('muted'))

export const getVideoUploadState = R.pipe(
  getMainStore,
  R.prop('videoUploadState'),
)

export const getIsLoadingFormChallenge = R.pipe(
  getMainStore,
  R.prop('isLoadingFormChallenge'),
)

export const getNotifications = R.pipe(getMainStore, R.prop('notifications'))
export const getLastNotificationId = R.pipe(
  getMainStore,
  R.prop('lastNotificationId'),
)
export const getHasNotifications = R.converge(
  (notifications, lastId) =>
    notifications.length ? lastId < notifications[0].id : false,
  [getNotifications, getLastNotificationId],
)

export const getPendingChallenges = R.pipe(
  getMainStore,
  R.prop('pendingChallenges'),
  R.map((x) => ({ ...x, feed: [], tagged_users: [] })),
)

export const getHasPendingChallenges = R.pipe(
  getPendingChallenges,
  (challenges) => challenges.length > 0,
)

export const getAlienProfile = R.pipe(getMainStore, R.prop('selectedUser'))

export const getAlienProfileInviter = R.pipe(
  getAlienProfile,
  R.prop('invited_by'),
)

export const getAlienProfileId = R.pipe(getAlienProfile, R.prop('id'))
export const getAlienProfileEmail = R.pipe(getAlienProfile, R.prop('email'))
export const getAlienProfileName = R.pipe(getAlienProfile, R.prop('name'))
export const getAlienProfileUsername = R.pipe(
  getAlienProfile,
  R.prop('username'),
)
export const getAlienProfileBio = R.pipe(getAlienProfile, R.prop('bio'))
export const getAlienProfilePublic = R.pipe(getAlienProfile, R.prop('public'))
export const getAlienProfileUserStats = R.pipe(
  getAlienProfile,
  R.propOr({}, 'user_stats'),
)

export const getAlienProfileInspirations = R.pipe(
  getAlienProfile,
  (profile) => ({
    today: profile.today_inspirations_count,
    all: profile.inspirations_count,
  }),
)

export const getAlienProfileChallengesCount = R.pipe(
  getAlienProfile,
  R.prop('challenges_count'),
)

export const getAlienProfilePhoto = R.pipe(getAlienProfile, R.prop('photo_url'))

export const getAlienProfileFollowersCount = R.pipe(
  getAlienProfile,
  R.prop('followers_count'),
)

export const getAlienProfilePendingFollowers = R.pipe(
  getAlienProfile,
  R.prop('pending_follower_count'),
)

export const getAlienProfileFollowingConut = R.pipe(
  getAlienProfile,
  R.prop('following_count'),
)

export const getIsLoadingEdit = R.pipe(getMainStore, R.prop('isLoadingEdit'))

export const getIsLoadingExplore = R.pipe(
  getMainStore,
  R.prop('isLoadingExplore'),
)
export const getTopics = R.pipe(getMainStore, R.prop('topics'))
export const getFeaturesGames = R.pipe(getMainStore, R.prop('featuresGames'))
export const getRandomGames = R.pipe(getMainStore, R.prop('randomGames'))
export const getPopularGames = R.pipe(getMainStore, R.prop('popularGames'))
export const getPosibleFriends = R.pipe(getMainStore, R.prop('posibleFriends'))
export const getInterestingUsers = R.pipe(
  getMainStore,
  R.prop('interestingUsers'),
)

export const getCelebrity = R.pipe(
  getMainStore,
  R.prop('interestingUsers'),
  R.prop('featured'),
)
