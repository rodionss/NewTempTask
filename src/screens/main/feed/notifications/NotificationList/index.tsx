import * as R from 'ramda'
import React, { useCallback, useEffect, useState } from 'react'
import { RefreshControl } from 'react-native'
import { useIsFocused, useNavigation } from 'react-navigation-hooks'
import { connect, useSelector } from 'react-redux'
import { EmptyState } from '@components/index'
import { getProfileId, getToken } from '@modules/auth'
import { setLastNotificationId, setNotifications } from '@modules/main/duck'
import {
  getLastNotificationId,
  getNotifications,
} from '@modules/main/selectors'
import NotificationItem from '@screens/main/feed/notifications/NotificationList/Notification'
import {
  Notification,
  NotificationGroup,
  Challenge,
} from '@screens/main/feed/notifications/types'
import groupNotifications from '@screens/main/feed/notifications/helpers'
import {
  load,
  decline,
  accept,
  remove,
} from '@screens/main/feed/notifications/domain'
import { SectionText } from '@screens/main/feed/notifications/NotificationList/Notification/atoms'
import { THEME } from '../../../../../const'
import { NavSectionList } from './atoms'

type Props = {
  showAll?: boolean
  setNotifications: (notifications: Notification[]) => void
  setLastNotificationId: (id: number) => void
  digest?: boolean
}

function NotificationList({
  showAll = false,
  setNotifications,
  setLastNotificationId,
  digest = false,
}: Props) {
  const isFocused = useIsFocused()
  const token = useSelector(getToken)
  const id = useSelector(getProfileId) as number
  const lastNotificationId = useSelector(getLastNotificationId)
  const notifications = useSelector(getNotifications) as Notification[]

  const navigation = useNavigation()
  const [refreshing, setRefreshing] = useState(false)
  const [pagination, setPagination] = useState({ hasMore: false, page: 1 })
  const [groups, setGroups] = useState<NotificationGroup[]>([])

  const loadNotifications = (page = 1) => {
    load(
      token,
      notifications,
      setRefreshing,
      setNotifications,
      setLastNotificationId,
      setPagination,
      page,
    )
  }

  useEffect(() => {
    setGroups(
      groupNotifications(
        showAll
          ? notifications
          : notifications.filter(
              ({ id: currentId }) => currentId > lastNotificationId,
            ),
      ),
    )
  }, [notifications, showAll])

  useEffect(() => {
    if (!isFocused) return
    loadNotifications()
  }, [isFocused])

  const handleLoadMore = useCallback(() => {
    if (!digest && pagination.hasMore) {
      loadNotifications(pagination.page + 1)
    }
  }, [pagination])

  const onRefresh = () => {
    if (!digest) {
      setRefreshing(true)
      loadNotifications(1)
    }
  }

  const removeNotification = (notification: Notification) => {
    remove(notification, notifications, setNotifications)
  }

  const navigateChallengeDetailed = (challenge: Challenge, direct = true) => {
    navigation.navigate('ChallengeDetailed', {
      direct,
      challenge,
    })
  }

  const onPressAccept = (notification: Notification) => {
    accept(notification, token, removeNotification, navigateChallengeDetailed)
  }

  const onPressDecline = (notification: Notification) => {
    decline(notification, token, removeNotification)
  }

  const renderItem = useCallback(({ item }) => {
    return (
      <NotificationItem
        item={item}
        id={id}
        onPressAccept={onPressAccept}
        onPressDecline={onPressDecline}
      />
    )
  }, [])

  const renderListEmpty = useCallback(
    () => <EmptyState text='Your notifications will be displayed here' />,
    [],
  )

  const renderSectionHeader = useCallback(({ section }) => {
    return (
      <SectionText>
        {section.section === 'Day'
          ? 'Today'
          : section.section === 'Week'
          ? 'This week'
          : 'Earlier'}
      </SectionText>
    )
  }, [])

  return (
    <NavSectionList
      sections={groups}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ListEmptyComponent={renderListEmpty}
      keyExtractor={(item, index) => index + item.id.toString()}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={{
        paddingBottom: digest ? 0 : THEME.containerPaddingWithTabBar,
      }}
      refreshControl={
        <RefreshControl
          tintColor={THEME.textColor}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      onEndReached={handleLoadMore}
    />
  )
}

export default R.compose(
  connect(
    R.applySpec({
      notifications: getNotifications,
    }),
    { setNotifications, setLastNotificationId },
  ),
)(NotificationList)
