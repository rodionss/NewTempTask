import React from 'react'
import { Dimensions, PanResponder, Animated } from 'react-native'

import {
  Container,
  BlurContainer,
  ScrubberContainer,
  ScrubberHead,
  ScrubberTail,
  LeftHandle,
  RightHandle,
  SelectionContainer,
  HANDLE_WIDTH,
  TRACK_PADDING_OFFSET,
} from './atoms'

import * as Arrow from './Arrow'

const { width: screenWidth } = Dimensions.get('window')

const MINIMUM_TRIM_DURATION = 100
const trackWidth = screenWidth - 80

export default class Trimmer extends React.Component {
  constructor(props) {
    super(props)

    this.initiateAnimator()
    const { totalDuration, maxTrimDuration } = this.props
    this.state = {
      scrubbing: false, // this value means scrubbing is currently happening
      trimming: false, // this value means the handles are being moved
      trimmingLeftHandleValue: 0,
      trimmingRightHandleValue: 0,
      internalScrubbingPosition: 0,
      maxTrimDuration: Math.min(totalDuration, maxTrimDuration)
    }
  }

  clamp = ({ value, min, max }) => Math.min(Math.max(value, min), max)

  initiateAnimator = () => {
    this.scaleTrackValue = new Animated.Value(0)
    this.lastDy = 0
    this.leftHandlePanResponder = this.createLeftHandlePanResponder()
    this.rightHandlePanResponder = this.createRightHandlePanResponder()
    this.scrubHandlePanResponder = this.createScrubHandlePanResponder()
  }

