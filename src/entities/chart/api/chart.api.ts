import { ApiHelper } from "@/shared/api/api.base"

import { API_PATH } from "@/shared/constants/path.constants"
import type { ICoffeeConsumptionResponse, IPopularSnackBrandResponse, ISnackImpactResponse, ITopCoffeeBrandResponse, IWeeklyMoodTrendResponse, IWeeklyWorkoutTrendResponse } from "../model/chart.type"

/**
 * @description 차트 API
 */
export const chartApi = {
    getMockTopCoffeeBrands: async () => {
        const response = await ApiHelper.get<ITopCoffeeBrandResponse[]>(API_PATH.MOCK_TOP_COFFEE_BRANDS)
        return response
    },
    getMockPopularSnackBrands: async () => {
        const response = await ApiHelper.get<IPopularSnackBrandResponse[]>(API_PATH.MOCK_POPULAR_SNACK_BRANDS)
        return response
    },
    getMockWeeklyMoodTrend: async () => {
        const response = await ApiHelper.get<IWeeklyMoodTrendResponse[]>(API_PATH.MOCK_WEEKLY_MOOD_TREND)
        return response
    },
    getMockWeeklyWorkoutTrend: async () => {
        const response = await ApiHelper.get<IWeeklyWorkoutTrendResponse[]>(API_PATH.MOCK_WEEKLY_WORKOUT_TREND)
        return response
    },
    getMockCoffeeConsumption: async () => {
        const response = await ApiHelper.get<ICoffeeConsumptionResponse>(API_PATH.MOCK_COFFEE_CONSUMPTION)
        return response
    },
    getMockSnackImpact: async () => {
        const response = await ApiHelper.get<ISnackImpactResponse>(API_PATH.MOCK_SNACK_IMPACT)
        return response
    }
}