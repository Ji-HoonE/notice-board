import { useMutation } from "@tanstack/react-query"
import { loginApi } from "@/entities/login/api/loginApi"

/**
 * @description 로그인 뮤테이션
 */
export const useLoginMutation = () => {
    return useMutation({
        mutationFn: loginApi.login,
    })
}