import type { Employee } from '../types/Employee'
import type { PaidLeaveRequest } from '../types/PaidLeave'

type Props = {
    paidLeaveRequests: PaidLeaveRequest[]
    employees: Employee[]
    onApprovePaidLeaveRequest: (requestId: number) => void
    onRejectPaidLeaveRequest: (requestId: number) => void
}

export default function PaidLeaveApprovalManagement({
    paidLeaveRequests,
    employees,
    onApprovePaidLeaveRequest,
    onRejectPaidLeaveRequest,
}: Props) {
    const sortedRequests = [...paidLeaveRequests].sort((a, b) => {
        if (a.status === '申請中' && b.status !== '申請中') {
            return -1
        }

        if (a.status !== '申請中' && b.status === '申請中') {
            return 1
        }

        return b.targetDate.localeCompare(a.targetDate)
    })

    const getEmployee = (employeeId: number) => {
        return employees.find((employee) => employee.id === employeeId)
    }

    return (
        <section className="card">
            <h2>有給承認管理</h2>

            {sortedRequests.length === 0 ? (
                <p className="empty-text">有給申請はありません。</p>
            ) : (
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>社員名</th>
                            <th>部署</th>
                            <th>取得日</th>
                            <th>有給残日数</th>
                            <th>状態</th>
                            <th>申請日時</th>
                            <th>承認日時</th>
                            <th>操作</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedRequests.map((request) => {
                            const employee = getEmployee(request.employeeId)

                            return (
                                <tr key={request.id}>
                                    <td>{employee?.name ?? '不明な社員'}</td>
                                    <td>{employee?.department ?? '-'}</td>
                                    <td>{request.targetDate}</td>
                                    <td>{employee?.paidLeaveDays ?? 0}日</td>
                                    <td>{request.status}</td>
                                    <td>{request.requestedAt}</td>
                                    <td>{request.approvedAt || '-'}</td>
                                    <td>
                                        {request.status === '申請中' ? (
                                            <div className="table-actions">
                                                <button
                                                    type="button"
                                                    className="approve-button"
                                                    onClick={() => onApprovePaidLeaveRequest(request.id)}
                                                >
                                                    承認
                                                </button>

                                                <button
                                                    type="button"
                                                    className="reject-button"
                                                    onClick={() => onRejectPaidLeaveRequest(request.id)}
                                                >
                                                    却下
                                                </button>
                                            </div>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )}
        </section>
    )
}