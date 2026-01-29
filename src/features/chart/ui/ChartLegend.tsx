export interface ChartLegendItem {
    id: string
    label: string
    color: string
    visible: boolean
    suffix?: string
}

interface ChartLegendProps {
    items: ChartLegendItem[]
    onColorChange: (id: string, color: string) => void
    onVisibilityChange: (id: string, visible: boolean) => void
}

/**
 * @description 차트 범례 컴포넌트
 */
const ChartLegend = ({
    items,
    onColorChange,
    onVisibilityChange,
}: ChartLegendProps) => {
    return (
        <div
            className="mt-3 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-3"
            role="list"
            aria-label="차트 범례"
        >
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-center gap-2"
                    role="listitem"
                >
                    <input
                        type="color"
                        value={item.color}
                        onChange={(e) => onColorChange(item.id, e.target.value)}
                        className="h-6 w-8 cursor-pointer rounded border border-gray-200 bg-transparent p-0"
                        aria-label={`${item.label} 색상 변경`}
                    />
                    <label className="flex cursor-pointer items-center gap-1.5 text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={item.visible}
                            onChange={(e) =>
                                onVisibilityChange(item.id, e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <span
                            className={
                                item.visible
                                    ? ""
                                    : "text-gray-400 line-through"
                            }
                        >
                            {item.label}
                            {item.suffix ?? ""}
                        </span>
                    </label>
                </div>
            ))}
        </div>
    )
}

export default ChartLegend
