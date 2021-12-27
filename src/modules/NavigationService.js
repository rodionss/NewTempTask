import { NavigationActions, StackActions } from 'react-navigation'

let _navigator = null

export function init(navigator) {
  if (navigator) _navigator = navigator
}

export function navigate(routeName, params) {
  if (!_navigator || !routeName) return

  const action = NavigationActions.navigate({ routeName, params })
  _navigator.dispatch(action)
}

export function goBack() {
  if (!_navigator) return

  const action = NavigationActions.back({})
  _navigator.dispatch(action)
}

export function popToTop() {
  if (!_navigator) return

  const action = StackActions.popToTop()
  _navigator.dispatch(action)
}
