import { useMemo, useState } from "react"
import type { ChartLegendItem } from "@/features/chart/ui/ChartLegend"
import { BAR_COLORS } from "@/shared/constants/chart.constants"

export interface IUseChartLegendInputItem {
    id: string
    label: string
    suffix?: string
}

export interface IUseChartLegendOptions {
    items: IUseChartLegendInputItem[]
    defaultColors?: string[]
}

type LegendOverrides = Record<string, { color?: string; visible?: boolean }>

/**
 * @description 차트 범례 상태·색상·표시 여부를 관리하는 공통 훅
 */
const useChartLegend = ({
    items,
    defaultColors = BAR_COLORS,
}: IUseChartLegendOptions) => {
    /** 범례 상태 관리 */
    const [overrides, setOverrides] = useState<LegendOverrides>({})

    /** 범례 항목 생성 */
    const legendItems: ChartLegendItem[] = useMemo(
        () =>
            items.map((item, i) => {
                const o = overrides[item.id]
                return {
                    id: item.id,
                    label: item.label,
                    color: o?.color ?? defaultColors[i % defaultColors.length]!,
                    visible: o?.visible ?? true,
                    suffix: item.suffix,
                }
            }),
        [items, overrides, defaultColors],
    )

    /** 표시 중인 항목 id 배열 */
    const visibleKeys = useMemo(
        () => legendItems.filter((i) => i.visible).map((i) => i.id),
        [legendItems],
    )

    /** 색상 변경 핸들러 */
    const handleColorChange = (id: string, color: string) => {
        setOverrides((prev) => ({
            ...prev,
            [id]: { ...prev[id], color },
        }))
    }

    /** 표시 여부 변경 핸들러 */
    const handleVisibilityChange = (id: string, visible: boolean) => {
        setOverrides((prev) => ({
            ...prev,
            [id]: { ...prev[id], visible },
        }))
    }
    return {
        legendItems,
        visibleKeys,
        handleColorChange,
        handleVisibilityChange,
    }
}

export default useChartLegend