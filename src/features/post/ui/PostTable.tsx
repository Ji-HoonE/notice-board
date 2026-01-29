import type { PostListFilterData } from "../model/post.type"
import { POST_TABLE_COLUMNS } from "@/shared/constants/post.constants"
import { useColumnResize } from "../hooks/useColumnResize"
import { CommonUtil } from "@/shared/utils/util"
import { FaEdit, FaFilter, FaTrash } from "react-icons/fa"
import useTableHideColumn from "../hooks/useTableHideColumn"
import { useDeletePostMutation, usePostListInfiniteQuery } from "@/entities/post/query/post.query"
import { useEffect, useMemo, useRef } from "react"
import { useModalActions } from "@/shared/model/modal.store"
import { useQueryClient } from "@tanstack/react-query"
interface IPostTableProps {
    filterOptions: PostListFilterData
}
/**
 * @description 게시판 목록 컴포넌트
 */
const PostTable = ({ filterOptions }: IPostTableProps) => {
    const queryClient = useQueryClient()
    /** 다음 페이지 로드 참조 (하단) */
    const loadMoreRef = useRef<HTMLDivElement | null>(null)
    /** 모달 액션 */
    const { openModal, closeModal } = useModalActions()

    /** 게시물 목록 조회 */
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = usePostListInfiniteQuery({
        limit: 20,
        ...(filterOptions.sort && { sort: filterOptions.sort }),
        ...(filterOptions.order && { order: filterOptions.order }),
        ...(filterOptions.category && { category: filterOptions.category }),
        from: `${filterOptions.date}T00:00:00.000`,
        to: `${filterOptions.date}T23:59:59.999`,
        search: filterOptions.search || '',
    })

    const items = data.pages.flatMap((page) => page.items)

    /** 게시글 삭제 뮤테이션 */
    const { mutateAsync: deletePost } = useDeletePostMutation()

    /** 컬럼 숨김 관리 */
    const { visibleColumnsList, visibleColumns, handleColumnToggle, isColumnFilterOpen, filterRef, setIsColumnFilterOpen } = useTableHideColumn()

    /** 컬럼 리사이즈 관리 */
    const { columnWidths, tableRef, isResizing, handleMouseDown } = useColumnResize({
        columnKeys: visibleColumnsList.map((col) => col.key),
        initialWidths: {
            title: 25,
            body: 60,
            category: 15,
            userId: 25,
            createdAt: 15,
            actions: 15,
            tags: 40,
        },
    })

    /** 게시글 삭제 핸들러 */
    const handleDeletePost = async (postId: string) => {
        try {
            openModal('confirm', {
                description: '게시글을 삭제하시겠습니까?',
                onConfirm: async () => {
                    const res = await deletePost(postId)
                    if (res.ok) {
                        queryClient.invalidateQueries({ queryKey: ['post', 'list'] })
                        closeModal('confirm')
                    }
                },
            })
        } catch (error) {
            console.error('게시글 삭제 실패:', error)
        }
    }

    /** 데이터가 없는 경우 */
    const isEmpty = useMemo(
        () => items.length === 0,
        [items.length]
    )

    /** 다음 페이지 데이터 로드 (하단 스크롤) */
    useEffect(() => {
        if (!loadMoreRef.current || !hasNextPage) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isFetchingNextPage) {
                    fetchNextPage()
                }
            },
            {
                root: tableRef.current,
                threshold: 0.9,
            }
        )
        observer.observe(loadMoreRef.current)
        return () => observer.disconnect()
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, tableRef])



    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 justify-between">
                <div className="relative" ref={filterRef}>
                    <button
                        type="button"
                        onClick={() => setIsColumnFilterOpen(!isColumnFilterOpen)}
                        className="flex items-center gap-2 px-4 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                        <span className="text-sm font-medium text-gray-700">컬럼 설정</span>
                        <FaFilter className="w-4 h-4" />
                    </button>
                    {isColumnFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                            <div className="p-3 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-sm font-semibold text-gray-900">컬럼 표시 설정</h3>
                            </div>
                            <div className="p-3 max-h-64 overflow-y-auto [scrollbar-gutter:stable]">
                                <div className="space-y-2">
                                    {POST_TABLE_COLUMNS.map((column) => (
                                        <label
                                            key={column.key}
                                            className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors group"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns[column.key] ?? true}
                                                onChange={() => handleColumnToggle(column.key)}
                                                className="w-4 h-4 border-gray-300 rounded cursor-pointer accent-gray-700"
                                            />
                                            <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900">
                                                {column.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div
                ref={tableRef}
                className={`flex-1 flex flex-col overflow-hidden border border-gray-200 rounded-lg bg-white ${isResizing ? 'select-none' : ''}`}
            >
                <div className="flex-shrink-0 overflow-x-auto border-b border-gray-200 bg-gray-100 [scrollbar-gutter:stable]">
                    <table className="table-fixed border-separate border-spacing-0 w-full table-layout-fixed">
                        <colgroup>
                            {visibleColumnsList.map((column) => (
                                <col key={column.key} style={{ width: `${columnWidths[column.key]}%` }} />
                            ))}
                        </colgroup>
                        <thead>
                            <tr>
                                {visibleColumnsList.map((column, index) => (
                                    <th
                                        key={column.key}
                                        className={`px-4 py-2 text-center text-sm font-normal text-black tracking-wider relative border-b border-gray-200 bg-gray-100 ${index < visibleColumnsList.length - 1 ? 'border-r border-gray-200' : ''}`}
                                    >
                                        {column.label}
                                        {index < visibleColumnsList.length - 1 && (
                                            <div
                                                className={`absolute top-0 right-0 h-full cursor-col-resize transition-colors z-10 ${isResizing === column.key
                                                    ? 'bg-blue-500'
                                                    : 'bg-transparent hover:bg-blue-400'
                                                    }`}
                                                onMouseDown={(e) => handleMouseDown(column.key, e)}
                                                style={{
                                                    marginRight: '-2px',
                                                    width: '4px',
                                                }}
                                            />
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    </table>
                </div>
                <div className="flex-1 min-h-0 relative">
                    <div className="absolute inset-0 overflow-x-auto overflow-y-auto [scrollbar-gutter:stable]">
                        {isEmpty && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-sm text-gray-500">조회된 데이터가 없습니다.</span>
                            </div>
                        )}
                        <table className="table-fixed border-separate border-spacing-0 w-full table-layout-fixed">
                            <colgroup>
                                {visibleColumnsList.map((column) => (
                                    <col key={column.key} style={{ width: `${columnWidths[column.key]}%` }} />
                                ))}
                            </colgroup>
                            <tbody className="bg-white">
                                {items?.map((post) => (
                                    <tr key={post.id} className="hover:bg-blue-50 transition-colors">
                                        {visibleColumnsList.map((column, colIndex) => (
                                            <td
                                                key={column.key}
                                                className={`px-4 py-2 text-center text-sm font-normal text-gray-700 overflow-hidden whitespace-nowrap text-ellipsis border-b border-gray-200 ${colIndex < visibleColumnsList.length - 1 ? 'border-r border-gray-200' : ''}`}
                                            >
                                                {column.key === 'title' && (
                                                    <span className="block truncate" title={post.title}>
                                                        {post.title}
                                                    </span>
                                                )}
                                                {column.key === 'body' && (
                                                    <span className="block truncate" title={post.body}>
                                                        {post.body}
                                                    </span>
                                                )}
                                                {column.key === 'tags' && (
                                                    <span
                                                        className="block truncate text-xs text-blue-800"
                                                        title={
                                                            post.tags && post.tags.length > 0
                                                                ? post.tags.map((tag) => `#${tag}`).join(' ')
                                                                : ''
                                                        }
                                                    >
                                                        {post.tags && post.tags.length > 0
                                                            ? post.tags.map((tag) => `#${tag}`).join(' ')
                                                            : ''}
                                                    </span>
                                                )}
                                                {column.key === 'category' && (
                                                    <span className="text-sm text-black">
                                                        {CommonUtil.getCategoryLabel(post.category)}
                                                    </span>
                                                )}
                                                {column.key === 'userId' && post.userId}
                                                {column.key === 'createdAt' && CommonUtil.formatDateOnly(post.createdAt)}
                                                {column.key === 'actions' && (
                                                    <div className="flex items-center justify-center gap-1.5">
                                                        <button
                                                            type="button"
                                                            className="p-1 cursor-pointer"
                                                            title="수정"
                                                            onClick={() => {
                                                                openModal('postForm', { postId: post.id })
                                                            }}
                                                        >
                                                            <FaEdit className="w-3.5 h-3.5 " />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="p-1 cursor-pointer"
                                                            title="삭제"
                                                            onClick={() => handleDeletePost(post.id)}
                                                        >
                                                            <FaTrash className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div ref={loadMoreRef} className="h-1.5" />
                    </div>
                </div>
            </div >
        </div >
    )
}

export default PostTable