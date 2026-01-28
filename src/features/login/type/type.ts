import { z } from 'zod'

/**
 * @description 로그인 폼 밸리데이션 스키마
 */
export const loginSchema = z.object({
    email: z
        .email({ message: "올바른 이메일 형식이 아닙니다" })
        .nonempty("이메일을 입력해주세요"),
    password: z
        .string()
        .min(1, "비밀번호를 입력해주세요"),
})

export type LoginFormData = z.infer<typeof loginSchema>