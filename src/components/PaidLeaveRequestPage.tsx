import { useState } from 'react'
import type { Employee } from '../types/Employee'
import type { PaidLeaveRequest } from '../types/PaidLeave'

type Props = {
    employee: Employee
    paidLeaveRequests: PaidLeaveRequest[]
    onSubmitPaidLeaveRequest: (targetDate: string) => void
}

const getStatusClassName = (status: PaidLeaveRequest['status']) => {
    if (status === '申請中') {
        return 'paid-leave-status pending'
    }

    if (status === '承認済み') {
        return 'paid-leave-status approved'
    }

    return 'paid-leave-status rejected'
}

export default function PaidLeaveRequestPage({
    employee,
    paidLeaveRequests,
    onSubmitPaidLeaveRequest,
}: Props) {
    const [targetDate, setTargetDate] = useState('')

    const sortedRequests = [...paidLeaveRequests].sort((a, b) =>
        b.targetDate.localeCompare(a.targetDate),
    )

    const pendingCount = paidLeaveRequests.filter(
        (request) => request.status === '申請中',
    ).length

    const approvedCount = paidLeaveRequests.filter(
        (request) => request.status === '承認済み',
    ).length

    const handleSubmit = () => {
        onSubmitPaidLeaveRequest(targetDate)
        setTargetDate('')
    }

    return (
        <section className="paid-leave-page">
            <div className="paid-leave-header-card">
                <div>
                    <p className="section-label">PAID LEAVE</p>
                    <h2>有給申請</h2>
                    <p>{employee.name}さんの有給残日数と申請状況を確認できます。</p>
                </div>

                <div className="paid-leave-balance-box">
                    <span>有給残日数</span>
                    <strong>{employee.paidLeaveDays ?? 0}</strong>
                    <small>日</small>
                </div>
            </div>

            <div className="paid-leave-stat-grid">
                <div className="paid-leave-stat-card">
                    <span>申請中</span>
                    <strong>{pendingCount}件</strong>
                </div>

                <div className="paid-leave-stat-card">
                    <span>承認済み</span>
                    <strong>{approvedCount}件</strong>
                </div>

                <div className="paid-leave-stat-card">
                    <span>残日数</span>
                    <strong>{employee.paidLeaveDays ?? 0}日</strong>
                </div>
            </div>

            <div className="card paid-leave-form-card">
                <h3>有給を申請する</h3>

                <div className="paid-leave-form-row">
                    <label>
                        有給取得日
                        <input
                            type="date"
                            value={targetDate}
                            onChange={(event) => setTargetDate(event.target.value)}
                        />
                    </label>

                    <button
                        type="button"
                        className="paid-leave-submit-button"
                        onClick={handleSubmit}
                        disabled={employee.paidLeaveDays <= 0}
                    >
                        有給申請する
                    </button>
                </div>

                {employee.paidLeaveDays <= 0 && (
                    <p className="empty-text">有給残日数がないため申請できません。</p>
                )}
            </div>

            <div className="card">
                <h3>申請履歴</h3>

                {sortedRequests.length === 0 ? (
                    <p className="empty-text">有給申請履歴はありません。</p>
                ) : (
                    <div className="table-scroll">
                        <table className="attendance-table paid-leave-table">
                            <thead>
                                <tr>
                                    <th>取得日</th>
                                    <th>状態</th>
                                    <th>申請日時</th>
                                    <th>承認日時</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sortedRequests.map((request) => (
                                    <tr key={request.id}>
                                        <td>{request.targetDate}</td>
                                        <td>
                                            <span className={getStatusClassName(request.status)}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>{request.requestedAt}</td>
                                        <td>{request.approvedAt || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    )
}