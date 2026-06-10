import { useState } from 'react'
import type { RegisterRequest } from '../types/RegisterRequest'
import type { LoginUser } from '../types/User'

type Props = {
    users: LoginUser[]
    onLogin: (user: LoginUser) => void
    onRegisterRequest: (request: RegisterRequest) => void
}

export default function LoginPage({ users, onLogin, onRegisterRequest }: Props) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [isRegisterMode, setIsRegisterMode] = useState(false)

    const [registerName, setRegisterName] = useState('')
    const [registerDepartment, setRegisterDepartment] = useState('')
    const [registerEmail, setRegisterEmail] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')

    const handleLogin = () => {
        const user = users.find(
            (user) => user.email === email && user.password === password,
        )

        if (user === undefined) {
            alert('メールアドレスまたはパスワードが違います')
            return
        }

        onLogin(user)
    }

    const handleSubmitRegisterRequest = () => {
        if (registerName.trim() === '') {
            alert('名前を入力してください')
            return
        }

        if (registerDepartment.trim() === '') {
            alert('部署を入力してください')
            return
        }

        if (registerEmail.trim() === '') {
            alert('メールアドレスを入力してください')
            return
        }

        if (registerPassword.trim() === '') {
            alert('パスワードを入力してください')
            return
        }

        const newRequest: RegisterRequest = {
            id: Date.now(),
            name: registerName.trim(),
            department: registerDepartment.trim(),
            email: registerEmail.trim(),
            password: registerPassword,
            status: '申請中',
            requestedAt: new Date().toLocaleString(),
        }

        onRegisterRequest(newRequest)

        setRegisterName('')
        setRegisterDepartment('')
        setRegisterEmail('')
        setRegisterPassword('')
        setIsRegisterMode(false)
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <h1>勤怠管理アプリ</h1>

                {!isRegisterMode ? (
                    <>
                        <p>ログインしてください</p>

                        <div className="form-group">
                            <label>メールアドレス</label>
                            <input
                                type="email"
                                value={email}
                                placeholder="admin@example.com"
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>パスワード</label>
                            <input
                                type="password"
                                value={password}
                                placeholder="password"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>

                        <button type="button" className="primary-button" onClick={handleLogin}>
                            ログイン
                        </button>

                        <div className="login-demo-info">
                            <p>管理者：admin@example.com / password</p>
                            <p>社員：yamada@example.com / password</p>
                        </div>

                        <button
                            type="button"
                            className="link-button"
                            onClick={() => setIsRegisterMode(true)}
                        >
                            新規登録はこちら
                        </button>
                    </>
                ) : (
                    <>
                        <p>新規登録申請</p>

                        <div className="register-form-box">
                            <div className="form-group">
                                <label>名前</label>
                                <input
                                    type="text"
                                    value={registerName}
                                    placeholder="山田太郎"
                                    onChange={(event) => setRegisterName(event.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>部署</label>
                                <input
                                    type="text"
                                    value={registerDepartment}
                                    placeholder="営業部"
                                    onChange={(event) => setRegisterDepartment(event.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>メールアドレス</label>
                                <input
                                    type="email"
                                    value={registerEmail}
                                    placeholder="yamada@example.com"
                                    onChange={(event) => setRegisterEmail(event.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>パスワード</label>
                                <input
                                    type="password"
                                    value={registerPassword}
                                    placeholder="password"
                                    onChange={(event) => setRegisterPassword(event.target.value)}
                                />
                            </div>

                            <button
                                type="button"
                                className="primary-button"
                                onClick={handleSubmitRegisterRequest}
                            >
                                登録申請する
                            </button>

                            <button
                                type="button"
                                className="link-button"
                                onClick={() => setIsRegisterMode(false)}
                            >
                                ログイン画面に戻る
                            </button>
                        </div>
                    </>
                )}
            </section>
        </main>
    )
}