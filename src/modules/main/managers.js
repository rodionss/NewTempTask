import * as R from 'ramda'
import API from '../../API'
import { handleStatuses } from '../../aspects'
import { authDelete, authGet, authPost, createFormData } from '../../utils'

const pipe = R.unapply(R.pipeWith(R.andThen))

export const searchUser = pipe(
  (token, q, page = 1) =>
    fetch(API.USER + `?q=${q}&page=${page}`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const searchGames = pipe(
  (token, q, page = 1) =>
    fetch(API.CHALLENGE + `?q=${q}&page=${page}`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getBlockedUsers = pipe(
  (token, q, page = 1) =>
    fetch(
      API.USER +
        `?search_type=blocked&search_case=all&page=${page}` +
        (q ? `&q=${q}` : ''),
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getUserById = pipe(
  (token, userId) => fetch(API.USER + `/${userId}`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (x) => x.result.user,
)

export const getNotifications = pipe(
  (token, page = 1) =>
    fetch(API.NOTIFICATION_v2 + `?page=${page}`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const tagConfirm = pipe(
  (token, id) => fetch(`${API.CHALLENGE}/${id}/tag/confirm`, authPost(token)),
  handleStatuses,
  (res) => res.json(),
)

export const declineFollower = pipe(
  (token, id) =>
    fetch(`${API.PROFILE}/follow/decline`, authPost(token, { user_id: id })),
  handleStatuses,
  (res) => res.json(),
)

export const getFeaturedCategories = pipe(
  (token) => fetch(`${API.EXPLORE}/featured-categories`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  R.prop('result'),
)

export const getRandomGames = pipe(
  (token) => fetch(`${API.EXPLORE}/random-challenges?limit=20`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  R.prop('result'),
)

export const getFeaturedUsers = pipe(
  (token) => fetch(`${API.PROFILE}/featured`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  R.prop('result'),
)

export const declineChallenge = pipe(
  (token, id) => fetch(`${API.CHALLENGE}/${id}/decline`, authPost(token)),
  handleStatuses,
  (res) => res.json(),
)

export const acceptFollower = pipe(
  (token, id) =>
    fetch(`${API.PROFILE}/follow/accept`, authPost(token, { user_id: id })),
  handleStatuses,
  (res) => res.json(),
)

export const blockUser = pipe(
  (token, id) => fetch(`${API.USER}/${id}/block`, authPost(token)),
  handleStatuses,
  (res) => res.json(),
)

export const unblockUser = pipe(
  (token, id) => fetch(`${API.USER}/${id}/unblock`, authPost(token)),
  handleStatuses,
  (res) => res.json(),
)

export const sendContacts = pipe(
  (token, body) => fetch(API.CONTACTS, authPost(token, body)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const sendComplaint = pipe(
  (token, body) => fetch(API.COMPLAINT.url, authPost(token, body)),
  handleStatuses,
  (res) => res.json(),
)

export const getActiveChallenges = pipe(
  (token, id) =>
    fetch(API.USER_V2 + `/${id}/active-challenges`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getFeaturedGames = pipe(
  (token) => fetch(API.EXPLORE + `/featured-challenges`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getPopularGames = pipe(
  (token) => fetch(API.EXPLORE + `/popular-challenges`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getMutualFriends = pipe(
  (token) => fetch(API.EXPLORE + `/mutual-friends`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getNewUsers = pipe(
  (token) => fetch(API.EXPLORE + `/new-users`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getPendingChallenges = pipe(
  (token) => fetch(API.PROFILE + `/pending-challenges`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result.challenges,
)

export const doNowChallenge = pipe(
  (token, video, thumbnail, challenge_id, from_user_id) =>
    fetch(API.CHALLENGE + `/${challenge_id}/do-now`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: createFormData(
        [
          { uri: video, name: 'video', format: 'mp4' },
          { uri: thumbnail, name: 'thumbnail', format: 'jpg' },
        ],
        from_user_id ? { from_user_id } : {},
      ),
    }),
  handleStatuses,
  (res) => res.json(),
)

export const completeChallenge = pipe(
  (token, challenge_id, from_user_id) =>
    fetch(
      API.CHALLENGE + `/${challenge_id}/complete`,
      authPost(token, from_user_id ? { from_user_id } : {}),
    ),
  handleStatuses,
  (res) => res.json(),
)

export const sendViews = pipe(
  (token, ids) =>
    fetch(
      API.CHALLENGE + `/stats/views`,
      authPost(token, { participant_ids: ids }),
    ),
  handleStatuses,
  (res) => res.json(),
)

export const addMediaToChallenge = pipe(
  (token, challenge_id, video, thumbnail, from_user_id) =>
    fetch(API.CHALLENGE + `/${challenge_id}/complete/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: createFormData(
        [
          { uri: video, name: 'video', format: 'mp4' },
          { uri: thumbnail, name: 'thumbnail', format: 'jpg' },
        ],
        from_user_id ? { from_user_id } : {},
      ),
    }),
  handleStatuses,
  (res) => res.json(),
)

export const deleteCompletion = pipe(
  (token, challenge_id, post_id) =>
    fetch(
      API.CHALLENGE + `/${challenge_id}/feed/${post_id}`,
      authDelete(token),
    ),
  handleStatuses,
  (res) => res.json(),
)

export const deleteChallenge = pipe(
  (token, challenge_id) =>
    fetch(API.CHALLENGE + `/${challenge_id}`, authDelete(token)),
  handleStatuses,
  (res) => res.json(),
)

export const getUserChallengeHistory = pipe(
  (token, userId, page) =>
    fetch(
      API.USER_V2 + `/${userId}/challenge-history?type=completed&page=${page}`,
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getTaggedChallengeHistory = pipe(
  (token, userId, page) =>
    fetch(
      API.USER_V2 + `/${userId}/challenge-history?type=tagged&page=${page}`,
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getFavourites = pipe(
  (token) => fetch(API.PROFILE + `/favourites`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.favourites.map(R.prop('challenge')),
)

export const getUserChallenges = pipe(
  (token, userId, page) =>
    fetch(
      API.USER_V2 + `/${userId}/challenge-history?type=created&page=${page}`,
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getRandChallenges = pipe(
  (token, category_ids = []) =>
    fetch(
      API.CHALLENGE +
        `/rand${
          category_ids.length
            ? '?' + category_ids.map((id) => `category_ids[]=${id}`).join('&')
            : ''
        }`,
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result.challenges,
)

export const challengeJoin = pipe(
  (token, challenge_id, joinToken, from_user_id) =>
    fetch(
      API.CHALLENGE +
        `/${challenge_id}/join${joinToken ? `?token=${joinToken}` : ''}`,
      authPost(token, { from_user_id }),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const challengeFeed = pipe(
  (token, challenge_id, page = 1) =>
    fetch(API.CHALLENGE + `/${challenge_id}/feed?page=${page}`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const participantsReactions = pipe(
  (token, completion_id, page = 1) =>
    fetch(
      API.USER +
        `?search_type=participant_reactions&search_case=any&participant_id=${completion_id}&page=${page}`,
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getChallengeById = pipe(
  (token, challenge_id, joinToken) =>
    fetch(
      API.CHALLENGE +
        `/${challenge_id}${joinToken ? `?token=${joinToken}` : ''}`,
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result.challenge,
)

export const getFollowing = pipe(
  (token, userId, q, page = 1) =>
    fetch(
      API.USER +
        `?search_type=followers&search_case=following&user_id=${userId}&page=${page}` +
        (q ? `&q=${q}` : ''),
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getFollowers = pipe(
  (token, userId, q, page = 1) =>
    fetch(
      API.USER +
        `?search_type=followers&search_case=followers&user_id=${userId}&page=${page}` +
        (q ? `&q=${q}` : ''),
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const hideChallenge = pipe(
  (token, challenge_id) =>
    fetch(API.CHALLENGE + `/${challenge_id}/hide`, authDelete(token)),
  handleStatuses,
  (res) => res.json(),
)

export const removeMeFromChallenge = pipe(
  (token, challenge_id) =>
    fetch(API.CHALLENGE_V2 + `/${challenge_id}/participant`, authDelete(token)),
  handleStatuses,
  (res) => res.json(),
)

export const inviteChallenge = pipe(
  (token, challengeId, body) =>
    fetch(
      API.CHALLENGE + `/${challengeId}/participants`,
      authPost(token, body),
    ),
  handleStatuses,
  (res) => res.json(),
)

export const getCompleteUsers = pipe(
  (token, challengeId, q, page = 1) =>
    fetch(
      API.USER +
        `?search_type=challenge_participants&search_case=completed&challenge_id=${challengeId}&page=${page}` +
        (q ? `&q=${q}` : ''),
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const addFavourites = pipe(
  (token, challenge_id) =>
    fetch(API.PROFILE + `/favourites`, authPost(token, { challenge_id })),
  handleStatuses,
  (res) => res.json(),
)

export const removeFromFavourites = pipe(
  (token, challenge_id) =>
    fetch(API.PROFILE + `/favourites/${challenge_id}`, authDelete(token)),
  handleStatuses,
  (res) => res.json(),
)

export const getJoinedUsers = pipe(
  (token, challengeId, q, page = 1) =>
    fetch(
      API.USER +
        `?search_type=challenge_participants&search_case=joined&challenge_id=${challengeId}&page=${page}` +
        (q ? `&q=${q}` : ''),
      authGet(token),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const getPendingRequests = async (token, userId) => {
  const resfollowers = await fetch(
    API.USER + `?follow_type=pending_followers&user_id=${userId}`,
    authGet(token),
  )
  const followers = await resfollowers.json()
  return followers.result.users
}

export const getFeed = pipe(
  (token, page = 1) => fetch(`${API.FEED}?page=${page}`, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result,
)

export const follow = pipe(
  (token, user_id) => fetch(API.FOLLOW, authPost(token, { user_id })),
  handleStatuses,
  (res) => res.json(),
)

export const unfollow = pipe(
  (token, user_id) => fetch(API.UNFOLLOW, authPost(token, { user_id })),
  handleStatuses,
  (res) => res.json(),
)

export const addChallenge = pipe(
  (token, body, video, thumbnail) =>
    fetch(API.CHALLENGE_V2, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: createFormData(
        [
          { uri: video, name: 'video', format: 'mp4' },
          { uri: thumbnail, name: 'thumbnail', format: 'jpg' },
        ],
        body,
      ),
    }),
  handleStatuses,
  (res) => res.json(),
)

export const editChallenge = pipe(
  (token, id, body) => fetch(API.CHALLENGE + `/${id}`, authPost(token, body)),
  handleStatuses,
  (res) => res.json(),
)

export const reactCompletion = R.pipeP(
  (token, id, reaction) =>
    fetch(
      API.CHALLENGE + `/participant/${id}/react`,
      authPost(token, { reaction }),
    ),
  handleStatuses,
  (res) => res.json(),
)

export const removeReaction = pipe(
  (token, id) =>
    fetch(
      API.CHALLENGE + `/participant/${id}/remove-reaction`,
      authPost(token),
    ),
  handleStatuses,
  (res) => res.json(),
)

export const addChallengeMedia = pipe(
  (token, id, video, thumbnail) =>
    fetch(API.CHALLENGE + `/${id}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: createFormData([
        { uri: video, name: 'video', format: 'mp4' },
        { uri: thumbnail, name: 'thumbnail', format: 'jpg' },
      ]),
    }),
  handleStatuses,
  (res) => res.json(),
)

export const editProfile = pipe(
  (token, profile) =>
    fetch(
      API.PROFILE,
      authPost(token, {
        name: profile.name,
        bio: profile.bio,
        username: profile.username,
        public: true,
      }),
    ),
  handleStatuses,
  (res) => res.json(),
  R.prop('user'),
)

export const updateApnToken = pipe(
  (token, apnToken) =>
    fetch(
      API.PROFILE + '/push-token',
      authPost(token, { apn_token: apnToken }),
    ),
  handleStatuses,
  (res) => res.json(),
  R.prop('user'),
)

export const inviteByPhone = pipe(
  (token, phone) =>
    fetch(
      API.INVITE + `/phone`,
      authPost(token, {
        phone: phone,
      }),
    ),
  handleStatuses,
  (res) => res.json(),
  (res) => res.result.invites,
)

export const getMockImages = () =>
  Promise.resolve([
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/59/f7/f251f4ea1e8f308d9475ab2f8f99.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/2d/ab/4e2fbc5d9f3481a6a283bc14e337.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/36/37/66280a34560786addc2865e24006.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/c1/55/ae1c7bf155a25234161e008db0d9.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/38/00/3365f09ef2408c3eb1e77fa94960.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/de/40/cdd86f3e5f70861d1b739341578e.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/59/f7/f251f4ea1e8f308d9475ab2f8f99.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/38/00/3365f09ef2408c3eb1e77fa94960.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/02/23/7b5204cdd5a797bd46257084b643.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/2d/ab/4e2fbc5d9f3481a6a283bc14e337.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/36/37/66280a34560786addc2865e24006.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/02/23/7b5204cdd5a797bd46257084b643.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/de/40/cdd86f3e5f70861d1b739341578e.jpg',
    'https://happyo-storage-dev.s3.eu-central-1.amazonaws.com/c1/55/ae1c7bf155a25234161e008db0d9.jpg',
  ])
