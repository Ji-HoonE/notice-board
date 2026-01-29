import { useRouteError, useNavigate, isRouteErrorResponse } from 'react-router'
import { ROUTER_PATH } from '@/shared/constants/path.constants'

/**
 * @description 게시판 라우트용 React Router 에러 처리 컴포넌트
 */
const PostErrorBoundary = () => {
    const error = useRouteError()
    const navigate = useNavigate()

    let errorMessage = '게시판을 불러오는 중 문제가 발생했습니다.'
    let errorStatus: number | undefined

    if (isRouteErrorResponse(error)) {
        errorStatus = error.status
        errorMessage = error.statusText || error.data?.message || errorMessage
    } else if (error instanceof Error) {
        errorMessage = error.message
    } else if (typeof error === 'string') {
        errorMessage = error
    }
    const handleGoHome = () => {
        navigate(ROUTER_PATH.POSTS, { replace: true })
    }
    const handleGoBack = () => {
        navigate(-1)
    }
    return (
        <div className="flex items-center justify-center h-full min-h-0 overflow-hidden bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                    <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
                    {errorStatus ? `${errorStatus} 오류` : '오류가 발생했습니다'}
                </h2>
                <p className="text-sm text-gray-600 text-center mb-6">
                    {errorMessage}
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={handleGoBack}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        이전 페이지
                    </button>
                    <button
                        onClick={handleGoHome}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        게시판 페이지
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostErrorBoundary
