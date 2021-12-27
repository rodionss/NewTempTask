import React from 'react'
import { useSelector } from 'react-redux'
import { getHasNotifications } from '../modules/main'
import { ActivityTabIcon } from './icons'

type Props = {
  active: boolean
}

const NotificationsIcon = ({ active }: Props) => {
  const isHas = useSelector(getHasNotifications)
  return <ActivityTabIcon active={active} isHas={isHas} />
}

export default NotificationsIcon
