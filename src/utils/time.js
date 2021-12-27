export const DAY_HOURS = 24
export const HOUR_MINUTES = 60
export const MINUTE_SECONDS = 60
export const SECOND_MILLISECONDS = 1000

export const getPreviousTimestamp = (daysCount = 1) =>
  Math.ceil(
    new Date().getTime() / SECOND_MILLISECONDS -
      DAY_HOURS * daysCount * HOUR_MINUTES * MINUTE_SECONDS,
  )

export const getYesterdayTimestamp = () =>
  Math.ceil(
    new Date().getTime() / SECOND_MILLISECONDS -
      DAY_HOURS * HOUR_MINUTES * MINUTE_SECONDS,
  )

export const getAvailabilityTime = (timestamp, daysCount) =>
  timestamp - getPreviousTimestamp(daysCount)

export const secondsToHours = (seconds) =>
  Math.floor(seconds / MINUTE_SECONDS / HOUR_MINUTES)

export const secondsToMinutes = (seconds) =>
  Math.floor(seconds / MINUTE_SECONDS)
