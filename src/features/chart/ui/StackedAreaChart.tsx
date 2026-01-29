import * as d3 from "d3"
import { useEffect, useRef } from "react"

import ChartLegend from "@/features/chart/ui/ChartLegend"
import useChartLegend from "../hooks/useChartLegend"

export interface StackedSeries {
    key: string
    label: string
}
type StackRow = {
    __x: string
} & {
    [key: string]: number | string
}

interface StackedAreaChartProps<T extends object> {
    width?: number
    height?: number
    data: T[]
    xKey: keyof T
    series: StackedSeries[]
}

/**
 * @description 스택드 영역 차트 컴포넌트
 */
const StackedAreaChart = <T extends object>({
    width = 560,
    height = 320,
    data,
    xKey,
    series,
}: StackedAreaChartProps<T>) => {
    const svgRef = useRef<SVGSVGElement | null>(null)

    const {
        legendItems,
        visibleKeys,
        handleColorChange,
        handleVisibilityChange,
    } = useChartLegend({
        items: series.map((s) => ({ id: s.key, label: s.label })),
    })

    const activeSeries = series.filter((s) => visibleKeys.includes(s.key))

    /** 차트 그리기 */
    useEffect(() => {
        if (!svgRef.current || data.length === 0) return

        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove()

        const colorByKey = new Map(legendItems.map((i) => [i.id, i.color]))

        const margin = { top: 40, right: 24, bottom: 48, left: 48 }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom

        const xDomain = data.map((d) => String(d[xKey]))
        const x = d3
            .scalePoint<string>()
            .domain(xDomain)
            .range([0, innerWidth])
            .padding(0.2)

        const y = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0])

        const container = svg
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        const xAxis = d3
            .axisBottom(x)
            .tickFormat((v) =>
                String(v),
            )
        container
            .append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(xAxis)
            .selectAll("text")
            .style("font-size", "11px")
            .attr("transform", "rotate(-20)")
            .style("text-anchor", "end")

        const yAxis = d3
            .axisLeft(y)
            .ticks(5)
            .tickFormat((d) => `${d}%`)
        container.append("g").call(yAxis).selectAll("text").style("font-size", "11px")

        if (activeSeries.length === 0) {
            container
                .append("text")
                .attr("x", innerWidth / 2)
                .attr("y", innerHeight / 2)
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("fill", "#94a3b8")
                .text("표시할 항목이 없습니다. 범례에서 보기를 켜 주세요.")
            return
        }

        const rows: StackRow[] = data.map((row) => {
            const raw = activeSeries.map((s) =>
                Number((row as Record<string, unknown>)[s.key] ?? 0),
            )
            const total = raw.reduce((a, b) => a + b, 0)
            const pcts =
                total > 0
                    ? raw.map((v) => (v / total) * 100)
                    : raw.map(() => 100 / activeSeries.length)
            const obj: Record<string, number> = {}
            activeSeries.forEach((s, i) => {
                obj[s.key] = pcts[i]!
            })
            return {
                __x: String(row[xKey]),
                ...obj,
            }
        })

        const stack = d3
            .stack<StackRow, string>()
            .keys(activeSeries.map((s) => s.key))
            .order(d3.stackOrderAppearance)
            .offset(d3.stackOffsetNone)

        const layers = stack(rows)

        const area = d3
            .area<d3.SeriesPoint<StackRow>>()
            .x((d) => x(d.data.__x) ?? 0)
            .y0((d) => y(d[0]))
            .y1((d) => y(d[1]))
            .curve(d3.curveMonotoneX)

        const layersToRender = [...layers].reverse()

        container
            .selectAll<SVGPathElement, d3.Series<StackRow, string>>("path.area")
            .data(layersToRender, (d) => d.key)
            .join("path")
            .attr("class", "area")
            .attr("fill", (d) => colorByKey.get(d.key) ?? "#64748b")
            .attr("opacity", 0.85)
            .attr("d", area)
    }, [
        data,
        height,
        legendItems,
        activeSeries,
        series,
        width,
        xKey,
    ])

    return (
        <div className="bg-white shadow-sm rounded-lg p-4">
            <svg ref={svgRef} />
            <ChartLegend
                items={legendItems}
                onColorChange={handleColorChange}
                onVisibilityChange={handleVisibilityChange}
            />
        </div>
    )
}

export default StackedAreaChart
