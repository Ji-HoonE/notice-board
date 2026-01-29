import * as d3 from "d3"
import { useEffect, useRef } from "react"

import ChartLegend from "@/features/chart/ui/ChartLegend"
import useChartLegend from "../hooks/useChartLegend"

export interface IDonutChartDatum {
    label: string
    value: number
}

interface IDonutChartProps {
    width?: number
    height?: number
    data: IDonutChartDatum[]
    colors?: string[]
}

/**
 * @description 도넛 차트 컴포넌트
 */
const DonutChart = ({
    width = 800,
    height = 320,
    data,
}: IDonutChartProps) => {
    const svgRef = useRef<SVGSVGElement | null>(null)

    const {
        legendItems,
        visibleKeys,
        handleColorChange,
        handleVisibilityChange,
    } = useChartLegend({
        items: data.map((d) => ({
            id: d.label,
            label: d.label,
            suffix: ` (${d.value}%)`,
        })),
    })
    /** 차트 그리기 */
    useEffect(() => {
        if (!svgRef.current || data.length === 0) return

        const svg = d3.select(svgRef.current)
        svg.selectAll("*").remove()

        const colorByLabel = new Map(
            legendItems.map((i) => [i.id, i.color]),
        )
        const visiblePieData = data.filter((d) => visibleKeys.includes(d.label))

        const radius = Math.min(width, height) / 2 - 20

        const container = svg
            .attr("viewBox", `0 0 ${width} ${height}`)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`)

        if (visiblePieData.length === 0) {
            container
                .append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "0.35em")
                .style("font-size", "14px")
                .style("fill", "#94a3b8")
                .text("표시할 항목이 없습니다.")
            return
        }

        const pie = d3
            .pie<IDonutChartDatum>()
            .sort(null)
            .value((d) => d.value)

        const arc = d3
            .arc<d3.PieArcDatum<IDonutChartDatum>>()
            .innerRadius(radius * 0.6)
            .outerRadius(radius)

        const arcs = container
            .selectAll<SVGPathElement, d3.PieArcDatum<IDonutChartDatum>>("path")
            .data(pie(visiblePieData))
            .enter()

        arcs
            .append("path")
            .attr("d", (d: d3.PieArcDatum<IDonutChartDatum>) => arc(d)!)
            .attr(
                "fill",
                (d: d3.PieArcDatum<IDonutChartDatum>) =>
                    colorByLabel.get(d.data.label) ?? "#64748b",
            )
            .attr("stroke", "white")
            .attr("stroke-width", 1.5)

        const total = d3.sum(visiblePieData, (d) => d.value)

        container
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.2em")
            .style("font-size", "18px")
            .style("font-weight", "600")
            .text(`${total}`)

        container
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1.2em")
            .style("font-size", "12px")
            .style("fill", "#6b7280")
            .text("합계")
    }, [data, legendItems, height, width, visibleKeys])

    return (
        <div className="bg-white shadow-sm rounded-lg p-4">
            <svg ref={svgRef} />
            {data.length > 0 && (
                <ChartLegend
                    items={legendItems}
                    onColorChange={handleColorChange}
                    onVisibilityChange={handleVisibilityChange}
                />
            )}
        </div>
    )
}

export default DonutChart
