export type AttendanceStatus = '勤務前' | '勤務中' | '休憩中' | '退勤済'

export type AttendanceRecord = {
    id: number
    employeeId: number
    date: string
    clockInTime: string
    clockOutTime: string
    breakStartTime: string
    breakEndTime: string
    totalWorkMinutes: number
    totalBreakMinutes: number
    status: AttendanceStatus
    memo: string
}

export type EditForm = {
    clockInTime: string
    clockOutTime: string
    breakStartTime: string
    breakEndTime: string
    memo: string
}

export type NewRecordForm = {
    date: string
    clockInTime: string
    clockOutTime: string
    breakStartTime: string
    breakEndTime: string
    memo: string
}

export type SortOrder = 'newest' | 'oldest'

export type ActivePage =
    | 'clock'
    | 'summary'
    | 'add'
    | 'list'
    | 'employee'
    | 'approval'
    | 'registerApproval'
    | 'paidLeave'
    | 'paidLeaveApproval'

export type MonthlyRequestStatus =
    | '未申請'
    | '申請済み'
    | '承認済み'
    | '差戻し'

export type MonthlyRequest = {
    id: number
    employeeId: number
    targetMonth: string
    status: MonthlyRequestStatus
    requestedAt: string
    approvedAt: string
    comment: string
}