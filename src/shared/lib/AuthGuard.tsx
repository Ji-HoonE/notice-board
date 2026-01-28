import { Navigate } from 'react-router'
import { useCommonStore } from '@/shared/model/common.store'
import { ROUTER_PATH } from '@/shared/constants/path.constants'
import type { ReactNode } from 'react'

interface IAuthGuardProps {
    children: ReactNode
}

/**
 * @description 토큰 기반 인증 가드 컴포넌트
 * 토큰이 없으면 로그인 페이지로 리다이렉트
 */
const AuthGuard = ({ children }: IAuthGuardProps) => {
    const token = useCommonStore((state) => state.token)
    const hydrated = useCommonStore.persist.hasHydrated()

    if (!hydrated) return null
    if (!token) return <Navigate to={ROUTER_PATH.LOGIN} replace />

    return children
}

export default AuthGuard