import type {
    AttendanceRecord,
    EditForm,
    MonthlyRequest,
    SortOrder,
} from '../types/Attendance'
import { formatMinutes, getCurrentMonth, getStatusClassName } from '../utils/attendanceUtils'

type Props = {
    filteredRecords: AttendanceRecord[]
    filterMonth: string
    sortOrder: SortOrder
    editingRecordId: number | null
    editForm: EditForm
    monthlyRequests: MonthlyRequest[]
    onFilterMonthChange: (filterMonth: string) => void
    onSortOrderChange: (sortOrder: SortOrder) => void
    onEditFormChange: (editForm: EditForm) => void
    onStartEdit: (record: AttendanceRecord) => void
    onCancelEdit: () => void
    onSaveEdit: (id: number) => void
    onDelete: (id: number) => void
    onExportCsv: () => void
}

export default function AttendanceList({
    filteredRecords,
    filterMonth,
    sortOrder,
    editingRecordId,
    editForm,
    monthlyRequests,
    onFilterMonthChange,
    onSortOrderChange,
    onEditFormChange,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
    onDelete,
    onExportCsv,
}: Props) {
    const isRecordLocked = (record: AttendanceRecord) => {
        const targetMonth = record.date.slice(0, 7)

        const targetMonthlyRequest = monthlyRequests.find(
            (request) =>
                request.employeeId === record.employeeId &&
                request.targetMonth === targetMonth,
        )

        return (
            targetMonthlyRequest?.status === '申請済み' ||
            targetMonthlyRequest?.status === '承認済み'
        )
    }
    const hasLockedRecords = filteredRecords.some((record) => isRecordLocked(record))
    return (
        <section className="card list-card attendance-list-card">
            <h2>勤怠一覧</h2>

            {hasLockedRecords && (
                <p className="lock-message">
                    申請済み、または承認済みの月の勤怠は編集・削除できません。
                </p>
            )}

            <div className="list-controls">
                <label>
                    <span>対象月</span>
                    <input
                        type="month"
                        value={filterMonth}
                        onChange={(event) => onFilterMonthChange(event.target.value)}
                    />
                </label>

                <label>
                    <span>並び順</span>
                    <select
                        value={sortOrder}
                        onChange={(event) => onSortOrderChange(event.target.value as SortOrder)}
                    >
                        <option value="newest">新しい順</option>
                        <option value="oldest">古い順</option>
                    </select>
                </label>

                <button className="clear-filter-button" onClick={() => onFilterMonthChange('')}>
                    全件表示
                </button>

                <button
                    className="clear-filter-button"
                    onClick={() => onFilterMonthChange(getCurrentMonth())}
                >
                    今月表示
                </button>

                <button className="csv-button" onClick={onExportCsv}>
                    CSV出力
                </button>
            </div>

            {filteredRecords.length === 0 ? (
                <p className="empty-message">表示できる勤怠データがありません。</p>
            ) : (
                <div className="table-scroll">
                    <table className="attendance-table">
                        <thead>
                            <tr>
                                <th>日付</th>
                                <th>出勤</th>
                                <th>休憩開始</th>
                                <th>休憩終了</th>
                                <th>退勤</th>
                                <th>休憩時間</th>
                                <th>勤務時間</th>
                                <th>状態</th>
                                <th>メモ</th>
                                <th>操作</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredRecords.map((record) => {
                                const isEditing = editingRecordId === record.id

                                return (
                                    <tr key={record.id}>
                                        <td>{record.date}</td>

                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="time"
                                                    value={editForm.clockInTime}
                                                    onChange={(event) =>
                                                        onEditFormChange({
                                                            ...editForm,
                                                            clockInTime: event.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                record.clockInTime || '-'
                                            )}
                                        </td>

                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="time"
                                                    value={editForm.breakStartTime}
                                                    onChange={(event) =>
                                                        onEditFormChange({
                                                            ...editForm,
                                                            breakStartTime: event.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                record.breakStartTime || '-'
                                            )}
                                        </td>

                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="time"
                                                    value={editForm.breakEndTime}
                                                    onChange={(event) =>
                                                        onEditFormChange({
                                                            ...editForm,
                                                            breakEndTime: event.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                record.breakEndTime || '-'
                                            )}
                                        </td>

                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="time"
                                                    value={editForm.clockOutTime}
                                                    onChange={(event) =>
                                                        onEditFormChange({
                                                            ...editForm,
                                                            clockOutTime: event.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                record.clockOutTime || '-'
                                            )}
                                        </td>

                                        <td>{formatMinutes(record.totalBreakMinutes)}</td>
                                        <td>{formatMinutes(record.totalWorkMinutes)}</td>

                                        <td>
                                            <span className={getStatusClassName(record.status)}>{record.status}</span>
                                        </td>

                                        <td>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editForm.memo}
                                                    placeholder="メモ"
                                                    onChange={(event) =>
                                                        onEditFormChange({
                                                            ...editForm,
                                                            memo: event.target.value,
                                                        })
                                                    }
                                                />
                                            ) : (
                                                record.memo || '-'
                                            )}
                                        </td>

                                        <td>
                                            {isEditing ? (
                                                <div className="table-button-area">
                                                    <button className="save-button" onClick={() => onSaveEdit(record.id)}>
                                                        保存
                                                    </button>

                                                    <button className="cancel-button" onClick={onCancelEdit}>
                                                        キャンセル
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="table-button-area">
                                                    <button
                                                        type="button"
                                                        onClick={() => onStartEdit(record)}
                                                        disabled={isRecordLocked(record)}
                                                    >
                                                        編集
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => onDelete(record.id)}
                                                        disabled={isRecordLocked(record)}
                                                    >
                                                        削除
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}