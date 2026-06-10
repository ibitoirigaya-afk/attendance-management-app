export type PaidLeaveRequestStatus = '申請中' | '承認済み' | '却下'

export type PaidLeaveRequest = {
    id: number
    employeeId: number
    targetDate: string
    status: PaidLeaveRequestStatus
    requestedAt: string
    approvedAt: string
}