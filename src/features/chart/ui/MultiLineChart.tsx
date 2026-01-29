import * as d3 from "d3"
import { useEffect, useRef } from "react"

import ChartLegend from "@/features/chart/ui/ChartLegend"
import useChartLegend from "../hooks/useChartLegend"

export type MetricSide = "left" | "right"

export interface IMetricConfig {
    key: string
    label: string
    side: MetricSide
    stroke: "solid" | "dashed"
    marker: "circle" | "square"
}

export interface IMultiMetricPoint {
    x: number
    teams: Record<string, Record<string, number>>
}

interface IMultiLineChartProps {
    width?: number
    height?: number
    data: IMultiMetricPoint[]
    metrics: IMetricConfig[]
    xLabel: string
    teamColors?: string[]
}


/**
 * @description 멀티라인 차트 컴포넌트
 */
const MultiLineChart = ({
    width = 640,
    height = 380,
    data,
    metrics,
    xLabel,
}: IMultiLineChartProps) => {
    const svgRef = useRef<SVGSVGElement | null>(null)
    const tooltipRef = useRef<HTMLDivElement | null>(null)

    const teams =
        data.length > 0 ? Object.keys(data[0]!.teams) : []

    const {
        legendItems,
        visibleKeys: visibleTeams,
        handleColorChange,
        handleVisibilityChange,
    } = useChartLegend({
        items: teams.map((t) => ({ id: t, label: t })),
    })

    /** 차트 그리기 */
    useEffect(() => {
        if (!svgRef.current || !tooltipRef.current || data.length === 0)
            return

        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove()

        const tooltip = d3.select(tooltipRef.current)
        tooltip.style("display", "none")

        const colorByTeam = new Map(
            legendItems.map((l) => [l.id, l.color]),
        )

        const margin = { top: 40, right: 60, bottom: 50, left: 60 }
        const innerWidth = width - margin.left - margin.right
        const innerHeight = height - margin.top - margin.bottom

        const container = svg
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr(
                "transform",
                `translate(${margin.left},${margin.top})`,
            )
        const x = d3
            .scaleLinear()
            .domain(d3.extent(data, (d) => d.x) as [number, number])
            .range([0, innerWidth])
            .nice()
        const getExtent = (side: MetricSide) => {
            let min = Infinity
            let max = -Infinity
            data.forEach((d) => {
                visibleTeams.forEach((team) => {
                    metrics
                        .filter((m) => m.side === side)
                        .forEach((m) => {
                            const v = d.teams[team]?.[m.key]
                            if (v != null) {
                                min = Math.min(min, v)
                                max = Math.max(max, v)
                            }
                        })
                })
            })
            if (min === Infinity) return [0, 100]
            return [min, max]
        }
        const yLeft = d3
            .scaleLinear()
            .domain(getExtent("left"))
            .range([innerHeight, 0])
            .nice()
        const yRight = d3
            .scaleLinear()
            .domain(getExtent("right"))
            .range([innerHeight, 0])
            .nice()
        container
            .append("g")
            .attr("transform", `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x))

        container.append("g").call(d3.axisLeft(yLeft))
        container
            .append("g")
            .attr("transform", `translate(${innerWidth},0)`)
            .call(d3.axisRight(yRight))
        visibleTeams.forEach((team) => {
            const color = colorByTeam.get(team) ?? "#64748b"
            metrics.forEach((metric) => {
                const yScale =
                    metric.side === "left" ? yLeft : yRight
                const line = d3
                    .line<IMultiMetricPoint>()
                    .defined(
                        (d) =>
                            d.teams[team]?.[metric.key] != null,
                    )
                    .x((d) => x(d.x))
                    .y((d) =>
                        yScale(d.teams[team]![metric.key]!),
                    )

                container
                    .append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", color)
                    .attr("stroke-width", 2)
                    .attr(
                        "stroke-dasharray",
                        metric.stroke === "dashed"
                            ? "4,4"
                            : "",
                    )
                    .attr("d", line)
                data.forEach((d) => {
                    const value = d.teams[team]?.[metric.key]
                    if (value == null) return

                    const g = container
                        .append("g")
                        .attr(
                            "transform",
                            `translate(${x(d.x)},${yScale(
                                value,
                            )})`,
                        )

                    if (metric.marker === "circle") {
                        g.append("circle")
                            .attr("r", 4)
                            .attr("fill", color)
                            .attr("stroke", "white")
                    } else {
                        g.append("rect")
                            .attr("x", -4)
                            .attr("y", -4)
                            .attr("width", 8)
                            .attr("height", 8)
                            .attr("fill", color)
                            .attr("stroke", "white")
                    }

                    g.append("rect")
                        .attr("x", -12)
                        .attr("y", -12)
                        .attr("width", 24)
                        .attr("height", 24)
                        .attr("fill", "transparent")
                        .on("mouseenter", (event) => {
                            const teamData = d.teams[team]
                            const metricLines = metrics
                                .map(
                                    (m) =>
                                        `${m.label}: ${teamData?.[m.key] ?? "-"}`,
                                )
                                .join("<br/>")
                            tooltip
                                .style("display", "block")
                                .style("left", `${event.clientX + 10}px`)
                                .style("top", `${event.clientY + 10}px`)
                                .html(`${xLabel}: ${d.x}<br/>${metricLines}`)
                        })
                        .on("mouseleave", () =>
                            tooltip.style("display", "none"),
                        )
                })
            })
        })
    }, [data, metrics, legendItems, visibleTeams, width, height, xLabel])

    return (
        <div className="relative bg-white p-4 rounded-lg shadow">
            <svg ref={svgRef} />
            <div
                ref={tooltipRef}
                className="fixed z-50 rounded bg-gray-900 px-2 py-1.5 text-xs text-white"
                style={{ display: "none" }}
            />
            <ChartLegend
                items={legendItems}
                onVisibilityChange={handleVisibilityChange}
                onColorChange={handleColorChange}
            />
        </div>
    )
}
export default MultiLineChart