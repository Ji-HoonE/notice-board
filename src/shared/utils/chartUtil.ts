export class ChartUtil {
    /**
    * 배열 데이터에서 지정한 숫자 키들만 합산해 도넛 차트용 { label, value }[] 반환
    * @param data 객체 배열 (예: 주간 무드 데이터)
    * @param valueKeys 합산할 키 목록 (예: ['happy', 'tired', 'stressed'])
    */
    static aggregateForDonut<T extends object>(
        data: T[],
        valueKeys: (keyof T)[],
    ): { label: string; value: number }[] {
        const sums: Record<string, number> = {}
        for (const key of valueKeys) {
            sums[key as string] = 0
        }
        for (const row of data) {
            for (const key of valueKeys) {
                sums[key as string] += Number(row[key] ?? 0)
            }
        }
        return valueKeys.map((key) => ({
            label: String(key),
            value: sums[key as string],
        }))
    }
    /**
     * 객체 배열을 도넛 차트용 { label, value }[] 반환
     * @param data 객체 배열
     * @param labelKey 라벨 키
     * @param valueKey 값 키
     */
    static mapToDonutData<T extends object>(
        data: T[],
        labelKey: keyof T,
        valueKey: keyof T,
    ): { label: string; value: number }[] {
        return data.map((row) => ({
            label: String(row[labelKey]),
            value: Number(row[valueKey]),
        }))
    }

    /**
     * 그룹별 시리즈 데이터를 멀티라인 차트용 { x, teams }[] 로 변환
     * @param config.groups 그룹 배열 (예: departments, teams)
     * @param config.groupNameKey 그룹 이름 키 (예: 'name', 'team')
     * @param config.rowsKey 행 배열 키 (예: 'metrics', 'series')
     * @param config.xKey x축 값 키 (예: 'snacks', 'cups')
     * @param config.metricKeys 메트릭 키. 문자열이면 동일 키, { in, out } 이면 출력 키 변경
     */
    static toMultiMetric<T extends Record<string, unknown>>(config: {
        groups: T[]
        groupNameKey: keyof T
        rowsKey: keyof T
        xKey: string
        metricKeys: (string | { in: string; out: string })[]
    }): { x: number; teams: Record<string, Record<string, number>> }[] {
        type Entry = { teams: Record<string, Record<string, number>> }
        const map = new Map<number, Entry>()
        const { groups, groupNameKey, rowsKey, xKey, metricKeys } = config

        for (const group of groups) {
            const name = String(group[groupNameKey])
            const rows = (group[rowsKey] as Record<string, unknown>[]) ?? []
            for (const row of rows) {
                const xVal = Number(row[xKey])
                if (!map.has(xVal)) {
                    map.set(xVal, { teams: {} })
                }
                const entry = map.get(xVal)!
                if (!entry.teams[name]) {
                    entry.teams[name] = {} as Record<string, number>
                }
                const teamEntry = entry.teams[name]!
                for (const m of metricKeys) {
                    const [inKey, outKey] =
                        typeof m === "string" ? [m, m] : [m.in, m.out]
                    teamEntry[outKey] = Number(
                        (row as Record<string, unknown>)[inKey] ?? 0,
                    )
                }
            }
        }
        return Array.from(map.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([x, v]) => ({ x, teams: v.teams }))
    }
}