import { chartApi } from "@/entities/chart/api/chart.api"
import {
    useSuspenseQueries,
} from "@tanstack/react-query"
import { chartQueryKeys } from "../model/chart.queryKey"

/**
 * @description 모든 차트 조회 쿼리
 */
const allChartsQueries = [
    {
        queryKey: chartQueryKeys.weeklyMoodTrend().queryKey,
        queryFn: () => chartApi.getMockWeeklyMoodTrend(),
    },
    {
        queryKey: chartQueryKeys.popularSnackBrands().queryKey,
        queryFn: () => chartApi.getMockPopularSnackBrands(),
    },
    {
        queryKey: chartQueryKeys.topCoffeeBrands().queryKey,
        queryFn: () => chartApi.getMockTopCoffeeBrands(),
    },
    {
        queryKey: chartQueryKeys.weeklyWorkoutTrend().queryKey,
        queryFn: () => chartApi.getMockWeeklyWorkoutTrend(),
    },
    {
        queryKey: chartQueryKeys.coffeeConsumption().queryKey,
        queryFn: () => chartApi.getMockCoffeeConsumption(),
    },
    {
        queryKey: chartQueryKeys.snackImpact().queryKey,
        queryFn: () => chartApi.getMockSnackImpact(),
    },
] as const

/**
 * @description 모든 차트 조회 쿼리
 */
export const useAllChartsSuspenseQuery = () => {
    const results = useSuspenseQueries({ queries: allChartsQueries })
    const data = {
        weeklyMoodTrend: results[0].data,
        popularSnackBrands: results[1].data,
        topCoffeeBrands: results[2].data,
        weeklyWorkoutTrend: results[3].data,
        coffeeConsumption: results[4].data,
        snackImpact: results[5].data,
    }
    return { data }
}


