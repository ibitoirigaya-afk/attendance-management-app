export type UserRole = 'admin' | 'employee'

export type LoginUser = {
    id: number
    name: string
    email: string
    password: string
    role: UserRole
    employeeId?: number
}