import { createQueryKeys } from "@lukemorales/query-key-factory"

/**
 * @description 차트 쿼리 키
 */
export const chartQueryKeys = createQueryKeys('chart', {
    weeklyMoodTrend: () => ["weekly-mood-trend"],
    weeklyWorkoutTrend: () => ["weekly-workout-trend"],
    popularSnackBrands: () => ["popular-snack-brands"],
    topCoffeeBrands: () => ["top-coffee-brands"],
    coffeeConsumption: () => ["coffee-consumption"],
    snackImpact: () => ["snack-impact"],
})