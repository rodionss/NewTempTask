import auth from './auth/duck'
import main from './main/duck'
import { reducer as form } from 'redux-form'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({ auth, main, form })

export default rootReducer
