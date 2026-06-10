export type RegisterRequestStatus = '申請中' | '承認済み' | '却下'

export type RegisterRequest = {
    id: number
    name: string
    department: string
    email: string
    password: string
    status: RegisterRequestStatus
    requestedAt: string
}