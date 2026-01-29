import ChartList from "@/features/chart/ui/ChartList"
import ChartLoadingFallback from "@/features/chart/ui/ChartLoadingFallback"
import { Suspense } from "react"

/**
 * @description 차트 페이지 컴포넌트
 */
const ChartsPage = () => {
    return (
        <Suspense fallback={<ChartLoadingFallback />}>
            <ChartList />
        </Suspense>
    )
}

export default ChartsPage
