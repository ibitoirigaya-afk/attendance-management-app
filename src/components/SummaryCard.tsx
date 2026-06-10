import { formatMinutes } from '../utils/attendanceUtils'

type Props = {
    currentMonth: string
    monthlyWorkDays: number
    monthlyTotalWorkMinutes: number
    monthlyTotalBreakMinutes: number
    monthlyAverageWorkMinutes: number
    monthlyRequestStatus: string
    monthlyRequestComment: string
    onSubmitMonthlyRequest: () => void
}

export default function SummaryCard({
    currentMonth,
    monthlyWorkDays,
    monthlyTotalWorkMinutes,
    monthlyTotalBreakMinutes,
    monthlyAverageWorkMinutes,
    monthlyRequestStatus,
    monthlyRequestComment,
    onSubmitMonthlyRequest,
}: Props) {
    return (
        <section className="summary-card">
            <h2>今月の勤怠集計</h2>

            <div className="summary-grid">
                <div className="summary-item">
                    <span>対象月</span>
                    <strong>{currentMonth}</strong>
                </div>

                <div className="summary-item">
                    <span>勤務日数</span>
                    <strong>{monthlyWorkDays}日</strong>
                </div>

                <div className="summary-item">
                    <span>総勤務時間</span>
                    <strong>{formatMinutes(monthlyTotalWorkMinutes)}</strong>
                </div>

                <div className="summary-item">
                    <span>総休憩時間</span>
                    <strong>{formatMinutes(monthlyTotalBreakMinutes)}</strong>
                </div>

                <div className="summary-item">
                    <span>平均勤務時間</span>
                    <strong>{formatMinutes(monthlyAverageWorkMinutes)}</strong>
                </div>
            </div>

            <div className="monthly-request-box">
                <p>
                    月次申請状態：
                    <strong>{monthlyRequestStatus}</strong>
                </p>

                {monthlyRequestStatus === '差戻し' && monthlyRequestComment !== '' && (
                    <p className="reject-comment">
                        差戻し理由：{monthlyRequestComment}
                    </p>
                )}

                <button
                    type="button"
                    className="primary-button"
                    onClick={onSubmitMonthlyRequest}
                    disabled={
                        monthlyRequestStatus === '申請済み' ||
                        monthlyRequestStatus === '承認済み'
                    }
                >
                    この月の勤怠を申請する
                </button>
            </div>
        </section>
    )
}