  createScrubHandlePanResponder = () =>
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.setState({
          scrubbing: true,
          internalScrubbingPosition: this.props.scrubberPosition,
        })
        this.handleScrubberPressIn()
      },
      onPanResponderMove: (evt, gestureState) => {
        const {
          scrubberPosition,
          trimmerLeftHandlePosition,
          trimmerRightHandlePosition,
          totalDuration,
        } = this.props

        const calculatedScrubberPosition =
          (scrubberPosition / totalDuration) * trackWidth

        const newScrubberPosition =
          ((calculatedScrubberPosition + gestureState.dx) / trackWidth) *
          totalDuration

        const lowerBound = Math.max(0, trimmerLeftHandlePosition)
        const upperBound = trimmerRightHandlePosition

        const newBoundedScrubberPosition = this.clamp({
          value: newScrubberPosition,
          min: lowerBound,
          max: upperBound,
        })

        this.setState({ internalScrubbingPosition: newBoundedScrubberPosition })
        this.handleScrubbingValueChange(newBoundedScrubberPosition)
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.handleScrubbingValueChange(this.state.internalScrubbingPosition, true)
        this.setState({ scrubbing: false })
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    })

  createRightHandlePanResponder = () =>
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.setState({
          trimming: true,
          trimmingRightHandleValue: this.props.trimmerRightHandlePosition,
          trimmingLeftHandleValue: this.props.trimmerLeftHandlePosition,
        })
        this.handleRightHandlePressIn()
      },
      onPanResponderMove: (evt, gestureState) => {
        const {
          trimmerRightHandlePosition,
          totalDuration,
          minimumTrimDuration = MINIMUM_TRIM_DURATION,
        } = this.props

        const calculatedTrimmerRightHandlePosition =
          (trimmerRightHandlePosition / totalDuration) * trackWidth

        const newTrimmerRightHandlePosition =
          ((calculatedTrimmerRightHandlePosition + gestureState.dx) /
            trackWidth) *
          totalDuration

        const lowerBound = minimumTrimDuration
        const upperBound = totalDuration

        const newBoundedTrimmerRightHandlePosition = this.clamp({
          value: newTrimmerRightHandlePosition,
          min: lowerBound,
          max: upperBound,
        })

        if (
          newBoundedTrimmerRightHandlePosition -
            this.state.trimmingLeftHandleValue >=
          this.state.maxTrimDuration
        ) {
          this.setState({
            trimmingRightHandleValue: newBoundedTrimmerRightHandlePosition,
            trimmingLeftHandleValue:
              newBoundedTrimmerRightHandlePosition - this.state.maxTrimDuration,
          })
        } else if (
          newBoundedTrimmerRightHandlePosition -
            this.state.trimmingLeftHandleValue <=
          minimumTrimDuration
        ) {
          this.setState({
            trimmingRightHandleValue: newBoundedTrimmerRightHandlePosition,
            trimmingLeftHandleValue:
              newBoundedTrimmerRightHandlePosition - minimumTrimDuration,
          })
        } else {
          this.setState({
            trimmingRightHandleValue: newBoundedTrimmerRightHandlePosition,
          })
        }

        this.handleHandleSizeChange('right')
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.handleHandleSizeChange('release')
        this.setState({ trimming: false })
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    })

  createLeftHandlePanResponder = () =>
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {
        this.setState({
          trimming: true,
          trimmingRightHandleValue: this.props.trimmerRightHandlePosition,
          trimmingLeftHandleValue: this.props.trimmerLeftHandlePosition,
        })
        this.handleLeftHandlePressIn()
      },
      onPanResponderMove: (evt, gestureState) => {
        const {
          trimmerLeftHandlePosition,
          trimmerRightHandlePosition,
          totalDuration,
          minimumTrimDuration = MINIMUM_TRIM_DURATION,
        } = this.props

        const calculatedTrimmerLeftHandlePosition =
          (trimmerLeftHandlePosition / totalDuration) * trackWidth

        const newTrimmerLeftHandlePosition =
          ((calculatedTrimmerLeftHandlePosition + gestureState.dx) /
            trackWidth) *
          totalDuration

        const lowerBound = 0
        const upperBound = totalDuration - minimumTrimDuration

        const newBoundedTrimmerLeftHandlePosition = this.clamp({
          value: newTrimmerLeftHandlePosition,
          min: lowerBound,
          max: upperBound,
        })

        if (
          this.state.trimmingRightHandleValue -
            newBoundedTrimmerLeftHandlePosition >=
          this.state.maxTrimDuration
        ) {
          this.setState({
            trimmingRightHandleValue:
              newBoundedTrimmerLeftHandlePosition + this.state.maxTrimDuration,
            trimmingLeftHandleValue: newBoundedTrimmerLeftHandlePosition,
          })
        } else if (
          this.state.trimmingRightHandleValue -
            newBoundedTrimmerLeftHandlePosition <=
          minimumTrimDuration
        ) {
          this.setState({
            trimmingRightHandleValue: newBoundedTrimmerLeftHandlePosition,
            trimmingLeftHandleValue:
              newBoundedTrimmerLeftHandlePosition - minimumTrimDuration,
          })
        } else {
          this.setState({
            trimmingLeftHandleValue: newBoundedTrimmerLeftHandlePosition,
          })
        }

        this.handleHandleSizeChange('left')
      },
      onPanResponderRelease: (evt, gestureState) => {
        this.handleHandleSizeChange('release')
        this.setState({ trimming: false })
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    })

  handleScrubbingValueChange = (newScrubPosition, isComplete = false) => {
    const { onScrubbing } = this.props
    onScrubbing && onScrubbing(newScrubPosition | 0, isComplete)
  }

  handleHandleSizeChange = (handle) => {
    const { onHandleChange } = this.props
    const { trimmingLeftHandleValue, trimmingRightHandleValue } = this.state
    let payload = null

    if (handle == 'left') {
      payload = { leftPosition: trimmingLeftHandleValue | 0 }
    } else if (handle == 'right') {
      payload = { rightPosition: trimmingRightHandleValue | 0 }
    } else {
      payload = {
        leftPosition: trimmingLeftHandleValue | 0,
        rightPosition: trimmingRightHandleValue | 0,
      }
    }

    onHandleChange && onHandleChange(payload)
  }

  handleLeftHandlePressIn = () => {
    const { onLeftHandlePressIn } = this.props
    onLeftHandlePressIn && onLeftHandlePressIn()
  }

  handleRightHandlePressIn = () => {
    const { onRightHandlePressIn } = this.props
    onRightHandlePressIn && onRightHandlePressIn()
  }

  handleScrubberPressIn = () => {
    const { onScrubberPressIn } = this.props
    onScrubberPressIn && onScrubberPressIn()
  }

  render() {
    const {
      minimumTrimDuration,
      totalDuration,
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
      scrubberPosition,
    } = this.props

    if (
      minimumTrimDuration >
      trimmerRightHandlePosition - trimmerLeftHandlePosition
    ) {
      console.error(
        'minimumTrimDuration is less than trimRightHandlePosition minus trimmerLeftHandlePosition',
        {
          minimumTrimDuration,
          trimmerRightHandlePosition,
          trimmerLeftHandlePosition,
        },
      )
      return null
    }

    const {
      trimming,
      scrubbing,
      internalScrubbingPosition,
      trimmingLeftHandleValue,
      trimmingRightHandleValue,
    } = this.state

    const leftPosition = trimming
      ? trimmingLeftHandleValue
      : trimmerLeftHandlePosition
    const rightPosition = trimming
      ? trimmingRightHandleValue
      : trimmerRightHandlePosition
    const scrubPosition = scrubbing
      ? internalScrubbingPosition
      : scrubberPosition

    const boundedLeftPosition = Math.max(leftPosition, 0)
    const boundedScrubPosition = this.clamp({
      value: scrubPosition,
      min: boundedLeftPosition,
      max: rightPosition,
    })

    const boundedTrimTime = Math.max(rightPosition - boundedLeftPosition, 0)

    const actualTrimmerWidth = (boundedTrimTime / totalDuration) * trackWidth

    const actualTrimmerOffset =
      (boundedLeftPosition / totalDuration) * trackWidth +
      TRACK_PADDING_OFFSET +
      HANDLE_WIDTH

    const actualScrubPosition =
      (boundedScrubPosition / totalDuration) * trackWidth +
      TRACK_PADDING_OFFSET +
      HANDLE_WIDTH

    if (isNaN(actualTrimmerWidth)) {
      console.log(
        'ERROR render() actualTrimmerWidth !== number. boundedTrimTime',
        boundedTrimTime,
        ', totalDuration',
        totalDuration,
        ', trackWidth',
        trackWidth,
      )
    }

    return (
      <Container>
        <BlurContainer />
        {typeof scrubberPosition === 'number' ? (
          <ScrubberContainer
            style={{ left: actualScrubPosition }}
            {...this.scrubHandlePanResponder.panHandlers}
          >
            <ScrubberTail />
            <ScrubberHead />
          </ScrubberContainer>
        ) : null}
        <LeftHandle
          {...this.leftHandlePanResponder.panHandlers}
          style={{ left: actualTrimmerOffset - HANDLE_WIDTH }}
        >
          <Arrow.Left />
        </LeftHandle>
        <SelectionContainer
          style={{
            width: actualTrimmerWidth,
            left: actualTrimmerOffset,
          }}
        />
        <RightHandle
          {...this.rightHandlePanResponder.panHandlers}
          style={{ left: actualTrimmerOffset + actualTrimmerWidth }}
        >
          <Arrow.Right />
        </RightHandle>
      </Container>
    )
  }
}
