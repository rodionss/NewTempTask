// impo
import { all, call } from 'redux-saga/effects'
import authSaga from './auth/sagas'
import mainSaga from './main/sagas'

const rootSaga = function* () {
  yield all([call(authSaga), call(mainSaga)])
}

export default rootSaga
