import { useEffect, useMemo, useState } from 'react'
import AddAttendanceForm from './components/AddAttendanceForm'
import AddEmployeeForm from './components/AddEmployeeForm'
import ApprovalManagement from './components/ApprovalManagement'
import RegisterRequestManagement from './components/RegisterRequestManagement'
import type { Employee, EmployeeEditForm, EmployeeForm } from './types/Employee'
import AppMenu from './components/AppMenu'
import AttendanceList from './components/AttendanceList'
import EmployeeSidebar from './components/EmployeeSidebar'
import Message from './components/Message'
import SummaryCard from './components/SummaryCard'
import LoginPage from './components/LoginPage'
import { mockUsers } from './data/users'
import type { LoginUser } from './types/User'
import type { RegisterRequest } from './types/RegisterRequest'
import type { PaidLeaveRequest } from './types/PaidLeave'
import PaidLeaveRequestPage from './components/PaidLeaveRequestPage'
import PaidLeaveApprovalManagement from './components/PaidLeaveApprovalManagement'
import TodayAttendanceCard from './components/TodayAttendanceCard'
import { mockEmployees } from './data/employees'
import type {
  ActivePage,
  AttendanceRecord,
  AttendanceStatus,
  EditForm,
  MonthlyRequest,
  NewRecordForm,
  SortOrder,
} from './types/Attendance'
import {
  calculateMinutes,
  formatMinutes,
  getCurrentMonth,
  getCurrentTime,
  getStatusByTimes,
  getToday,
  validateAttendanceTimes,
} from './utils/attendanceUtils'
import './style.css'

const STORAGE_KEY = 'attendance-records'
const EMPLOYEE_STORAGE_KEY = 'employees'
const MONTHLY_REQUEST_STORAGE_KEY = 'monthly-requests'
const LOGIN_USER_STORAGE_KEY = 'login-user'
const REGISTER_REQUEST_STORAGE_KEY = 'register-requests'
const USERS_STORAGE_KEY = 'users'
const PAID_LEAVE_REQUEST_STORAGE_KEY = 'paid-leave-requests'

