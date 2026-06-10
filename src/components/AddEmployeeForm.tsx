import type { Employee, EmployeeEditForm } from '../types/Employee'

type Props = {
    activeEmployees: Employee[]
    deletedEmployees: Employee[]
    editingEmployeeId: number | null
    employeeEditForm: EmployeeEditForm
    onRestoreEmployee: (employeeId: number) => void
    onDeleteEmployee: (employeeId: number) => void
    onStartEditEmployee: (employee: Employee) => void
    onCancelEditEmployee: () => void
    onEmployeeEditFormChange: (form: EmployeeEditForm) => void
    onSaveEmployee: (employeeId: number) => void
}

export default function AddEmployeeForm({
    activeEmployees,
    deletedEmployees,
    editingEmployeeId,
    employeeEditForm,
    onRestoreEmployee,
    onDeleteEmployee,
    onStartEditEmployee,
    onCancelEditEmployee,
    onEmployeeEditFormChange,
    onSaveEmployee,
}: Props) {
    return (
        <section className="add-card">

            <p className="empty-text">
                社員追加はログイン画面の新規登録申請から行います。
            </p>

            <div className="employee-management-section">
                <h3>現在の社員一覧</h3>

                <div className="managed-employee-list">
                    {activeEmployees.map((employee) => {
                        const isEditing = editingEmployeeId === employee.id

                        return (
                            <div key={employee.id} className="managed-employee-item">
                                {isEditing ? (
                                    <div className="managed-employee-edit">
                                        <label>
                                            <span>社員名</span>
                                            <input
                                                type="text"
                                                value={employeeEditForm.name}
                                                onChange={(event) =>
                                                    onEmployeeEditFormChange({
                                                        ...employeeEditForm,
                                                        name: event.target.value,
                                                    })
                                                }
                                            />
                                        </label>

                                        <label>
                                            <span>部署</span>
                                            <input
                                                type="text"
                                                value={employeeEditForm.department}
                                                onChange={(event) =>
                                                    onEmployeeEditFormChange({
                                                        ...employeeEditForm,
                                                        department: event.target.value,
                                                    })
                                                }
                                            />
                                        </label>
                                    </div>
                                ) : (
                                    <div>
                                        <strong>{employee.name}</strong>
                                        <span>{employee.department}</span>
                                    </div>
                                )}

                                <div className="managed-employee-actions">
                                    {isEditing ? (
                                        <>
                                            <button className="save-button" onClick={() => onSaveEmployee(employee.id)}>
                                                保存
                                            </button>

                                            <button className="cancel-button" onClick={onCancelEditEmployee}>
                                                キャンセル
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="edit-button" onClick={() => onStartEditEmployee(employee)}>
                                                編集
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() => onDeleteEmployee(employee.id)}
                                            >
                                                削除
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="deleted-employees">
                <h3>削除済み社員</h3>

                {deletedEmployees.length === 0 ? (
                    <p className="empty-message">削除済み社員はいません。</p>
                ) : (
                    <div className="deleted-employee-list">
                        {deletedEmployees.map((employee) => (
                            <div key={employee.id} className="deleted-employee-item">
                                <div>
                                    <strong>{employee.name}</strong>
                                    <span>{employee.department}</span>
                                </div>

                                <button onClick={() => onRestoreEmployee(employee.id)}>復活</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}