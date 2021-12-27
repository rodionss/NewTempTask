import { createStackNavigator } from 'react-navigation-stack'
import {
  CameraWelcomeChallenge,
  CodePhoneRegistration,
  FollowContacts,
  InfoRegistration,
  InviteCodeRegistration,
  NotificationRegistration,
  Onboarding,
  Authorization,
  PhoneCodeRegistration,
  PhoneRegistration,
  ProfileRegistration,
  WelcomeChallenge,
  Empty,
} from '../screens'

export const AuthNavigator = createStackNavigator(
  {
    Empty: Empty,
    Authorization,
    Onboarding,
    NotificationRegistration,
    PhoneRegistration,
    InfoRegistration,
    PhoneCodeRegistration,
    CodePhoneRegistration,
    InviteCodeRegistration,
    ProfileRegistration,
    FollowContacts,
    WelcomeChallenge,
    CameraWelcomeChallenge,
  },
  { headerMode: 'none' },
)
