import { useMemo, useState } from "react"
import { loginSchema, type LoginFormData } from "../model/login.type"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLoginMutation } from "@/entities/login/query/login.query"
import { useNavigate } from "react-router"
import { useCommonAction } from "@/shared/model/common.store"
import { ROUTER_PATH } from "@/shared/constants/path.constants"
import { AxiosError } from "axios"


/**
 * @description 로그인 커스텀 훅
 */
const useLogin = () => {
    const navigate = useNavigate()
    const { mutateAsync, isPending } = useLoginMutation()
    const { setToken } = useCommonAction()

    const [showPassword, setShowPassword] = useState(false)

    const {
        register,
        handleSubmit: handleFormSubmit,
        formState: { errors, isValid, touchedFields },
        setError
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
        },
    })
    /** 로그인 폼 제출 핸들러 */
    const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
        try {
            const res = await mutateAsync(data)
            setToken(res.token)
            navigate(ROUTER_PATH.POSTS)
        } catch (error) {
            let errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.'
            if (error instanceof AxiosError) {
                if (error.response?.status === 401) {
                    const serverMessage = error.response?.data?.message || error.message
                    if (serverMessage === 'Invalid credentials' || serverMessage.includes('Invalid credentials')) {
                        errorMessage = '일치하는 회원정보가 없습니다.'
                    }
                }
            } else if (error instanceof Error) {
                errorMessage = error.message
            }
            setError('root.loginError', {
                type: 'server',
                message: errorMessage,
            })
        }
    }

    /** 비밀번호 보기 핸들러 */
    const handleShowPassword = () => {
        setShowPassword((prev) => !prev)
    }

    /** 폼 유효성 및 로딩 상태를 함께 고려한 최종 유효성 */
    const isFormValid = useMemo(() => {
        return isValid && !isPending
    }, [isValid, isPending])


    return {
        register,
        handleSubmit: handleFormSubmit(onSubmit),
        errors,
        isFormValid,
        touchedFields,
        showPassword,
        handleShowPassword,
    }
}

export default useLogin