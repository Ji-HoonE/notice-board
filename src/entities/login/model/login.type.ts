
/**
 * @description 로그인 요청 인터페이스
 */
export interface ILoginRequest {
    email: string
    password: string
}

export interface ILoginResponse {
    token: string
    user: IUser
}

interface IUser {
    id: string
    email: string
}