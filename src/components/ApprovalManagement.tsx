import type { Employee } from '../types/Employee'
import type { MonthlyRequest } from '../types/Attendance'

type Props = {
    monthlyRequests: MonthlyRequest[]
    employees: Employee[]
    onApproveMonthlyRequest: (requestId: number) => void
    onRejectMonthlyRequest: (requestId: number) => void
}

export default function ApprovalManagement({
    monthlyRequests,
    employees,
    onApproveMonthlyRequest,
    onRejectMonthlyRequest,
}: Props) {
    const getEmployeeName = (employeeId: number) => {
        const employee = employees.find((employee) => employee.id === employeeId)

        return employee?.name ?? '不明な社員'
    }

    return (
        <section className="card">
            <h2>承認管理</h2>

            {monthlyRequests.length === 0 ? (
                <p className="empty-text">月次申請はまだありません。</p>
            ) : (
                <div className="approval-list">
                    {monthlyRequests.map((request) => (
                        <div key={request.id} className="approval-item">
                            <div>
                                <h3>
                                    {getEmployeeName(request.employeeId)}さん / {request.targetMonth}
                                </h3>

                                <p>状態：{request.status}</p>
                                <p>申請日時：{request.requestedAt}</p>

                                {request.approvedAt !== '' && (
                                    <p>承認日時：{request.approvedAt}</p>
                                )}

                                {request.comment !== '' && (
                                    <p>コメント：{request.comment}</p>
                                )}
                            </div>

                            {request.status === '申請済み' && (
                                <div className="approval-actions">
                                    <button
                                        type="button"
                                        className="primary-button"
                                        onClick={() => onApproveMonthlyRequest(request.id)}
                                    >
                                        承認
                                    </button>

                                    <button
                                        type="button"
                                        className="danger-button"
                                        onClick={() => onRejectMonthlyRequest(request.id)}
                                    >
                                        差戻し
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}