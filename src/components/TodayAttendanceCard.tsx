import type { AttendanceRecord, AttendanceStatus } from '../types/Attendance'
import { getStatusClassName } from '../utils/attendanceUtils'

type Props = {
    today: string
    todayRecord: AttendanceRecord | undefined
    currentStatus: AttendanceStatus
    isLocked: boolean
    onClockIn: () => void
    onBreakStart: () => void
    onBreakEnd: () => void
    onClockOut: () => void
}

export default function TodayAttendanceCard({
    today,
    todayRecord,
    currentStatus,
    isLocked,
    onClockIn,
    onBreakStart,
    onBreakEnd,
    onClockOut,
}: Props) {
    return (
        <section className="today-card">
            <h2>今日の勤怠</h2>

            <div className="today-info">
                <p>
                    <span>日付</span>
                    <strong>{today}</strong>
                </p>

                <p>
                    <span>現在の状態</span>
                    <strong>
                        <span className={getStatusClassName(currentStatus)}>{currentStatus}</span>
                    </strong>
                </p>

                <p>
                    <span>出勤</span>
                    <strong>{todayRecord?.clockInTime || '-'}</strong>
                </p>

                <p>
                    <span>休憩</span>
                    <strong>
                        {todayRecord?.breakStartTime || '-'} / {todayRecord?.breakEndTime || '-'}
                    </strong>
                </p>

                <p>
                    <span>退勤</span>
                    <strong>{todayRecord?.clockOutTime || '-'}</strong>
                </p>
            </div>

            <div className="button-area">

                {isLocked && (
                    <p className="lock-message">
                        この月は申請済み、または承認済みのため打刻できません。
                    </p>
                )}

                <button
                    type="button"
                    onClick={onClockIn}
                    disabled={isLocked || todayRecord !== undefined}
                >
                    出勤
                </button>

                <button onClick={onBreakStart} disabled={isLocked || currentStatus !== '勤務中'}>
                    休憩開始
                </button>

                <button onClick={onBreakEnd} disabled={isLocked || currentStatus !== '休憩中'}>
                    休憩終了
                </button>

                <button onClick={onClockOut} disabled={isLocked || currentStatus !== '勤務中'}>
                    退勤
                </button>
            </div>
        </section>
    )
}