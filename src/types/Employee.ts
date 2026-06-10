export type Employee = {
    id: number
    name: string
    department: string
    paidLeaveDays: number
    isDeleted?: boolean
}

export type EmployeeForm = {
    name: string
    department: string
}

export type EmployeeEditForm = {
    name: string
    department: string
}