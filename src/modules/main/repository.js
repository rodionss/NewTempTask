import AsyncStorage from '@react-native-community/async-storage'

const LAST_NOTIFICATION_ID = 'last_notification_id'
const TUTORIAL_STEP = '1tutorial_step'
const TUTORIAL = '3tutorial'

export const setLastNotificationId = (id) =>
  AsyncStorage.setItem(LAST_NOTIFICATION_ID, id.toString())

export const getLastNotificationId = () =>
  AsyncStorage.getItem(LAST_NOTIFICATION_ID).then((x) => (x ? parseInt(x) : 0))

export const saveTutorialStep = (step) =>
  AsyncStorage.setItem(TUTORIAL_STEP, step.toString())

export const getTutorialStep = () =>
  AsyncStorage.getItem(TUTORIAL_STEP).then((x) => (x ? parseInt(x) : 1))

export const saveTutorial = (tutorial) => {
  AsyncStorage.setItem(TUTORIAL, JSON.stringify(tutorial)).then(() => {})
}

export const getTutorial = () => {
  return AsyncStorage.getItem(TUTORIAL).then((tutorial) => {
    return tutorial ? JSON.parse(tutorial) : {}
  })
}
