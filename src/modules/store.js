import { createStore, applyMiddleware } from 'redux'
import rootSaga from './rootSaga'
import rootReducer from './rootReducer'
import sagaMiddlewareFactory from 'redux-saga'

const sagaMiddleware = sagaMiddlewareFactory()

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))

sagaMiddleware.run(rootSaga)

export default store
