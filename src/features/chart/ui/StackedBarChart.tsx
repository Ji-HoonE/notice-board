import * as d3 from "d3"
import { useEffect, useRef } from "react"

import ChartLegend from "@/features/chart/ui/ChartLegend"
import useChartLegend from "../hooks/useChartLegend"

export interface IStackedSeries {
    key: string
    label: string
}

interface IStackedBarChartProps<T extends object> {
    width?: number
    height?: number
    data: T[]
    xKey: keyof T
    series: IStackedSeries[]
}

/**
 * @description 스택드 바 차트 컴포넌트
 */
const StackedBarChart = <T extends object>({
    width = 560,
    height = 320,
    data,
    xKey,
    series,
}: IStackedBarChartProps<T>) => {
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

        const x = d3
            .scaleBand<string>()
            .domain(data.map((d) => String(d[xKey])))
            .range([0, innerWidth])
            .paddingInner(0.2)

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
                .text("표시할 항목이 없습니다.")
            return
        }

        const rows = data.map((row) => {
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
            return { ...row, __x: String(row[xKey]), ...obj } as Record<
                string,
                number | string
            >
        })

        const stack = d3
            .stack<Record<string, number | string>, string>()
            .keys(activeSeries.map((s) => s.key))
            .value((d, k) => Number(d[k]) || 0)
            .order(d3.stackOrderNone)
            .offset(d3.stackOffsetNone)

        const layers = stack(rows as unknown as Record<string, number | string>[])

        const groups = container
            .append("g")
            .selectAll("g")
            .data(layers)
            .enter()
            .append("g")
            .attr("fill", (d) => colorByKey.get(d.key) ?? "#64748b")

        groups
            .selectAll("rect")
            .data((d) => d)
            .enter()
            .append("rect")
            .attr("x", (d) => x(String(d.data.__x)) ?? 0)
            .attr("y", (d) => y(Number(d[1])))
            .attr("height", (d) =>
                Math.max(0, y(Number(d[0])) - y(Number(d[1]))),
            )
            .attr("width", x.bandwidth())
            .attr("rx", 2)
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

export default StackedBarChart
