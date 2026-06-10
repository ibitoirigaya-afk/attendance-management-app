import type { ActivePage } from '../types/Attendance'
import type { UserRole } from '../types/User'

type Props = {
    activePage: ActivePage
    isMenuOpen: boolean
    userRole: UserRole
    onToggleMenu: () => void
    onChangePage: (page: ActivePage) => void
}

const menuItems: {
    label: string
    page: ActivePage
}[] = [
        { label: '打刻', page: 'clock' },
        { label: '勤怠集計', page: 'summary' },
        { label: '勤怠追加', page: 'add' },
        { label: '勤怠履歴', page: 'list' },
        { label: '有給申請', page: 'paidLeave' },
        { label: '社員管理', page: 'employee' },
        { label: '承認管理', page: 'approval' },
        { label: '登録申請管理', page: 'registerApproval' },
        { label: '有給承認管理', page: 'paidLeaveApproval' },
    ]

export default function AppMenu({
    activePage,
    isMenuOpen,
    userRole,
    onToggleMenu,
    onChangePage,
}: Props) {
    const visibleMenuItems = menuItems.filter((item) => {
        if (userRole === 'admin') {
            return true
        }

        return (
            item.page !== 'employee' &&
            item.page !== 'approval' &&
            item.page !== 'registerApproval' &&
            item.page !== 'paidLeaveApproval'
        )
    })

    const handleChangePage = (page: ActivePage) => {
        onChangePage(page)
        onToggleMenu()
    }

    return (
        <>
            <button
                type="button"
                className="menu-icon-button"
                onClick={onToggleMenu}
                aria-label="メニューを開く"
            >
                ☰
            </button>

            {isMenuOpen && (
                <>
                    <div
                        className="menu-backdrop"
                        onClick={onToggleMenu}
                    />

                    <aside className="floating-menu-panel">
                        <div className="floating-menu-header">
                            <div className="floating-menu-logo">勤</div>
                            <div>
                                <p>MENU</p>
                                <span>画面切り替え</span>
                            </div>
                        </div>

                        <nav className="floating-menu-list">
                            {visibleMenuItems.map((item) => (
                                <button
                                    key={item.page}
                                    type="button"
                                    className={
                                        activePage === item.page
                                            ? 'floating-menu-item active'
                                            : 'floating-menu-item'
                                    }
                                    onClick={() => handleChangePage(item.page)}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </aside>
                </>
            )}
        </>
    )
}