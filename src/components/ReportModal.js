import React, { useState } from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components'
import API from '../API'
import { PrimaryButton } from './buttons'
import FieldSelectInput from './FieldSelectInput'
import { Link, ModalContainer, Text } from './main'
import { useDispatch } from 'react-redux'
import { complaintChallenge } from '../modules/main/duck'

const ModalContent = styled.View`
  width: ${Dimensions.get('window').width}px;
  margin-top: auto;
  padding: 32px 0;
  align-items: center;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  background-color: #060606;
  z-index: 99999;
`

const ButtonsContainer = styled.View`
  width: 100%;
  padding: 0 20px;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
`

const Title = styled(Text)`
  font-size: 18px;
`

const CloseButton = styled(Link)``

const CloseText = styled(Text)`
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  opacity: 0.7;
`

const ReportModal = ({
  game,
  isVisible,
  onPressClose,
  onPressSend,
}) => {
  const [reportType, setReportType] = useState(API.COMPLAINT.complaints.SPAM)
  const dispatch = useDispatch()

  return (
    <ModalContainer isVisible={!!isVisible}>
      <ModalContent>
        <Title>{'Why do you want to send a complaint?'}</Title>
        <FieldSelectInput
          input={{ onChange: setReportType, value: reportType }}
          values={[
            { label: 'Spam', value: API.COMPLAINT.complaints.SPAM },
            { label: 'Violence', value: API.COMPLAINT.complaints.VIOLENCE },
            { label: 'Suicide', value: API.COMPLAINT.complaints.SUICIDE },
            {
              label: 'False Information',
              value: API.COMPLAINT.complaints.FALSE_INFORMATION,
            },
            { label: 'Other', value: API.COMPLAINT.complaints.OTHER },
          ]}
        />
        <ButtonsContainer>
          <CloseButton onPress={onPressClose}>
            <CloseText>{'CANCEL'}</CloseText>
          </CloseButton>
          <PrimaryButton
            size={'small'}
            onPress={() => {
              const reportPayload = {
                object_type: 'challenge',
                object_id: game.id,
                complaint: reportType,
              }
              dispatch(complaintChallenge(reportPayload))
              onPressSend()
            }}
            text={`REPORT`}
          />
        </ButtonsContainer>
      </ModalContent>
    </ModalContainer>
  )
}

export default ReportModal
