/** 주간 무드 트렌드 목업 응답 인터페이스 */
export interface IWeeklyMoodTrendResponse {
    week: string
    happy: number,
    tired: number,
    stressed: number
}

/** 인기 간식 브랜드 분포 목업 응답 인터페이스 */
export interface IPopularSnackBrandResponse {
    name: string
    share: number
}

/** 주간 운동 트렌드 목업 응답 인터페이스 */
export interface IWeeklyWorkoutTrendResponse {
    week: string
    running: number
    cycling: number
    stretching: number
}

/** 인기 커피 브랜드 목업 응답 인터페이스 */
export interface ITopCoffeeBrandResponse {
    brand: string
    popularity: number
}

/** 커피 섭취량 목업 응답 인터페이스 */
export interface ICoffeeConsumptionResponse {
    teams: Array<{
        team: string
        series: Array<{
            cups: number
            bugs: number
            productivity: number
        }>
    }>
}

/** 부서별 간식 영향 목업 응답 인터페이스 */
export interface ISnackImpactResponse {
    departments: Array<{
        name: string
        metrics: Array<{
            snacks: number
            meetingsMissed: number
            morale: number
        }>
    }>
}