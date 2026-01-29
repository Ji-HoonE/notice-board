import { POST_TABLE_COLUMNS } from "@/shared/constants/post.constants"

const columnWidths: Record<string, number> = {
    title: 25,
    body: 60,
    category: 15,
    userId: 25,
    createdAt: 15,
    actions: 15,
    tags: 40,
}
/**
 * @description 게시판 목록 스켈레톤 컴포넌트
 */
const PostTableSkeleton = () => {
    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 justify-between">
                <div className="relative">
                    <div className="flex items-center gap-2 px-4 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden border border-gray-200 rounded-lg bg-white">
                <div className="flex-shrink-0 overflow-x-auto border-b border-gray-200 bg-gray-100 [scrollbar-gutter:stable]">
                    <table className="table-fixed border-separate border-spacing-0 w-full table-layout-fixed">
                        <colgroup>
                            {POST_TABLE_COLUMNS.map((column) => (
                                <col key={column.key} style={{ width: `${columnWidths[column.key]}%` }} />
                            ))}
                        </colgroup>
                        <thead>
                            <tr>
                                {POST_TABLE_COLUMNS.map((column, index) => (
                                    <th
                                        key={column.key}
                                        className={`px-4 py-2 text-center text-sm font-normal text-black tracking-wider relative border-b border-gray-200 bg-gray-100 ${index < POST_TABLE_COLUMNS.length - 1 ? 'border-r border-gray-200' : ''}`}
                                    >
                                        {column.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="flex-1 min-h-0 relative">
                    <div className="absolute inset-0 overflow-x-auto overflow-y-auto [scrollbar-gutter:stable]">
                        <table className="table-fixed border-separate border-spacing-0 w-full table-layout-fixed">
                            <colgroup>
                                {POST_TABLE_COLUMNS.map((column) => (
                                    <col key={column.key} style={{ width: `${columnWidths[column.key]}%` }} />
                                ))}
                            </colgroup>
                            <tbody className="bg-white">
                                {Array.from({ length: 10 }).map((_, rowIndex) => (
                                    <tr key={rowIndex} className="hover:bg-blue-50 transition-colors">
                                        {POST_TABLE_COLUMNS.map((column, colIndex) => (
                                            <td
                                                key={column.key}
                                                className={`px-4 py-2 text-center text-sm font-normal text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis border-b border-gray-200 ${colIndex < POST_TABLE_COLUMNS.length - 1 ? 'border-r border-gray-200' : ''}`}
                                            >
                                                {column.key === 'title' && (
                                                    <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mx-auto" />
                                                )}
                                                {column.key === 'body' && (
                                                    <div className="h-4 w-56 bg-gray-200 rounded animate-pulse mx-auto" />
                                                )}
                                                {column.key === 'category' && (
                                                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mx-auto" />
                                                )}
                                                {column.key === 'userId' && (
                                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mx-auto" />
                                                )}
                                                {column.key === 'createdAt' && (
                                                    <div className="h-4 w-28 bg-gray-200 rounded animate-pulse mx-auto" />
                                                )}
                                                {column.key === 'tags' && (
                                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mx-auto" />
                                                )}
                                                {column.key === 'actions' && (
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                                                        <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
                                                    </div>
                                                )}
                                                {column.key !== 'title' &&
                                                    column.key !== 'body' &&
                                                    column.key !== 'category' &&
                                                    column.key !== 'userId' &&
                                                    column.key !== 'createdAt' &&
                                                    column.key !== 'tags' &&
                                                    column.key !== 'actions' && (
                                                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto" />
                                                    )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostTableSkeleton