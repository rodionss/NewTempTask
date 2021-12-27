import React from 'react'
import { createAppContainer } from 'react-navigation'
import { AuthNavigator, MainNavigator } from './navigators'
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch'
import { Transition } from 'react-native-reanimated'
import { THEME } from './const'

const AppNavigator = createAnimatedSwitchNavigator(
  {
    AuthNavigator,
    MainNavigator,
  },
  {
    initialRouteName: 'AuthNavigator',
    resetOnBlur: true,
    transitionViewStyle: { backgroundColor: THEME.primaryBackgroundColor },
    transition: (
      <Transition.Together>
        <Transition.Out
          type='slide-left'
          durationMs={100}
          interpolation='easeIn'
        />
        <Transition.In type='slide-right' durationMs={100} />
      </Transition.Together>
    ),
  },
)

export default createAppContainer(AppNavigator)
