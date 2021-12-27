import * as R from 'ramda'
import { getFormValues } from 'redux-form'

const getAuthStore = R.prop('auth')

export const getToken = R.pipe(getAuthStore, R.prop('token'))

export const getInitialData = R.pipe(getAuthStore, R.prop('initialData'))

export const getIsLoadingSmsCode = R.pipe(
  getAuthStore,
  R.prop('isLoadingSmsCode'),
)

export const getProfile = R.pipe(getAuthStore, R.prop('profile'))

export const getProfileEmail = R.pipe(getProfile, R.prop('email'))

export const getProfileInviter = R.pipe(getProfile, R.prop('invited_by'))

export const getProfileId = R.pipe(getProfile, R.prop('id'))

export const getProfileApnToken = R.pipe(getProfile, R.prop('apn_token'))

export const getProfileInvites = R.pipe(getProfile, R.prop('invites'))

export const getProfileInteractions = R.pipe(getProfile, R.prop('interactions'))

export const getProfileInteractionsRecent = R.converge(
  (interactions, myId) =>
    interactions.recent ? interactions.recent.filter((x) => x.id !== myId) : [],
  [getProfileInteractions, getProfileId],
)

export const getProfileName = R.pipe(getProfile, R.prop('name'))

export const getProfileUsername = R.pipe(getProfile, R.prop('username'))

export const getProfileBio = R.pipe(getProfile, R.prop('bio'))

export const getProfilePhoto = R.pipe(getProfile, R.prop('photo_url'))

export const getProfileInspirations = R.pipe(getProfile, (profile) => ({
  today: profile.today_inspirations_count,
  all: profile.inspirations_count,
}))

export const getProfileChallengesCount = R.pipe(
  getProfile,
  R.prop('challenges_count'),
)

export const getProfileFollowersCount = R.pipe(
  getProfile,
  R.prop('followers_count'),
)

export const getProfilePendingFollowers = R.pipe(
  getProfile,
  R.prop('pending_followers_count'),
)

export const getProfileFollowingConut = R.pipe(
  getProfile,
  R.prop('following_count'),
)

export const getProfileForm = getFormValues('profile')

export const getProfilePhoneRawForm = R.pipe(getProfileForm, R.prop('phoneRaw'))

export const getProfilePhoneForm = R.pipe(getProfileForm, R.prop('phone'))

export const getIsLoadingSignin = R.pipe(
  getAuthStore,
  R.prop('isLoadingSignin'),
)

export const getIsLodaingEmail = R.pipe(getAuthStore, R.prop('isLodaingEmail'))

export const getIsLodaingProfile = R.pipe(
  getAuthStore,
  R.prop('isLodaingProfile'),
)

export const getWelcomeChallenges = R.pipe(
  getAuthStore,
  R.prop('welcomeChallenges'),
)
