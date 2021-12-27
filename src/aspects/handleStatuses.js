import * as R from 'ramda'

const logError = (response) =>
  console.log(`URL: ${response.url} with status ${response.status}`) || response

const parseError = (response, message) =>
  logError(response)
    .json()
    .then((res) =>
      Promise.reject(
        res.errors || res.message
          ? new Error(
              res.errors
                ? res.errors[Object.keys(res.errors)[0]][0]
                : res.message,
            )
          : new Error(message),
      ),
    )

const handleStatuses = R.cond([
  [R.propEq('status', 401), (x) => parseError(x, 'Wrong login or password')],
  [R.propEq('status', 403), (x) => parseError(x, 'Incorrect data')],
  [R.propEq('status', 404), (x) => parseError(x, 'Not found response')],
  [
    R.propEq('status', 500),
    R.pipe(logError, () => Promise.reject(new Error('Server error'))),
  ],
  [R.propEq('ok', false), (x) => parseError(x, 'Unhandled error')],
  [R.propEq('status', 200), R.identity],
  [R.propEq('status', 201), R.identity],
])

export default handleStatuses
