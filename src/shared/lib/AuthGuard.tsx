import { Navigate, Outlet } from 'react-router'
import { useCommonStore } from '@/shared/model/common.store'
import { ROUTER_PATH } from '@/shared/constants/path.constants'
import SideMenuLayout from '@/shared/ui/layout/SideMenuLayout'

/**
 * @description 토큰 기반 인증 가드 컴포넌트
 * 토큰이 없으면 로그인 페이지로 리다이렉트
 * 인증된 경우 사이드 메뉴 레이아웃과 함께 children을 렌더링
 */
const AuthGuard = () => {
    const token = useCommonStore((state) => state.token)
    const hydrated = useCommonStore.persist.hasHydrated()

    if (!hydrated) return null
    if (!token) return <Navigate to={ROUTER_PATH.LOGIN} replace />

    return (
        <SideMenuLayout>
            <Outlet />
        </SideMenuLayout>
    )
}

export default AuthGuard