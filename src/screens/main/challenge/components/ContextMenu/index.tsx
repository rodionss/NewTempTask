/* eslint-disable no-nested-ternary */
/* eslint-disable no-sparse-arrays */
import React, { useState, useMemo } from 'react'
import Share from 'react-native-share'
import { useDispatch, useSelector } from 'react-redux'
import Clipboard from '@react-native-community/clipboard'

import { addWatermark } from '@utils'
import { getShareVideoOptions } from '@utils/VideoConverter'

import { setGlobalLoading } from '../../../../../modules/main/duck'
import { ContextMenuModal, ReportModal } from '../../../../../components'
import {
  CopyIcon,
  FlagIcon,
  InviteIcon,
  ReportFlagIcon,
  ShareIcon,
  TrashIcon,
} from '../../../../../components/icons'
import { upperButtonStyle, centerButtonStyle, lowerButtonStyle } from './atoms'
import FeedInviteModal from '../../../feed/components/FeedInviteModal'
import { getToken } from '../../../../../modules/auth'
import {
  deleteChallenge,
  removeMeFromChallenge,
  hideChallenge,
} from '../../../../../modules/main/managers'
import { handleErrors } from '../../../../../aspects'
import { DropdownService } from '../../../../../services'
import { THEME } from '../../../../../const'

type Props = {
  myId: number
  game: any
  gameCompletion: any
  onPressJoin: any
  onPressDeleteGame: any
  onPressDeleteCompletion: any
  showMenu: any
  setShowMenu: any
  showInviteModal: boolean
  setShowInviteModal: any
}

function ContextMenu({
  myId,
  game,
  gameCompletion,
  onPressJoin,
  onPressDeleteGame,
  onPressDeleteCompletion,
  showMenu,
  setShowMenu,
  showInviteModal,
  setShowInviteModal,
}: Props) {
  const dispatch = useDispatch()
  const token = useSelector(getToken)

  const [modalQueue, setModalQueue] = useState(null)
  const [showReport, setShowReport] = useState(false)

  const isCompleted = useMemo(
    () => game && game.user_stats && game.user_stats.completed_at,
    [game],
  )

  const buttons = useMemo(
    () =>
      game
        ? [
            game.user_stats.completed_at
              ? null
              : {
                  title: game.user_stats.joined_at
                    ? 'Remove from Playlist'
                    : 'Add to Playlist',
                  icon: <FlagIcon filled={game.user_stats.joined_at} />,
                  onPress: () => {
                    setModalQueue(() => () => {
                      onPressJoin(game, gameCompletion)
                    })
                    setShowMenu(false)
                  },
                },
            {
              title: 'Share',
              icon: <ShareIcon />,
              style: upperButtonStyle,
              onPress: () => {
                setShowMenu(false)
                dispatch(setGlobalLoading(true))
                addWatermark(gameCompletion, game, (uri) => {
                  getShareVideoOptions(
                    uri,
                    true,
                    game.title.toUpperCase(),
                    game.access_url,
                  )
                    .then(Share.open)
                    .finally(() => {
                      dispatch(setGlobalLoading(false))
                    })
                })
              },
            },
            {
              title: 'Invite to game',
              icon: <InviteIcon />,
              style: centerButtonStyle,
              onPress: () => {
                setModalQueue(() => () => {
                  setShowInviteModal(true)
                })
                setShowMenu(false)
              },
            },
            {
              title: 'Copy Link',
              icon: <CopyIcon />,
              style: lowerButtonStyle,
              onPress: () => {
                Clipboard.setString(game.access_url)
                DropdownService.alert('success', 'The link was copied')
                setShowMenu(false)
              },
            },
            isCompleted
              ? {
                  title: 'Delete from archive',
                  icon: <TrashIcon />,
                  style: upperButtonStyle,
                  styleText: { color: THEME.dangerColor },
                  onPress: () => {
                    hideChallenge(token, game.id)
                      .then(() => {
                        onPressDeleteGame()
                        DropdownService.alert(
                          'success',
                          'Game was removed from your archive',
                        )
                      })
                      .catch(handleErrors)

                    setShowMenu(false)
                  },
                }
              : null,
            myId === game.user.id
              ? {
                  title: 'Delete game',
                  icon: <TrashIcon />,
                  style: upperButtonStyle,
                  styleText: { color: THEME.dangerColor },
                  onPress: () => {
                    setShowMenu(false)
                    deleteChallenge(token, game.id)
                      .then(() => {
                        onPressDeleteGame()
                        DropdownService.alert('success', 'Game was removed')
                      })
                      .catch(handleErrors)
                  },
                }
              : game.user_stats.completed_at
              ? {
                  title: 'Delete my completion',
                  icon: <TrashIcon />,
                  style: upperButtonStyle,
                  styleText: { color: THEME.dangerColor },
                  onPress: () => {
                    setShowMenu(false)
                    removeMeFromChallenge(token, game.id)
                      .then(() => {
                        onPressDeleteCompletion()
                        DropdownService.alert(
                          'success',
                          'Your game completion was removed',
                        )
                      })
                      .catch(handleErrors)
                  },
                }
              : null,
            ,
            {
              title: 'Report',
              icon: <ReportFlagIcon />,
              style:
                myId === game.user.id || game.user_stats.completed_at
                  ? lowerButtonStyle
                  : {},
              styleText: { color: THEME.dangerColor },
              onPress: () => {
                setModalQueue(() => () => {
                  setShowReport(true)
                })
                setShowMenu(false)
              },
            },
          ]
        : [],
    [game],
  )

  return (
    <>
      <ContextMenuModal
        isVisible={showMenu}
        buttons={buttons}
        onPressClose={() => {
          setShowMenu(false)
        }}
        onModalHide={() => {
          if (modalQueue) {
            modalQueue()
            setModalQueue(null)
          }
        }}
      />

      <ReportModal
        game={game}
        isVisible={showReport}
        onPressClose={() => setShowReport(false)}
        onPressSend={() => {
          setShowReport(false)
        }}
      />

      <FeedInviteModal
        isVisible={showInviteModal}
        challenge={game}
        onPressClose={() => setShowInviteModal(false)}
      />
    </>
  )
}

export default ContextMenu
