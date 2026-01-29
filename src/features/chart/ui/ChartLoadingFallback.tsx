/**
 * @description 차트 로딩 스켈레톤 컴포넌트
 */
const ChartLoadingFallback = () => {
    return (
        <div className="flex min-h-[calc(100vh-6rem)] w-full flex-col items-center justify-center gap-4">
            <div
                className="size-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#0ea5e9]"
                role="status"
                aria-label="로딩 중"
            />
            <p className="text-sm font-medium text-gray-500">
                차트 데이터 로딩 중...
            </p>
        </div>
    )
}

export default ChartLoadingFallback