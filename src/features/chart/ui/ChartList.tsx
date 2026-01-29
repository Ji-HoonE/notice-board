import BarChart from "@/features/chart/ui/BarChart"
import DonutChart from "@/features/chart/ui/DonutChart"
import MultiLineChart from "@/features/chart/ui/MultiLineChart"
import StackedAreaChart from "@/features/chart/ui/StackedAreaChart"
import StackedBarChart from "@/features/chart/ui/StackedBarChart"
import { useAllChartsSuspenseQuery } from "@/entities/chart/query/chart.query"
import { ChartUtil } from "@/shared/utils/chartUtil"
import { MOOD_SERIES, POPULAR_SNACK_BRANDS_SERIES, WORKOUT_SERIES } from "@/shared/constants/chart.constants"
import type { IWeeklyMoodTrendResponse } from "@/entities/chart/model/chart.type"

const MOOD_VALUE_KEYS = ['happy', 'tired', 'stressed'] as (keyof IWeeklyMoodTrendResponse)[]


/**
 * @description 차트 리스트 컴포넌트
 */
const ChartList = () => {
    const { data } = useAllChartsSuspenseQuery()
    const {
        weeklyMoodTrend,
        popularSnackBrands,
        weeklyWorkoutTrend,
        coffeeConsumption,
        snackImpact,
    } = data

    /** 커피 멀티라인 차트 데이터 */
    const coffeeMultiMetric = ChartUtil.toMultiMetric({
        groups: coffeeConsumption.teams,
        groupNameKey: "team",
        rowsKey: "series",
        xKey: "cups",
        metricKeys: ["bugs", "productivity"],
    })
    /** 스낵 멀티라인 차트 데이터 */
    const snackMultiMetric = ChartUtil.toMultiMetric({
        groups: snackImpact.departments,
        groupNameKey: "name",
        rowsKey: "metrics",
        xKey: "snacks",
        metricKeys: [
            { in: "meetingsMissed", out: "meetingMissed" },
            { in: "morale", out: "morale" },
        ],
    })


    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">차트 데이터</h1>
                <p className="text-gray-600 mt-1">
                    주간 기분 트렌드와 인기 스낵 브랜드를 다양한 차트로 확인해보세요.
                </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        주간 기분 트렌드 - 바 차트
                    </h2>
                    <BarChart
                        data={weeklyMoodTrend || []}
                        xKey="week"
                        series={MOOD_SERIES}
                    />
                </div>
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        주간 기분 트렌드 - 도넛 차트
                    </h2>
                    <DonutChart
                        data={ChartUtil.aggregateForDonut(weeklyMoodTrend, MOOD_VALUE_KEYS,
                        )}
                    />
                </div>
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        인기 스낵 브랜드 점유율 - 바 차트
                    </h2>
                    <BarChart
                        data={popularSnackBrands || []}
                        xKey="name"
                        series={POPULAR_SNACK_BRANDS_SERIES}
                    />
                </div>

                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        인기 스낵 브랜드 점유율 - 도넛 차트
                    </h2>
                    <DonutChart
                        data={ChartUtil.mapToDonutData(
                            popularSnackBrands || [],
                            'name',
                            'share',
                        )}
                    />
                </div>
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        주간 기분 트렌드 - 스택 차트
                    </h2>
                    <StackedBarChart
                        data={weeklyMoodTrend || []}
                        xKey="week"
                        series={MOOD_SERIES}
                    />
                </div>
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        주간 기분 트렌드 - 면적 차트
                    </h2>
                    <StackedAreaChart
                        data={weeklyWorkoutTrend || []}
                        xKey="week"
                        series={MOOD_SERIES}
                    />
                </div>
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        주간 운동 트렌드 - 스택 차트
                    </h2>
                    <StackedBarChart
                        data={weeklyWorkoutTrend || []}
                        xKey="week"
                        series={WORKOUT_SERIES}
                    />
                </div>
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        주간 운동 트렌드 - 면적 차트
                    </h2>
                    <StackedAreaChart
                        data={weeklyWorkoutTrend || []}
                        xKey="week"
                        series={WORKOUT_SERIES}
                    />
                </div>
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        멀티라인 차트 - 팀별 커피 소비/버그/생산성
                    </h2>
                    <MultiLineChart
                        xLabel="커피(잔/일)"
                        data={coffeeMultiMetric}
                        metrics={[
                            { key: "bugs", label: "버그 수", side: "left", stroke: "solid", marker: "circle" },
                            { key: "productivity", label: "생산성", side: "right", stroke: "dashed", marker: "square" },
                        ]}
                    />
                </div>
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-800">
                        멀티라인 차트 - 부서별 간식 영향
                    </h2>
                    <MultiLineChart
                        xLabel="스낵 수"
                        data={snackMultiMetric}
                        metrics={[
                            { key: "meetingMissed", label: "회의불참", side: "left", stroke: "solid", marker: "circle" },
                            { key: "morale", label: "사기", side: "right", stroke: "dashed", marker: "square" },
                        ]}
                    />
                </div>
            </div>
        </div >
    )
}

export default ChartList