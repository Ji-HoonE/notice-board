import { Link, useLocation, useNavigate } from 'react-router'
import { AiOutlineDashboard, AiOutlineFileText } from 'react-icons/ai'
import { useCommonAction } from '@/shared/model/common.store'
import { ROUTER_PATH } from '@/shared/constants/path.constants'
import type { ReactNode } from 'react'

interface AdminLayoutProps {
    children: ReactNode
}

const SideMenuLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { removeToken } = useCommonAction()

    const menuItems = [
        { path: ROUTER_PATH.POSTS, label: '게시판', icon: AiOutlineFileText },
        { path: ROUTER_PATH.CHARTS, label: '차트', icon: AiOutlineDashboard },
    ]

    const handleLogout = () => {
        removeToken()
        navigate(ROUTER_PATH.LOGIN)
    }

    const currentPageLabel = menuItems.find((item) => item.path === location.pathname)?.label || ''

    return (
        <div className="min-h-screen">
            <div className="flex">
                <aside
                    className="w-64 bg-gray-900 shadow-sm border-r border-gray-800 min-h-screen"
                    aria-label="사이드 네비게이션"
                >
                    <div className="px-6 py-4 border-b border-gray-800 h-16 flex items-center">
                        <h1 className="text-xl font-bold text-white">메뉴</h1>
                    </div>
                    <nav
                        className="p-4"
                        aria-label="주요 메뉴"
                    >
                        <ul className="space-y-2" role="list">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path
                                return (
                                    <li key={item.path} role="listitem">
                                        <Link
                                            to={item.path}
                                            aria-current={isActive ? 'page' : undefined}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                                ? 'bg-gray-700 text-white font-medium'
                                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                                }`}
                                        >
                                            <item.icon className="w-5 h-5" aria-hidden="true" />
                                            <span>{item.label}</span>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul>
                    </nav>
                </aside>
                <div className="flex-1 flex flex-col">
                    <header
                        className="bg-white shadow-sm border-b border-gray-200 h-16"
                        role="banner"
                    >
                        <div className="px-6 h-full flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {currentPageLabel}
                            </h2>
                            <button
                                onClick={handleLogout}
                                aria-label="로그아웃"
                                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                로그아웃
                            </button>
                        </div>
                    </header>
                    <main
                        className="flex-1 overflow-hidden p-6 flex flex-col min-h-0"
                        role="main"
                        aria-label={currentPageLabel}
                    >
                        <div className="flex-1 flex flex-col min-h-0">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default SideMenuLayout
