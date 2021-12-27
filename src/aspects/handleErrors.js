import { call, put } from 'redux-saga/effects'
import { DropdownService } from '../services'
import NetInfo from '@react-native-community/netinfo'

export const handleErrors = (e) =>
  DropdownService.alert('error', 'Error', e.message)

export const handleSagaErrors = (reduxHelpers) => (saga) =>
  function* (...args) {
    try {
      yield call(saga, ...args)
    } catch (e) {
      yield reduxHelpers && reduxHelpers.action && put(reduxHelpers.action)
      console.log(e)
      const { isConnected } = yield NetInfo.fetch()
      if (isConnected) {
        DropdownService.alert('error', 'Error', e.message)
      } else {
        DropdownService.alert('error', 'Error', 'No network connection')
      }
    }
  }

export default handleSagaErrors
