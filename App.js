import { useNetInfo } from '@react-native-community/netinfo'
import { Notifications } from 'react-native-notifications'
import * as Sentry from '@sentry/react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AppState, Linking } from 'react-native'
import codePush from 'react-native-code-push'
import SystemSetting from 'react-native-system-setting'
import { Audio } from 'expo-av'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import AppNavigator from './src/AppNavigator'
import { DropDownAlert } from './src/components/DropdownAlert'
import GlobalLoader from './src/components/GlobalLoader'
import { BUNDLE, THEME } from './src/const'
import {
  checkAuth,
  getToken,
  saveDeviceToken,
  setInitialData,
  verifyInviteCode,
} from './src/modules/auth'
import * as AuthRepo from './src/modules/auth/repository'
import { sendViews, setMuted } from './src/modules/main/duck'
import { getIsGlobalLoading } from './src/modules/main/selectors'
import { init, navigate } from './src/modules/NavigationService'
import { DropdownService } from './src/services'
import { parseDeepLink, useAnalytics } from './src/utils/functions'

Sentry.init({
  dsn: 'https://dc5b1ee77a12465ca2a06f718e853113@o902606.ingest.sentry.io/5842760',
  environment: BUNDLE.isProduction ? 'production' : 'dev',
})

const ContainerApp = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${THEME.primaryBackgroundColor};
`

const AppDumb = () => {
  const logEvent = useAnalytics()

  const dispatch = useDispatch()
  const token = useSelector(getToken)
  const isGlobalLoading = useSelector(getIsGlobalLoading)

  const firstRun = useRef(true)
  const network = useRef(true)
  const netInfo = useNetInfo()
  const volume = useRef(-1)
  const locToken = useRef(token)

  const [currentAppState, setCurrentAppState] = useState(AppState.currentState)

  useEffect(() => {
    locToken.current = token
  }, [token])

  const handleRoute = useCallback(({ object, id, extra }) => {
    if (object == 'invite') {
      dispatch(verifyInviteCode(id))
    } else if (object == 'user') {
      navigate('AlienProfile', { user: { id } })
    } else if (object == 'challenge') {
      navigate('ChallengeDetailed', {
        direct: true,
        challenge: {
          id: id,
          access_url: extra.token ? `://challenge?token=${extra.token}` : null, // FIXME!
        },
      })
    }
  })

  const handleNotification = (notification, action) => {
    const body = notification.payload.aps
    console.log(body)
    if (body.url) {
      const urlData = parseDeepLink(/\/\/(\w+)\/(\w+)/, body.url)
      if (urlData) {
        if (locToken.current) {
          handleRoute(urlData)
        } else {
          dispatch(setInitialData(urlData))
        } // see check auth sagas
      }
    }
  }

  const handleUrl = ({ url }) => {
    const urlData = parseDeepLink(/\/share\/(\w+)\/(\w+)/, url)
    if (urlData) {
      if (locToken.current || urlData.object === 'invite') {
        handleRoute(urlData)
      } else {
        dispatch(setInitialData(urlData))
      } // see check auth sagas
    }
  }

  const handleChangeVolume = ({ value }) => {
    if (volume.current !== -1 && volume.current !== value) {
      dispatch(setMuted(false))
    }
    volume.current = value
  }

  useEffect(() => {
    if (firstRun.current) {
      logEvent('Retention - session start')
      firstRun.current = false
      return
    }

    if (netInfo.isConnected && !network.current && !firstRun.current) {
      DropdownService.alert('success', 'Connected to network')
    } else if (!netInfo.isConnected && !firstRun.current) {
      network.current && DropdownService.alert('error', 'No network connection')
      network.current = false
    }
  }, [netInfo.isConnected])

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true })

    Linking.addEventListener('url', handleUrl)
    const volumeListener = SystemSetting.addVolumeListener(handleChangeVolume)

    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      dispatch(saveDeviceToken(event.deviceToken))
    })
    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      (event) => {
        console.error('Failed to register for push notifications', event)
      },
    )
    Notifications.events().registerNotificationOpened(
      (notification, completion, action) => {
        handleNotification(notification, action)
        completion()
      },
    )

    AppState.addEventListener('change', setCurrentAppState)
    return () => {
      Linking.removeEventListener('url')
      SystemSetting.removeVolumeListener(volumeListener)
      AppState.removeEventListener('change')
    }
  }, [])

  useEffect(() => {
    if (currentAppState === 'inactive' && token) dispatch(sendViews())
  }, [currentAppState])

  useEffect(() => {
    dispatch(checkAuth())
    codePush
      .sync({ installMode: codePush.InstallMode.ON_NEXT_RESTART })
      .then((status) => {
        if (status === codePush.SyncStatus.UPDATE_INSTALLED) {
          AuthRepo.getFirstLaunch().then((isFirst) => {
            if (isFirst !== 'false') {
              AuthRepo.setFirstLaunch('true')
            } else {
              DropdownService.alert(
                'suceess',
                'Update downloaded',
                'The update will be installed after app restart',
              )
            }
          })
        }
      })
  }, [])
  return (
    <ContainerApp>
      <AppNavigator ref={init} />
      <DropDownAlert />
      {isGlobalLoading ? <GlobalLoader /> : null}
    </ContainerApp>
  )
}

const App = codePush({ checkFrequency: codePush.CheckFrequency.MANUAL })(
  AppDumb,
)

export default App
