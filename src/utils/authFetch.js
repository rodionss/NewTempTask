export const authPost = (token, body, method) =>
  body
    ? {
        method: method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    : {
        method: method || 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }

export const authGet = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
})

export const authDelete = (token) => ({
  method: 'DELETE',
  headers: { Authorization: `Bearer ${token}` },
})
