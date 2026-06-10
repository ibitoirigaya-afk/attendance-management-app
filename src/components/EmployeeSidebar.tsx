import type { AttendanceRecord, AttendanceStatus } from '../types/Attendance'
import type { Employee } from '../types/Employee'
import { getStatusClassName } from '../utils/attendanceUtils'

type Props = {
    employees: Employee[]
    departments: string[]
    departmentFilter: string
    attendanceRecords: AttendanceRecord[]
    today: string
    selectedEmployeeId: number
    onDepartmentFilterChange: (department: string) => void
    onSelectEmployee: (employeeId: number) => void
}

const getTodayStatus = (
    employeeId: number,
    attendanceRecords: AttendanceRecord[],
    today: string,
): AttendanceStatus | '未出勤' => {
    const todayRecord = attendanceRecords.find(
        (record) => record.employeeId === employeeId && record.date === today,
    )

    if (todayRecord === undefined) {
        return '未出勤'
    }

    return todayRecord.status
}

export default function EmployeeSidebar({
    employees,
    departments,
    departmentFilter,
    attendanceRecords,
    today,
    selectedEmployeeId,
    onDepartmentFilterChange,
    onSelectEmployee,
}: Props) {
    return (
        <aside className="employee-sidebar">
            <h2>社員一覧</h2>

            <div className="department-filter">
                <span className="department-filter-label">部署で絞り込み</span>

                <select
                    className="department-filter-select"
                    value={departmentFilter}
                    onChange={(event) => onDepartmentFilterChange(event.target.value)}
                >
                    <option value="">すべての部署</option>

                    {departments.map((department) => (
                        <option key={department} value={department}>
                            {department}
                        </option>
                    ))}
                </select>
            </div>

            <div className="employee-list">
                {employees.map((employee) => {
                    const isSelected = selectedEmployeeId === employee.id
                    const todayStatus = getTodayStatus(employee.id, attendanceRecords, today)

                    return (
                        <button
                            key={employee.id}
                            className={isSelected ? 'employee-button selected' : 'employee-button'}
                            onClick={() => onSelectEmployee(employee.id)}
                        >
                            <strong>{employee.name}</strong>
                            <span>{employee.department}</span>

                            <span
                                className={
                                    todayStatus === '未出勤'
                                        ? 'employee-status not-clocked-in'
                                        : getStatusClassName(todayStatus)
                                }
                            >
                                {todayStatus}
                            </span>
                        </button>
                    )
                })}
            </div>
        </aside>
    )
}