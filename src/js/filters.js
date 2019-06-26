import dayjs from 'dayjs'

export default {
  dateFormat(date, type) {
    return dayjs(date).format(type || 'YYYY-MM-DD HH:mm:ss')
  },
  moneyFormat(num) {
    return (num / 100).toFixed(2)
  }
}
