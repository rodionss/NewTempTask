import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import { Challenge } from '@app-types/challenge'
import { ModalContainer } from '@components/main'
import { SwipeIndicator } from '@components/ContextMenuModal'
import { RemindType, setReminder } from './domain'
import DefaultPicker from './DefaultPicker'
import ExactPicker from './ExactPicker'
import Tooltip from './Tooltip'
import { CancelButton, CancelText, Header, ModalContent } from './atoms'

type Props = {
  isVisible: boolean
  challenge: Challenge
  onPressClose: () => void
}

enum View {
  Default = 'default',
  Exact = 'exact',
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function ReminderModal({ isVisible, challenge, onPressClose }: Props) {
  const timerRef = useRef<number | null>(null)
  const [view, setView] = useState(View.Default)
  const [modalOpen, setModalOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [text, setText] = useState('Added to Play')

  const onExactPress = () => setView(View.Exact)

  const headerText = useMemo(() => {
    return view === View.Default ? 'Remind' : 'Set exact time'
  }, [view])

  const closeTooltip = () => {
    sleep(1000).then(() => {
      onPressClose()
      setSaved(false)
      setText('Added to Play')
    })
  }

  const handleClose = useCallback(() => {
    setSaved(true)
    setModalOpen(false)
    closeTooltip()
  }, [closeTooltip])

  const onTimeButtonPress = useCallback(
    (remindType: RemindType, remindTime: Date = null) => {
      setReminder(challenge, remindType, remindTime)
      setView(View.Default)
      handleClose()
    },
    [handleClose],
  )

  const setDefaultReminder = useCallback(() => {
    setText(`Reminder set in 3 hours`)
    onTimeButtonPress(RemindType.ThreeHours)
    handleClose()
  }, [handleClose])

  useEffect(() => {
    if (isVisible) {
      timerRef.current = setTimeout(() => setDefaultReminder(), 1500)
    }
  }, [isVisible])

  const showDefaultPicker = view === View.Default
  const showExactPicker = view === View.Exact

  return (
    <>
      {isVisible && (
        <Tooltip
          text={text}
          buttonText='Remind'
          saved={saved}
          onButtonPress={() => {
            if (timerRef.current) {
              clearTimeout(timerRef.current)
            }
            setModalOpen(true)
          }}
        />
      )}

      <ModalContainer
        isVisible={modalOpen}
        onBackdropPress={setDefaultReminder}
        onSwipeComplete={setDefaultReminder}
        onModalHide={() => {
          setSaved(true)
          setModalOpen(false)
        }}
        swipeDirection='down'
        onSwipeTreshold={400}
      >
        <ModalContent>
          <SwipeIndicator />
          <Header>{headerText}</Header>
          {showDefaultPicker && (
            <DefaultPicker
              onTimeButtonPress={onTimeButtonPress}
              onExactPress={onExactPress}
              setText={setText}
            />
          )}
          {showExactPicker && (
            <ExactPicker
              onTimeButtonPress={onTimeButtonPress}
              setText={setText}
            />
          )}
          <CancelButton onPress={setDefaultReminder}>
            <CancelText>Cancel</CancelText>
          </CancelButton>
        </ModalContent>
      </ModalContainer>
    </>
  )
}

export default ReminderModal
