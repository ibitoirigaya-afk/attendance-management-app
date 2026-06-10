import type { NewRecordForm } from '../types/Attendance'

type Props = {
    newRecordForm: NewRecordForm
    isLocked: boolean
    onChange: (form: NewRecordForm) => void
    onAddRecord: () => void
}

export default function AddAttendanceForm({
    newRecordForm,
    isLocked,
    onChange,
    onAddRecord,
}: Props) {
    return (
        <section className="add-card">
            <h2>勤怠を手動追加</h2>

            {isLocked && (
                <p className="lock-message">
                    この月は申請済み、または承認済みのため勤怠を追加できません。
                </p>
            )}

            <div className="add-form">
                <label>
                    <span>日付</span>
                    <input
                        type="date"
                        value={newRecordForm.date}
                        onChange={(event) =>
                            onChange({
                                ...newRecordForm,
                                date: event.target.value,
                            })
                        }
                    />
                </label>

                <label>
                    <span>出勤</span>
                    <input
                        type="time"
                        value={newRecordForm.clockInTime}
                        onChange={(event) =>
                            onChange({
                                ...newRecordForm,
                                clockInTime: event.target.value,
                            })
                        }
                    />
                </label>

                <label>
                    <span>休憩開始</span>
                    <input
                        type="time"
                        value={newRecordForm.breakStartTime}
                        onChange={(event) =>
                            onChange({
                                ...newRecordForm,
                                breakStartTime: event.target.value,
                            })
                        }
                    />
                </label>

                <label>
                    <span>休憩終了</span>
                    <input
                        type="time"
                        value={newRecordForm.breakEndTime}
                        onChange={(event) =>
                            onChange({
                                ...newRecordForm,
                                breakEndTime: event.target.value,
                            })
                        }
                    />
                </label>

                <label>
                    <span>退勤</span>
                    <input
                        type="time"
                        value={newRecordForm.clockOutTime}
                        onChange={(event) =>
                            onChange({
                                ...newRecordForm,
                                clockOutTime: event.target.value,
                            })
                        }
                    />
                </label>

                <label>
                    <span>メモ</span>
                    <input
                        type="text"
                        placeholder="例：打刻忘れのため手入力"
                        value={newRecordForm.memo}
                        onChange={(event) =>
                            onChange({
                                ...newRecordForm,
                                memo: event.target.value,
                            })
                        }
                    />
                </label>
            </div>

            <button className="add-button" onClick={onAddRecord} disabled={isLocked}>
                勤怠を追加
            </button>
        </section>
    )
}