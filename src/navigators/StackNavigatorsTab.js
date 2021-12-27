import { createStackNavigator } from 'react-navigation-stack'
import {
  AlienFollowersUsers,
  AlienFollowingUsers,
  AlienProfile,
  AllGamesList,
  BlockedUsers,
  CameraChallenge,
  CameraCreateChallenge,
  ChallengeDetailed,
  CompletedUsers,
  CompletionsTile,
  CreateChallenge,
  EditProfile,
  Explore,
  Feed,
  FollowersUsers,
  FollowingUsers,
  Invite,
  QRCodeInvite,
  Notifications,
  ParticipantUsers,
  Profile,
  ProfileSetting,
  ReactionsTile,
  VideoEditor as CameraVideoEditor,
} from '../screens'

const getNavigationOptions = (initRoute, options = {}) => ({
  initialRouteName: initRoute,
  headerMode: 'none',
  defaultNavigationOptions: ({ navigation }) => ({
    gestureEnabled: !navigation.state.routeName.includes('Camera'),
  }),
  navigationOptions: ({ navigation }) => {
    let routeName = navigation.state.routes[navigation.state.index].routeName
    return {
      tabBarVisible: ![
        'CameraChallenge',
        'CameraCreateChallenge',
        'CreateChallenge',
        'CameraVideoEditor',
        'Invite',
        'QRCodeInvite',
      ].includes(routeName),
    }
  },
  ...options,
})

const PushableRoutes = {
  Profile,
  FollowingUsers,
  FollowersUsers,
  CompletionsTile,
  ReactionsTile,
  AlienProfile,
  AlienFollowingUsers,
  AlienFollowersUsers,
  CompletedUsers,
  ParticipantUsers,
  ChallengeDetailed,
  CameraVideoEditor,
  CameraChallenge,
}

export const FeedNavigator = createStackNavigator(
  {
    Feed,
    ...PushableRoutes,
  },
  getNavigationOptions('Feed'),
)

export const CreateChallengeNavigator = createStackNavigator(
  {
    CreateChallenge,
    CameraCreateChallenge,
    CameraVideoEditor,
  },
  getNavigationOptions('CameraCreateChallenge'),
)

export const ExploreNavigator = createStackNavigator(
  {
    Explore,
    AllGamesList,
    ...PushableRoutes,
  },
  getNavigationOptions('Explore'),
)

export const ProfileNavigator = createStackNavigator(
  {
    ProfileSetting,
    EditProfile,
    Invite,
    QRCodeInvite,
    BlockedUsers,
    ...PushableRoutes,
  },
  getNavigationOptions('Profile'),
)

export const NotificationNavigator = createStackNavigator(
  {
    Notifications,
    ...PushableRoutes,
  },
  getNavigationOptions('Notifications'),
)