export default function App() {
  const [loginUser, setLoginUser] = useState<LoginUser | null>(() => {
    const savedUser = localStorage.getItem(LOGIN_USER_STORAGE_KEY)

    if (savedUser === null) {
      return null
    }

    return JSON.parse(savedUser)
  })

  const [users, setUsers] = useState<LoginUser[]>(() => {
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY)

    if (savedUsers === null) {
      return mockUsers
    }

    return JSON.parse(savedUsers)
  })

  const [registerRequests, setRegisterRequests] = useState<RegisterRequest[]>(() => {
    const savedRequests = localStorage.getItem(REGISTER_REQUEST_STORAGE_KEY)

    if (savedRequests === null) {
      return []
    }

    return JSON.parse(savedRequests)
  })

  const [paidLeaveRequests, setPaidLeaveRequests] = useState<PaidLeaveRequest[]>(() => {
    const savedRequests = localStorage.getItem(PAID_LEAVE_REQUEST_STORAGE_KEY)

    if (savedRequests === null) {
      return []
    }

    return JSON.parse(savedRequests)
  })

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    const savedRecords = localStorage.getItem(STORAGE_KEY)

    if (savedRecords === null) {
      return []
    }

    return JSON.parse(savedRecords)
  })

  const [monthlyRequests, setMonthlyRequests] = useState<MonthlyRequest[]>(() => {
    const savedRequests = localStorage.getItem(MONTHLY_REQUEST_STORAGE_KEY)

    if (savedRequests === null) {
      return []
    }

    return JSON.parse(savedRequests)
  })

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const savedEmployees = localStorage.getItem(EMPLOYEE_STORAGE_KEY)

    if (savedEmployees === null) {
      return mockEmployees
    }

    return JSON.parse(savedEmployees)
  })

  const [editingRecordId, setEditingRecordId] = useState<number | null>(null)

  const [editForm, setEditForm] = useState<EditForm>({
    clockInTime: '',
    clockOutTime: '',
    breakStartTime: '',
    breakEndTime: '',
    memo: '',
  })

  const [newRecordForm, setNewRecordForm] = useState<NewRecordForm>({
    date: '',
    clockInTime: '',
    clockOutTime: '',
    breakStartTime: '',
    breakEndTime: '',
    memo: '',
  })

  const [filterMonth, setFilterMonth] = useState(getCurrentMonth())
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest')
  const [message, setMessage] = useState('')
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(1)

  const [employeeForm, setEmployeeForm] = useState<EmployeeForm>({
    name: '',
    department: '',
  })

  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null)

  const [employeeEditForm, setEmployeeEditForm] = useState<EmployeeEditForm>({
    name: '',
    department: '',
  })

  const [activePage, setActivePage] = useState<ActivePage>('clock')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [departmentFilter, setDepartmentFilter] = useState('')

  const activeEmployees = employees.filter((employee) => employee.isDeleted !== true)

  const deletedEmployees = employees.filter((employee) => employee.isDeleted === true)

  const departments = useMemo(() => {
    return Array.from(new Set(activeEmployees.map((employee) => employee.department)))
  }, [activeEmployees])

  const filteredEmployees = useMemo(() => {
    if (departmentFilter === '') {
      return activeEmployees
    }

    return activeEmployees.filter((employee) => employee.department === departmentFilter)
  }, [activeEmployees, departmentFilter])

  const selectedEmployee = employees.find((employee) => employee.id === selectedEmployeeId)

  const today = getToday()
  const currentMonth = getCurrentMonth()

  const selectedEmployeeRecords = useMemo(() => {
    return attendanceRecords.filter((record) => record.employeeId === selectedEmployeeId)
  }, [attendanceRecords, selectedEmployeeId])

  const todayRecord = useMemo(() => {
    return selectedEmployeeRecords.find((record) => record.date === today)
  }, [selectedEmployeeRecords, today])

  const currentStatus: AttendanceStatus = todayRecord?.status ?? '勤務前'

  const monthlyRecords = useMemo(() => {
    return selectedEmployeeRecords.filter((record) => record.date.startsWith(currentMonth))
  }, [selectedEmployeeRecords, currentMonth])

  const monthlyWorkDays = monthlyRecords.filter((record) => record.clockInTime !== '').length

  const monthlyTotalWorkMinutes = monthlyRecords.reduce((total, record) => {
    return total + record.totalWorkMinutes
  }, 0)

  const monthlyTotalBreakMinutes = monthlyRecords.reduce((total, record) => {
    return total + record.totalBreakMinutes
  }, 0)

  const monthlyAverageWorkMinutes =
    monthlyWorkDays === 0 ? 0 : Math.floor(monthlyTotalWorkMinutes / monthlyWorkDays)

  const currentMonthlyRequest = monthlyRequests.find(
    (request) =>
      request.employeeId === selectedEmployeeId &&
      request.targetMonth === currentMonth,
  )

  const monthlyRequestStatus = currentMonthlyRequest?.status ?? '未申請'

  const isCurrentMonthLocked =
    monthlyRequestStatus === '申請済み' ||
    monthlyRequestStatus === '承認済み'

  const filteredRecords = useMemo(() => {
    const filtered =
      filterMonth === ''
        ? selectedEmployeeRecords
        : selectedEmployeeRecords.filter((record) => record.date.startsWith(filterMonth))

    return [...filtered].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.date.localeCompare(a.date)
      }

      return a.date.localeCompare(b.date)
    })
  }, [selectedEmployeeRecords, filterMonth, sortOrder])

  useEffect(() => {
    if (loginUser === null) {
      localStorage.removeItem(LOGIN_USER_STORAGE_KEY)
      return
    }

    localStorage.setItem(LOGIN_USER_STORAGE_KEY, JSON.stringify(loginUser))
  }, [loginUser])

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    localStorage.setItem(
      REGISTER_REQUEST_STORAGE_KEY,
      JSON.stringify(registerRequests),
    )
  }, [registerRequests])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceRecords))
  }, [attendanceRecords])

  useEffect(() => {
    localStorage.setItem(
      MONTHLY_REQUEST_STORAGE_KEY,
      JSON.stringify(monthlyRequests),
    )
  }, [monthlyRequests])

  useEffect(() => {
    localStorage.setItem(
      PAID_LEAVE_REQUEST_STORAGE_KEY,
      JSON.stringify(paidLeaveRequests),
    )
  }, [paidLeaveRequests])

  useEffect(() => {
    localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    if (message === '') {
      return
    }

    const timerId = setTimeout(() => {
      setMessage('')
    }, 2500)

    return () => {
      clearTimeout(timerId)
    }
  }, [message])

  useEffect(() => {
    if (loginUser === null) {
      return
    }

    if (
      loginUser.role === 'employee' &&
      (
        activePage === 'employee' ||
        activePage === 'approval' ||
        activePage === 'registerApproval' ||
        activePage === 'paidLeaveApproval'
      )
    ) {
      setActivePage('clock')
    }
  }, [loginUser, activePage])

  useEffect(() => {
    if (loginUser === null) {
      return
    }

    if (loginUser.role !== 'employee') {
      return
    }

    if (loginUser.employeeId === undefined) {
      return
    }

    if (selectedEmployeeId !== loginUser.employeeId) {
      setSelectedEmployeeId(loginUser.employeeId)
    }
  }, [loginUser, selectedEmployeeId])

  useEffect(() => {
    setEditingRecordId(null)

    setEditForm({
      clockInTime: '',
      clockOutTime: '',
      breakStartTime: '',
      breakEndTime: '',
      memo: '',
    })
  }, [selectedEmployeeId])

  const handleLogin = (user: LoginUser) => {
    setLoginUser(user)

    if (user.role === 'employee' && user.employeeId !== undefined) {
      setSelectedEmployeeId(user.employeeId)
      setActivePage('clock')
    }

    if (user.role === 'admin') {
      setActivePage('clock')
    }
  }

  const handleRegisterRequest = (request: RegisterRequest) => {
    const alreadyUserExists = users.some((user) => user.email === request.email)

    if (alreadyUserExists) {
      alert('このメールアドレスはすでに登録されています')
      return
    }

    const alreadyRequested = registerRequests.some(
      (registerRequest) =>
        registerRequest.email === request.email &&
        registerRequest.status === '申請中',
    )

    if (alreadyRequested) {
      alert('このメールアドレスはすでに申請中です')
      return
    }

    setRegisterRequests([...registerRequests, request])
    alert('新規登録申請を送信しました。管理者の承認をお待ちください。')
  }

  const handleApproveRegisterRequest = (requestId: number) => {
    const targetRequest = registerRequests.find((request) => request.id === requestId)

    if (targetRequest === undefined) {
      return
    }

    const newEmployeeId = Date.now()

    const newEmployee: Employee = {
      id: newEmployeeId,
      name: targetRequest.name,
      department: targetRequest.department,
      paidLeaveDays: 10,
      isDeleted: false,
    }

    const newUser: LoginUser = {
      id: Date.now() + 1,
      name: targetRequest.name,
      email: targetRequest.email,
      password: targetRequest.password,
      role: 'employee',
      employeeId: newEmployeeId,
    }

    setEmployees([...employees, newEmployee])
    setUsers([...users, newUser])

    setRegisterRequests(
      registerRequests.map((request) =>
        request.id === requestId
          ? {
            ...request,
            status: '承認済み',
          }
          : request,
      ),
    )

    setMessage('登録申請を承認しました')
  }

  const handleRejectRegisterRequest = (requestId: number) => {
    const confirmed = window.confirm('この登録申請を却下しますか？')

    if (!confirmed) {
      return
    }

    setRegisterRequests(
      registerRequests.map((request) =>
        request.id === requestId
          ? {
            ...request,
            status: '却下',
          }
          : request,
      ),
    )

    setMessage('登録申請を却下しました')
  }

  const handleLogout = () => {
    setLoginUser(null)
    setMessage('')
  }

  const handleChangePage = (page: ActivePage) => {
    setActivePage(page)
    setIsMenuOpen(false)
  }

  const handleAddEmployee = () => {
    if (employeeForm.name.trim() === '') {
      alert('社員名を入力してください')
      return
    }

    if (employeeForm.department.trim() === '') {
      alert('部署を入力してください')
      return
    }

    const alreadyExists = employees.some(
      (employee) => employee.name === employeeForm.name.trim(),
    )

    if (alreadyExists) {
      alert('同じ名前の社員がすでに存在します')
      return
    }

    const newEmployee: Employee = {
      id: Date.now(),
      name: employeeForm.name.trim(),
      department: employeeForm.department.trim(),
      paidLeaveDays: 10,
      isDeleted: false,
    }

    setEmployees([...employees, newEmployee])
    setSelectedEmployeeId(newEmployee.id)

    setEmployeeForm({
      name: '',
      department: '',
    })

    setMessage('社員を追加しました')
    setActivePage('clock')
  }

  const handleDeleteEmployee = (employeeId: number) => {
    const targetEmployee = employees.find((employee) => employee.id === employeeId)

    if (targetEmployee === undefined) {
      return
    }

    const confirmed = window.confirm(
      `${targetEmployee.name}さんを社員一覧から削除しますか？\n削除後も復活できます。`,
    )

    if (!confirmed) {
      return
    }

    const updatedEmployees = employees.map((employee) =>
      employee.id === employeeId
        ? {
          ...employee,
          isDeleted: true,
        }
        : employee,
    )

    setEmployees(updatedEmployees)

    if (selectedEmployeeId === employeeId) {
      const nextEmployee = updatedEmployees.find((employee) => employee.isDeleted !== true)

      if (nextEmployee !== undefined) {
        setSelectedEmployeeId(nextEmployee.id)
      }
    }

    setMessage('社員を削除しました')
  }

  const handleRestoreEmployee = (employeeId: number) => {
    const targetEmployee = employees.find((employee) => employee.id === employeeId)

    if (targetEmployee === undefined) {
      return
    }

    setEmployees(
      employees.map((employee) =>
        employee.id === employeeId
          ? {
            ...employee,
            isDeleted: false,
          }
          : employee,
      ),
    )

    setSelectedEmployeeId(employeeId)
    setMessage('社員を復活しました')
    setActivePage('clock')
  }

  const handleStartEditEmployee = (employee: Employee) => {
    setEditingEmployeeId(employee.id)

    setEmployeeEditForm({
      name: employee.name,
      department: employee.department,
    })
  }

  const handleCancelEditEmployee = () => {
    setEditingEmployeeId(null)

    setEmployeeEditForm({
      name: '',
      department: '',
    })
  }

  const handleSaveEmployee = (employeeId: number) => {
    if (employeeEditForm.name.trim() === '') {
      alert('社員名を入力してください')
      return
    }

    if (employeeEditForm.department.trim() === '') {
      alert('部署を入力してください')
      return
    }

    const alreadyExists = employees.some(
      (employee) =>
        employee.id !== employeeId &&
        employee.isDeleted !== true &&
        employee.name === employeeEditForm.name.trim(),
    )

    if (alreadyExists) {
      alert('同じ名前の社員がすでに存在します')
      return
    }

    setEmployees(
      employees.map((employee) =>
        employee.id === employeeId
          ? {
            ...employee,
            name: employeeEditForm.name.trim(),
            department: employeeEditForm.department.trim(),
          }
          : employee,
      ),
    )

    handleCancelEditEmployee()
    setMessage('社員情報を更新しました')
  }

  const handleSubmitPaidLeaveRequest = (targetDate: string) => {
    if (selectedEmployee === undefined) {
      alert('社員情報が見つかりません')
      return
    }

    if (targetDate === '') {
      alert('有給を取得する日付を選択してください')
      return
    }

    if (selectedEmployee.paidLeaveDays <= 0) {
      alert('有給残日数がありません')
      return
    }

    const alreadyRequested = paidLeaveRequests.some(
      (request) =>
        request.employeeId === selectedEmployeeId &&
        request.targetDate === targetDate &&
        request.status !== '却下',
    )

    if (alreadyRequested) {
      alert('この日付はすでに有給申請済みです')
      return
    }

    const newRequest: PaidLeaveRequest = {
      id: Date.now(),
      employeeId: selectedEmployeeId,
      targetDate,
      status: '申請中',
      requestedAt: new Date().toLocaleString(),
      approvedAt: '',
    }

    setPaidLeaveRequests([newRequest, ...paidLeaveRequests])
    setMessage('有給申請を送信しました')
  }

  const handleApprovePaidLeaveRequest = (requestId: number) => {
    const targetRequest = paidLeaveRequests.find((request) => request.id === requestId)

    if (targetRequest === undefined) {
      return
    }

    const targetEmployee = employees.find(
      (employee) => employee.id === targetRequest.employeeId,
    )

    if (targetEmployee === undefined) {
      alert('社員情報が見つかりません')
      return
    }

    if (targetEmployee.paidLeaveDays <= 0) {
      alert('有給残日数が不足しているため承認できません')
      return
    }

    setPaidLeaveRequests(
      paidLeaveRequests.map((request) =>
        request.id === requestId
          ? {
            ...request,
            status: '承認済み',
            approvedAt: new Date().toLocaleString(),
          }
          : request,
      ),
    )

    setEmployees(
      employees.map((employee) =>
        employee.id === targetRequest.employeeId
          ? {
            ...employee,
            paidLeaveDays: employee.paidLeaveDays - 1,
          }
          : employee,
      ),
    )

    setMessage('有給申請を承認しました')
  }

  const handleRejectPaidLeaveRequest = (requestId: number) => {
    const confirmed = window.confirm('この有給申請を却下しますか？')

    if (!confirmed) {
      return
    }

    setPaidLeaveRequests(
      paidLeaveRequests.map((request) =>
        request.id === requestId
          ? {
            ...request,
            status: '却下',
            approvedAt: '',
          }
          : request,
      ),
    )

    setMessage('有給申請を却下しました')
  }

  const handleSubmitMonthlyRequest = () => {
    if (monthlyRecords.length === 0) {
      alert('申請できる勤怠データがありません')
      return
    }

    if (monthlyRequestStatus === '申請済み') {
      alert('この月の勤怠はすでに申請済みです')
      return
    }

    if (monthlyRequestStatus === '承認済み') {
      alert('この月の勤怠はすでに承認済みです')
      return
    }

    if (currentMonthlyRequest !== undefined) {
      setMonthlyRequests(
        monthlyRequests.map((request) =>
          request.id === currentMonthlyRequest.id
            ? {
              ...request,
              status: '申請済み',
              requestedAt: new Date().toLocaleString(),
              approvedAt: '',
              comment: '',
            }
            : request,
        ),
      )

      setMessage('月次勤怠を再申請しました')
      return
    }

    const newRequest = {
      id: Date.now(),
      employeeId: selectedEmployeeId,
      targetMonth: currentMonth,
      status: '申請済み' as const,
      requestedAt: new Date().toLocaleString(),
      approvedAt: '',
      comment: '',
    }

    setMonthlyRequests([...monthlyRequests, newRequest])
    setMessage('月次勤怠を申請しました')
  }

  const handleApproveMonthlyRequest = (requestId: number) => {
    setMonthlyRequests(
      monthlyRequests.map((request) =>
        request.id === requestId
          ? {
            ...request,
            status: '承認済み',
            approvedAt: new Date().toLocaleString(),
            comment: '',
          }
          : request,
      ),
    )

    setMessage('月次申請を承認しました')
  }

  const handleRejectMonthlyRequest = (requestId: number) => {
    const comment = window.prompt('差戻し理由を入力してください')

    if (comment === null) {
      return
    }

    setMonthlyRequests(
      monthlyRequests.map((request) =>
        request.id === requestId
          ? {
            ...request,
            status: '差戻し',
            approvedAt: '',
            comment,
          }
          : request,
      ),
    )

    setMessage('月次申請を差戻しました')
  }

  const handleClockIn = () => {
    if (isCurrentMonthLocked) {
      alert('この月の勤怠は申請済み、または承認済みのため打刻できません')
      return
    }

    if (todayRecord !== undefined) {
      return
    }

    const newRecord: AttendanceRecord = {
      id: Date.now(),
      employeeId: selectedEmployeeId,
      date: today,
      clockInTime: getCurrentTime(),
      clockOutTime: '',
      breakStartTime: '',
      breakEndTime: '',
      totalWorkMinutes: 0,
      totalBreakMinutes: 0,
      status: '勤務中',
      memo: '',
    }

    setAttendanceRecords([newRecord, ...attendanceRecords])
    setMessage('出勤しました')
  }

  const handleBreakStart = () => {
    if (isCurrentMonthLocked) {
      alert('この月の勤怠は申請済み、または承認済みのため打刻できません')
      return
    }

    if (todayRecord === undefined) {
      return
    }
    if (todayRecord === undefined) {
      return
    }

    if (todayRecord.status !== '勤務中') {
      return
    }

    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.id === todayRecord.id
          ? {
            ...record,
            breakStartTime: getCurrentTime(),
            status: '休憩中',
          }
          : record,
      ),
    )

    setMessage('休憩を開始しました')
  }

  const handleBreakEnd = () => {
    if (isCurrentMonthLocked) {
      alert('この月の勤怠は申請済み、または承認済みのため打刻できません')
      return
    }

    if (todayRecord === undefined) {
      return
    }
    if (todayRecord === undefined) {
      return
    }

    if (todayRecord.status !== '休憩中') {
      return
    }

    const breakEndTime = getCurrentTime()
    const totalBreakMinutes = calculateMinutes(todayRecord.breakStartTime, breakEndTime)

    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.id === todayRecord.id
          ? {
            ...record,
            breakEndTime,
            totalBreakMinutes,
            status: '勤務中',
          }
          : record,
      ),
    )

    setMessage('休憩を終了しました')
  }

  const handleClockOut = () => {
    if (isCurrentMonthLocked) {
      alert('この月の勤怠は申請済み、または承認済みのため打刻できません')
      return
    }

    if (todayRecord === undefined) {
      return
    }
    if (todayRecord === undefined) {
      return
    }

    if (todayRecord.status !== '勤務中') {
      return
    }

    const clockOutTime = getCurrentTime()

    const workMinutes =
      calculateMinutes(todayRecord.clockInTime, clockOutTime) - todayRecord.totalBreakMinutes

    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.id === todayRecord.id
          ? {
            ...record,
            clockOutTime,
            totalWorkMinutes: workMinutes,
            status: '退勤済',
          }
          : record,
      ),
    )

    setMessage('退勤しました')
  }

  const handleAddRecord = () => {

    if (newRecordForm.date === '') {
      alert('日付を入力してください')
      return
    }

    const targetMonth = newRecordForm.date.slice(0, 7)

    const targetMonthlyRequest = monthlyRequests.find(
      (request) =>
        request.employeeId === selectedEmployeeId &&
        request.targetMonth === targetMonth,
    )

    if (
      targetMonthlyRequest?.status === '申請済み' ||
      targetMonthlyRequest?.status === '承認済み'
    ) {
      alert('この月の勤怠は申請済み、または承認済みのため追加できません')
      return
    }

    const alreadyExists = attendanceRecords.some(
      (record) =>
        record.employeeId === selectedEmployeeId && record.date === newRecordForm.date,
    )

    if (alreadyExists) {
      alert('同じ日付の勤怠データはすでに存在します')
      return
    }

    const isValid = validateAttendanceTimes(
      newRecordForm.clockInTime,
      newRecordForm.clockOutTime,
      newRecordForm.breakStartTime,
      newRecordForm.breakEndTime,
    )

    if (!isValid) {
      return
    }

    const totalBreakMinutes = calculateMinutes(
      newRecordForm.breakStartTime,
      newRecordForm.breakEndTime,
    )

    const totalWorkMinutes =
      calculateMinutes(newRecordForm.clockInTime, newRecordForm.clockOutTime) -
      totalBreakMinutes

    const status = getStatusByTimes(
      newRecordForm.clockInTime,
      newRecordForm.clockOutTime,
      newRecordForm.breakStartTime,
      newRecordForm.breakEndTime,
    )

    const newRecord: AttendanceRecord = {
      id: Date.now(),
      employeeId: selectedEmployeeId,
      date: newRecordForm.date,
      clockInTime: newRecordForm.clockInTime,
      clockOutTime: newRecordForm.clockOutTime,
      breakStartTime: newRecordForm.breakStartTime,
      breakEndTime: newRecordForm.breakEndTime,
      totalWorkMinutes: totalWorkMinutes < 0 ? 0 : totalWorkMinutes,
      totalBreakMinutes,
      status,
      memo: newRecordForm.memo,
    }

    setAttendanceRecords([newRecord, ...attendanceRecords])

    setNewRecordForm({
      date: '',
      clockInTime: '',
      clockOutTime: '',
      breakStartTime: '',
      breakEndTime: '',
      memo: '',
    })

    setMessage('勤怠を追加しました')
  }

  const handleDelete = (id: number) => {

    setAttendanceRecords(attendanceRecords.filter((record) => record.id !== id))
    setMessage('勤怠を削除しました')

    if (editingRecordId === id) {
      setEditingRecordId(null)
    }
  }

  const handleStartEdit = (record: AttendanceRecord) => {
    const targetMonth = record.date.slice(0, 7)

    const targetMonthlyRequest = monthlyRequests.find(
      (request) =>
        request.employeeId === record.employeeId &&
        request.targetMonth === targetMonth,
    )

    if (
      targetMonthlyRequest?.status === '申請済み' ||
      targetMonthlyRequest?.status === '承認済み'
    ) {
      alert('この月の勤怠は申請済み、または承認済みのため編集できません')
      return
    }

    setEditingRecordId(record.id)

    setEditForm({
      clockInTime: record.clockInTime,
      clockOutTime: record.clockOutTime,
      breakStartTime: record.breakStartTime,
      breakEndTime: record.breakEndTime,
      memo: record.memo,
    })
  }

  const handleCancelEdit = () => {
    setEditingRecordId(null)

    setEditForm({
      clockInTime: '',
      clockOutTime: '',
      breakStartTime: '',
      breakEndTime: '',
      memo: '',
    })
  }

  const handleSaveEdit = (id: number) => {
    const targetRecord = attendanceRecords.find((record) => record.id === id)

    if (targetRecord === undefined) {
      return
    }

    const targetMonth = targetRecord.date.slice(0, 7)

    const targetMonthlyRequest = monthlyRequests.find(
      (request) =>
        request.employeeId === targetRecord.employeeId &&
        request.targetMonth === targetMonth,
    )

    if (
      targetMonthlyRequest?.status === '申請済み' ||
      targetMonthlyRequest?.status === '承認済み'
    ) {
      alert('この月の勤怠は申請済み、または承認済みのため更新できません')
      return
    }

    const isValid = validateAttendanceTimes(
      editForm.clockInTime,
      editForm.clockOutTime,
      editForm.breakStartTime,
      editForm.breakEndTime,
    )

    if (!isValid) {
      return
    }

    const totalBreakMinutes = calculateMinutes(editForm.breakStartTime, editForm.breakEndTime)

    const totalWorkMinutes =
      calculateMinutes(editForm.clockInTime, editForm.clockOutTime) - totalBreakMinutes

    const status = getStatusByTimes(
      editForm.clockInTime,
      editForm.clockOutTime,
      editForm.breakStartTime,
      editForm.breakEndTime,
    )

    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.id === id
          ? {
            ...record,
            clockInTime: editForm.clockInTime,
            clockOutTime: editForm.clockOutTime,
            breakStartTime: editForm.breakStartTime,
            breakEndTime: editForm.breakEndTime,
            totalBreakMinutes,
            totalWorkMinutes: totalWorkMinutes < 0 ? 0 : totalWorkMinutes,
            status,
            memo: editForm.memo,
          }
          : record,
      ),
    )

    setMessage('勤怠を更新しました')
    handleCancelEdit()
  }

  const handleExportCsv = () => {
    if (filteredRecords.length === 0) {
      alert('出力できる勤怠データがありません')
      return
    }

    const csvHeaders = [
      '日付',
      '出勤',
      '休憩開始',
      '休憩終了',
      '退勤',
      '休憩時間',
      '勤務時間',
      '状態',
      'メモ',
    ]

    const csvRows = filteredRecords.map((record) => {
      return [
        record.date,
        record.clockInTime,
        record.breakStartTime,
        record.breakEndTime,
        record.clockOutTime,
        formatMinutes(record.totalBreakMinutes),
        formatMinutes(record.totalWorkMinutes),
        record.status,
        record.memo,
      ]
    })

    const csvText = [csvHeaders, ...csvRows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      )
      .join('\n')

    const bom = '\uFEFF'
    const blob = new Blob([bom + csvText], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `attendance-${selectedEmployee?.name ?? 'employee'}-${filterMonth || 'all'}.csv`
    link.click()

    URL.revokeObjectURL(url)

    setMessage('CSVを出力しました')
  }

  if (loginUser === null) {
    return (
      <LoginPage
        users={users}
        onLogin={handleLogin}
        onRegisterRequest={handleRegisterRequest}
      />
    )
  }

  return (
    <main className="app">
      <AppMenu
        activePage={activePage}
        isMenuOpen={isMenuOpen}
        userRole={loginUser.role}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        onChangePage={handleChangePage}
      />

      <section className="hero">
        <div>
          <h1>
            {loginUser.role === 'admin'
              ? '勤怠管理アプリ 管理者画面'
              : '勤怠管理アプリ 社員画面'}
          </h1>
          <p>
            {selectedEmployee === undefined
              ? '社員を選択してください'
              : loginUser.role === 'admin'
                ? `${selectedEmployee.name}さんの勤怠を管理しています。`
                : `${selectedEmployee.name}さんの勤怠画面です。`}
          </p>
        </div>

        <div className="login-user-box">
          <div>
            <p>ログイン中：{loginUser.name}</p>
            <p className="user-role-label">
              権限：{loginUser.role === 'admin' ? '管理者' : '社員'}
            </p>
          </div>

          <button type="button" className="logout-button" onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </section>

      <Message message={message} />

      <div
        className={
          loginUser.role === 'admin'
            ? 'dashboard-layout'
            : 'dashboard-layout employee-layout'
        }
      >
        {loginUser.role === 'admin' && (
          <EmployeeSidebar
            employees={filteredEmployees}
            departments={departments}
            departmentFilter={departmentFilter}
            attendanceRecords={attendanceRecords}
            today={today}
            selectedEmployeeId={selectedEmployeeId}
            onDepartmentFilterChange={setDepartmentFilter}
            onSelectEmployee={setSelectedEmployeeId}
          />
        )}

        <div className="dashboard-main">
          {activePage === 'clock' && (
            <TodayAttendanceCard
              today={today}
              todayRecord={todayRecord}
              currentStatus={currentStatus}
              isLocked={isCurrentMonthLocked}
              onClockIn={handleClockIn}
              onBreakStart={handleBreakStart}
              onBreakEnd={handleBreakEnd}
              onClockOut={handleClockOut}
            />
          )}

          {activePage === 'summary' && (
            <SummaryCard
              currentMonth={currentMonth}
              monthlyWorkDays={monthlyWorkDays}
              monthlyTotalWorkMinutes={monthlyTotalWorkMinutes}
              monthlyTotalBreakMinutes={monthlyTotalBreakMinutes}
              monthlyAverageWorkMinutes={monthlyAverageWorkMinutes}
              monthlyRequestStatus={monthlyRequestStatus}
              monthlyRequestComment={currentMonthlyRequest?.comment ?? ''}
              onSubmitMonthlyRequest={handleSubmitMonthlyRequest}
            />
          )}

          {activePage === 'paidLeave' && selectedEmployee !== undefined && (
            <PaidLeaveRequestPage
              employee={selectedEmployee}
              paidLeaveRequests={paidLeaveRequests.filter(
                (request) => request.employeeId === selectedEmployeeId,
              )}
              onSubmitPaidLeaveRequest={handleSubmitPaidLeaveRequest}
            />
          )}

          {activePage === 'add' && (
            <AddAttendanceForm
              newRecordForm={newRecordForm}
              isLocked={isCurrentMonthLocked}
              onChange={setNewRecordForm}
              onAddRecord={handleAddRecord}
            />
          )}

          {activePage === 'list' && (
            <AttendanceList
              filteredRecords={filteredRecords}
              filterMonth={filterMonth}
              sortOrder={sortOrder}
              editingRecordId={editingRecordId}
              editForm={editForm}
              monthlyRequests={monthlyRequests}
              onFilterMonthChange={setFilterMonth}
              onSortOrderChange={setSortOrder}
              onEditFormChange={setEditForm}
              onStartEdit={handleStartEdit}
              onCancelEdit={handleCancelEdit}
              onSaveEdit={handleSaveEdit}
              onDelete={handleDelete}
              onExportCsv={handleExportCsv}
            />
          )}

          {loginUser.role === 'admin' && activePage === 'employee' && (
            <AddEmployeeForm
              activeEmployees={activeEmployees}
              deletedEmployees={deletedEmployees}
              editingEmployeeId={editingEmployeeId}
              employeeEditForm={employeeEditForm}
              onRestoreEmployee={handleRestoreEmployee}
              onDeleteEmployee={handleDeleteEmployee}
              onStartEditEmployee={handleStartEditEmployee}
              onCancelEditEmployee={handleCancelEditEmployee}
              onEmployeeEditFormChange={setEmployeeEditForm}
              onSaveEmployee={handleSaveEmployee}
            />
          )}

          {loginUser.role === 'admin' && activePage === 'approval' && (
            <ApprovalManagement
              monthlyRequests={monthlyRequests}
              employees={employees}
              onApproveMonthlyRequest={handleApproveMonthlyRequest}
              onRejectMonthlyRequest={handleRejectMonthlyRequest}
            />
          )}

          {loginUser.role === 'admin' && activePage === 'registerApproval' && (
            <RegisterRequestManagement
              registerRequests={registerRequests}
              onApproveRegisterRequest={handleApproveRegisterRequest}
              onRejectRegisterRequest={handleRejectRegisterRequest}
            />
          )}

          {loginUser.role === 'admin' && activePage === 'paidLeaveApproval' && (
            <PaidLeaveApprovalManagement
              paidLeaveRequests={paidLeaveRequests}
              employees={employees}
              onApprovePaidLeaveRequest={handleApprovePaidLeaveRequest}
              onRejectPaidLeaveRequest={handleRejectPaidLeaveRequest}
            />
          )}
        </div>
      </div>
    </main>
  )
}