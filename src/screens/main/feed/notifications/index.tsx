import Header from '@components/common/Header'
import { BackIcon } from '@components/icons'
import { Container } from '@components/main'
import { getHasNotifications } from '@modules/main'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getFirstLaunch } from '@modules/auth/repository'
import EnableNotifications from '@screens/main/feed/notifications/EnableNotifications'
import EnablePushNotifications, { Appearance } from './EnablePushNotifications'
import ActiveGames from './ActiveGames'
import Digest from './Digest'
import NotificationList from './NotificationList'
import { View } from './types'

type ActivityViewProps = {
  view: View
  setView: (view: View) => void
}

function ActivityView({ view, setView }: ActivityViewProps) {
  const openNotifications = () => setView(View.Notifications)
  const openActiveGames = () => setView(View.ActiveGames)

  switch (view) {
    case View.Notifications:
      return (
        <Container>
          <Header
            title='Notifications'
            leftButton={{
              onPress: openActiveGames,
              icon: BackIcon,
            }}
          />

          <EnablePushNotifications appearance={Appearance.Light} />

          <NotificationList showAll />
        </Container>
      )
    case View.Digest:
      return (
        <Digest
          onSeeAllPress={openNotifications}
          onClosePress={openActiveGames}
        />
      )
    case View.ActiveGames:
      return <ActiveGames onNotificationIconPress={openNotifications} />
    default:
      return null
  }
}

function Notifications() {
  const hasNotifications = useSelector(getHasNotifications)
  const [showTutorial, setShowTutorial] = useState(false)
  const [view, setView] = useState(
    hasNotifications ? View.Digest : View.ActiveGames,
  )

  useEffect(() => {
    getFirstLaunch().then((isFirst) => {
      if (isFirst === 'true') {
        setShowTutorial(true)
      }
    })
  }, [])

  if (showTutorial) {
    return <EnableNotifications onClosePress={() => setShowTutorial(false)} />
  }

  return <ActivityView view={view} setView={setView} />
}

export default Notifications
