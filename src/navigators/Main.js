import React from 'react'
import FastImage from 'react-native-fast-image'
import { BottomTabBar, createBottomTabNavigator } from 'react-navigation-tabs'
import styled from 'styled-components'
import { assetList } from '../assets'
import { default as NotificationsIcon } from '../components/NotificationsIcon'
import { default as ProfileIcon } from '../components/ProfileIcon'
import { TAB_HEIGHT } from '../const'
import {
  CreateChallengeNavigator,
  ExploreNavigator,
  FeedNavigator,
  NotificationNavigator,
  ProfileNavigator,
} from '../navigators/StackNavigatorsTab'

const TabIcon = FastImage

const iconSize = 50
const scale = 1
const createIconWidth = 70
const createIconHeight = 50

const tabs = {
  Feed: {
    icon: {
      source: assetList.tabbar.feed,
      width: 44,
      height: 44,
    },
    active: {
      source: assetList.tabbar.feedActive,
      width: 44,
      height: 44,
    },
  },
  Explore: {
    icon: {
      source: assetList.tabbar.explore,
      width: iconSize,
      height: iconSize,
    },
    active: {
      source: assetList.tabbar.exploreActive,
      width: iconSize,
      height: iconSize,
    },
  },
  CreateChallenge: {
    icon: {
      source: assetList.tabbar.create,
      width: createIconWidth,
      height: createIconHeight,
    },
  },
  Notifications: {
    icon: {
      source: assetList.tabbar.activity,
      width: iconSize,
      height: iconSize,
    },
    active: {
      source: assetList.tabbar.activityActive,
      width: iconSize,
      height: iconSize,
    },
  },
}

const TabBarOverlay = styled.View`
  position: absolute;
  overflow: hidden;
  flex: 1;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${TAB_HEIGHT}px;
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
  background-color: #1b1d1d;
`

const MainNavigator = createBottomTabNavigator(
  {
    Feed: FeedNavigator,
    Explore: ExploreNavigator,
    CreateChallenge: CreateChallengeNavigator,
    Notifications: NotificationNavigator,
    Profile: ProfileNavigator,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Feed',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const routeName = navigation.state.routeName
        if (routeName == 'Profile') {
          return (
            <ProfileIcon
              active={focused}
              color={tintColor}
              size={iconSize}
              scale={scale}
            />
          )
        }
        if (routeName == 'Notifications')
          return <NotificationsIcon active={focused} />

        const icon =
          focused && tabs[routeName].active
            ? tabs[routeName].active
            : tabs[routeName].icon

        return (
          <TabIcon
            source={icon.source}
            style={{
              width: icon.width,
              height: icon.height,
              color: tintColor,
            }}
          />
        )
      },

      tabBarLabel: ({ focused, tintColor }) => null,

      tabBarComponent: (props) => {
        return (
          <TabBarOverlay>
            <BottomTabBar {...props} />
          </TabBarOverlay>
        )
      },
      tabBarOptions: {
        showLabel: true,
        activeTintColor: '#ffffff',
        inactiveTintColor: '#c4c4c4',

        style: {
          height: 70,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
        },
      },
    }),
  },
)

export default MainNavigator
