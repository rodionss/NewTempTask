import * as R from 'ramda'
import API from '../../API'
import { handleStatuses } from '../../aspects'
import { authGet, authDelete, createFormData } from '../../utils'
import momentTz from 'moment-timezone'

export const addToQueue = R.pipeP(
  (contact, apnToken) =>
    fetch(API.QUEUE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, apn_token: apnToken }),
    }),
  handleStatuses,
  (res) => res.json(),
)

export const completeWelcomeChallenge = R.pipeP(
  (token, video, thumbnail) =>
    fetch(`${API.CHALLENGE_V2}/welcome`, {
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
)

export const verifyInviteCode = R.pipeP(
  (code) =>
    fetch(API.INVITE + '/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invite_code: code }),
    }),
  handleStatuses,
  (res) => res.json(),
)

export const verifyPhone = R.pipeP(
  (phone) =>
    fetch(API.VERIFY_PHONE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    }),
  handleStatuses,
  (res) => res.json(),
)

export const verifyCode = R.pipeP(
  (phone, code) =>
    fetch(API.VERIFY_CODE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    }),
  handleStatuses,
  (res) => res.json(),
)

export const signup = R.pipeP(
  ({ phone, username, code, name, bio }, invite_id, deviceName, apnToken) =>
    fetch(API.SIGNUP, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        username,
        code,
        name,
        bio,
        public: true,
        device_name: deviceName,
        apn_token: apnToken || '',
        invite_id,
        timezone: momentTz.tz.guess(),
      }),
    }),
  handleStatuses,
  (res) => res.json(),
)

export const signin = R.pipeP(
  ({ phone, code }, deviceName, apnToken) =>
    fetch(API.SIGNIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        code,
        device_name: deviceName,
        apn_token: apnToken || '',
        timezone: momentTz.tz.guess(),
      }),
    }),
  (res) => res.json().then((x) => ({ ...x, status: res.status })),
)

export const uploadAvatar = R.pipeP(
  (token, uri) =>
    fetch(API.PHOTO, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body: createFormData([{ uri, name: 'photo', format: 'jpg' }]),
    }),
  handleStatuses,
  (res) => res.json(),
)

export const deleteProfile = R.pipeP(
  (token) => fetch(API.PROFILE, authDelete(token)),
  handleStatuses,
  (res) => res.json(),
)

export const togglePublicAvatar = R.pipeP(
  (token, id, isPublic) =>
    fetch(`${API.AVATAR}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_public: isPublic }),
    }),
  handleStatuses,
  (x) => x.json(),
)

export const getProfile = R.pipeP(
  (token) => fetch(API.PROFILE, authGet(token)),
  handleStatuses,
  (res) => res.json(),
  R.prop('result'),
)
