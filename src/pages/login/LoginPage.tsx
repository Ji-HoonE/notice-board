import LoginForm from '@/features/login/ui/LoginForm'

const LoginPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">로그인</h1>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <LoginForm />
                </div>
            </div>
        </div>
    )
}

export default LoginPage