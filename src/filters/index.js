import dayjs from 'dayjs'

export const formatTime = (value, str = 'YYYY年MM月DD日') => {
  return dayjs(value).format(str)
}

