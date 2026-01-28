import cn from 'classnames';
import useLogin from '../hooks/useLogin'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        errors,
        isFormValid,
        touchedFields,
        showPassword,
        handleShowPassword,
    } = useLogin()

    const emailError = errors.email
    const isEmailTouched = touchedFields.email
    const loginError = errors.root?.loginError

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6" noValidate>
            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    이메일
                </label>
                <input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    aria-invalid={isEmailTouched && !!emailError}
                    aria-describedby={emailError ? 'email-error' : undefined}
                    className={cn(
                        "w-full px-4 py-3 border rounded-lg focus:outline-none transition-all",
                        isEmailTouched && emailError
                            ? "border-error-500 focus:border-error-500"
                            : "border-gray-300 focus:border-blue-500"
                    )}
                    {...register('email')}
                />
                {isEmailTouched && emailError && (
                    <p id="email-error" role="alert" className="text-sm text-error-600 mt-1">
                        {emailError.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    비밀번호
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="비밀번호를 입력하세요"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-all pr-12"
                        {...register('password')}
                    />
                    <button
                        type="button"
                        onClick={handleShowPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                        aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    >
                        {showPassword ? (
                            <AiOutlineEyeInvisible className="w-5 h-5" />
                        ) : (
                            <AiOutlineEye className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
            {loginError && (
                <p id="login-error" role="alert" className="text-sm text-error-600 mt-1">
                    {loginError.message}
                </p>
            )}
            <button
                type="submit"
                disabled={!isFormValid}
                className={cn(
                    "w-full py-3 px-4 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors",
                    isFormValid
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                )}
            >
                로그인
            </button>
        </form>
    )
}

export default LoginForm