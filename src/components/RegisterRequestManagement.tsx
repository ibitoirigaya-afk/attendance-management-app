import type { RegisterRequest } from '../types/RegisterRequest'

type Props = {
    registerRequests: RegisterRequest[]
    onApproveRegisterRequest: (requestId: number) => void
    onRejectRegisterRequest: (requestId: number) => void
}

export default function RegisterRequestManagement({
    registerRequests,
    onApproveRegisterRequest,
    onRejectRegisterRequest,
}: Props) {
    const sortedRequests = [...registerRequests].sort((a, b) => {
        if (a.status === '申請中' && b.status !== '申請中') {
            return -1
        }

        if (a.status !== '申請中' && b.status === '申請中') {
            return 1
        }

        return b.requestedAt.localeCompare(a.requestedAt)
    })

    return (
        <section className="card">
            <h2>登録申請管理</h2>

            {sortedRequests.length === 0 ? (
                <p className="empty-text">登録申請はありません。</p>
            ) : (
                <table className="attendance-table">
                    <thead>
                        <tr>
                            <th>名前</th>
                            <th>部署</th>
                            <th>メール</th>
                            <th>状態</th>
                            <th>申請日時</th>
                            <th>操作</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sortedRequests.map((request) => (
                            <tr key={request.id}>
                                <td>{request.name}</td>
                                <td>{request.department}</td>
                                <td>{request.email}</td>
                                <td>{request.status}</td>
                                <td>{request.requestedAt}</td>
                                <td>
                                    {request.status === '申請中' ? (
                                        <div className="table-actions">
                                            <button
                                                type="button"
                                                onClick={() => onApproveRegisterRequest(request.id)}
                                            >
                                                承認
                                            </button>

                                            <button
                                                type="button"
                                                className="danger-button"
                                                onClick={() => onRejectRegisterRequest(request.id)}
                                            >
                                                却下
                                            </button>
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    )
}