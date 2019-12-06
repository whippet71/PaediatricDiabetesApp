export const dateService = {
  formatDate
}

function formatDate(date) {
  return date ? new Intl.DateTimeFormat('en-GB').format(Date.parse(date)) : ''
}
