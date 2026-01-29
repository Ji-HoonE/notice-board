import * as d3 from "d3"
import { useEffect, useRef } from "react"

import ChartLegend from "@/features/chart/ui/ChartLegend"
import useChartLegend from "../hooks/useChartLegend"

export interface IBarSeries {
    key: string
    label: string
}

interface IBarChartProps<T> {
    width?: number
    height?: number
    data: T[]
    xKey: keyof T
    series: IBarSeries[]
}

/**
 * @description 바 차트 컴포넌트
 */
const BarChart = <T extends object>({
    width = 500,
    height = 200,
    data,
    xKey,
    series,
}: IBarChartProps<T>) => {
    const svgRef = useRef<SVGSVGElement | null>(null)

    const {
        legendItems,
        visibleKeys,
        handleColorChange,
        handleVisibilityChange,
    } = useChartLegend({
        items: series.map((s) => ({ id: s.key, label: s.label })),
    })

    /** 차트 그리기 */
    useEffect(() => {
        if (!svgRef.current || data.length === 0) return

        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove()

        const colorByKey = new Map(
            legendItems.map((i) => [i.id, i.color]),
        )

        const margin = { top: 40, right: 24, bottom: 48, left: 48 }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom

        const x0 = d3
            .scaleBand<string>()
            .domain(data.map((d) => String(d[xKey])))
            .range([0, innerWidth])
            .paddingInner(0.2)

        const activeSeries = series.filter((s) => visibleKeys.includes(s.key))
        if (activeSeries.length === 0) {
            svg
                .attr("viewBox", `0 0 ${width} ${height}`)
                .append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .style("font-size", "14px")
                .style("fill", "#94a3b8")
                .text("표시할 항목이 없습니다.")
            return
        }

        const x1 = d3
            .scaleBand<string>()
            .domain(activeSeries.map((s) => s.key))
            .range([0, x0.bandwidth()])
            .padding(0.1)

        const y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(data, (d) =>
                    d3.max(
                        activeSeries,
                        (s) => Number((d as Record<string, unknown>)[s.key] ?? 0),
                    ),
                ) || 0,
            ])
            .nice()
            .range([innerHeight, 0])

        const container = svg
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        const xAxis = d3
            .axisBottom(x0)
            .tickFormat((value) =>
                String(value),
            )

        container
            .append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(xAxis)
            .selectAll("text")
            .style("font-size", "11px")
            .attr("transform", "rotate(-20)")
            .style("text-anchor", "end")

        const yAxis = d3.axisLeft(y).ticks(6).tickFormat((d) => `${d}`)

        container
            .append("g")
            .call(yAxis)
            .selectAll("text")
            .style("font-size", "11px")

        const groups = container
            .append("g")
            .selectAll<SVGGElement, T>("g")
            .data(data)
            .enter()
            .append("g")
            .attr(
                "transform",
                (d: T) => `translate(${x0(String(d[xKey])) ?? 0},0)`,
            )

        const rectData = (d: T) =>
            activeSeries.map((s) => ({
                seriesKey: s.key,
                value: Number((d as Record<string, unknown>)[s.key] ?? 0),
            }))

        groups
            .selectAll("rect")
            .data(rectData)
            .enter()
            .append("rect")
            .attr("x", (d: { seriesKey: string; value: number }) =>
                x1(d.seriesKey) ?? 0,
            )
            .attr("y", (d: { seriesKey: string; value: number }) => y(d.value))
            .attr("width", x1.bandwidth())
            .attr(
                "height",
                (d: { seriesKey: string; value: number }) =>
                    innerHeight - y(d.value),
            )
            .attr("fill", (d: { seriesKey: string; value: number }) =>
                colorByKey.get(d.seriesKey) ?? "#64748b",
            )
            .attr("rx", 3)
    }, [
        data,
        height,
        visibleKeys,
        legendItems,
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

export default BarChart
