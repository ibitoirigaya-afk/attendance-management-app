import type { AttendanceStatus } from '../types/Attendance'

export const getToday = () => {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const date = String(now.getDate()).padStart(2, '0')

    return `${year}-${month}-${date}`
}

export const getCurrentMonth = () => {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')

    return `${year}-${month}`
}

export const getCurrentTime = () => {
    const now = new Date()

    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')

    return `${hour}:${minute}`
}

export const calculateMinutes = (startTime: string, endTime: string) => {
    if (startTime === '' || endTime === '') {
        return 0
    }

    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)

    const startTotalMinutes = startHour * 60 + startMinute
    const endTotalMinutes = endHour * 60 + endMinute

    const result = endTotalMinutes - startTotalMinutes

    if (result < 0) {
        return 0
    }

    return result
}

export const timeToMinutes = (time: string) => {
    if (time === '') {
        return 0
    }

    const [hour, minute] = time.split(':').map(Number)

    return hour * 60 + minute
}

export const formatMinutes = (minutes: number) => {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60

    return `${hour}時間${minute}分`
}

export const getStatusByTimes = (
    clockInTime: string,
    clockOutTime: string,
    breakStartTime: string,
    breakEndTime: string,
): AttendanceStatus => {
    if (clockInTime === '') {
        return '勤務前'
    }

    if (clockOutTime !== '') {
        return '退勤済'
    }

    if (breakStartTime !== '' && breakEndTime === '') {
        return '休憩中'
    }

    return '勤務中'
}

export const getStatusClassName = (status: AttendanceStatus) => {
    if (status === '勤務中') {
        return 'status-badge status-working'
    }

    if (status === '休憩中') {
        return 'status-badge status-breaking'
    }

    if (status === '退勤済') {
        return 'status-badge status-finished'
    }

    return 'status-badge'
}

export const validateAttendanceTimes = (
    clockInTime: string,
    clockOutTime: string,
    breakStartTime: string,
    breakEndTime: string,
) => {
    if (clockInTime === '') {
        alert('出勤時間を入力してください')
        return false
    }

    if (
        (breakStartTime !== '' && breakEndTime === '') ||
        (breakStartTime === '' && breakEndTime !== '')
    ) {
        alert('休憩開始と休憩終了は両方入力してください')
        return false
    }

    if (clockOutTime !== '' && timeToMinutes(clockOutTime) <= timeToMinutes(clockInTime)) {
        alert('退勤時間は出勤時間より後にしてください')
        return false
    }

    if (
        breakStartTime !== '' &&
        breakEndTime !== '' &&
        timeToMinutes(breakEndTime) <= timeToMinutes(breakStartTime)
    ) {
        alert('休憩終了時間は休憩開始時間より後にしてください')
        return false
    }

    if (
        breakStartTime !== '' &&
        clockOutTime !== '' &&
        timeToMinutes(breakStartTime) < timeToMinutes(clockInTime)
    ) {
        alert('休憩開始時間は出勤時間より後にしてください')
        return false
    }

    if (
        breakEndTime !== '' &&
        clockOutTime !== '' &&
        timeToMinutes(breakEndTime) > timeToMinutes(clockOutTime)
    ) {
        alert('休憩終了時間は退勤時間より前にしてください')
        return false
    }

    const totalBreakMinutes = calculateMinutes(breakStartTime, breakEndTime)
    const totalWorkMinutes = calculateMinutes(clockInTime, clockOutTime)

    if (clockOutTime !== '' && totalBreakMinutes >= totalWorkMinutes) {
        alert('休憩時間が勤務時間以上になっています')
        return false
    }

    return true
}