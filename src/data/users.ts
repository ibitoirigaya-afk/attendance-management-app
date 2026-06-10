import type { LoginUser } from '../types/User'

export const mockUsers: LoginUser[] = [
    {
        id: 1,
        name: '管理者',
        email: 'admin@example.com',
        password: 'password',
        role: 'admin',
    },
    {
        id: 2,
        name: '山田太郎',
        email: 'yamada@example.com',
        password: 'password',
        role: 'employee',
        employeeId: 1,
    },
    {
        id: 3,
        name: '佐藤花子',
        email: 'sato@example.com',
        password: 'password',
        role: 'employee',
        employeeId: 2,
    },
]