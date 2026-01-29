import { AiOutlineSearch } from 'react-icons/ai'
import type { UseFormRegister } from 'react-hook-form'
import { CATEGORY_OPTIONS, ORDER_OPTIONS, SORT_OPTIONS } from '@/shared/constants/post.constants'
import type { PostListFilterData } from '../model/post.type'
import { useModalActions } from '@/shared/model/modal.store'
import { useDeleteAllPostsMutation } from '@/entities/post/query/post.query'
import { useQueryClient } from '@tanstack/react-query'

interface IPostListFilterProps {
    register: UseFormRegister<PostListFilterData>
}


/** 
 * @description 게시판 목록 필터 컴포넌트
 */
const PostListFilter = ({ register }: IPostListFilterProps) => {
    const queryClient = useQueryClient()
    const { openModal, closeModal } = useModalActions()

    const { mutateAsync: deleteAllPosts } = useDeleteAllPostsMutation()

    const handleCreatePost = () => {
        openModal('postForm', { postId: '' })
    }
    const handleDeleteAllPosts = async () => {
        try {
            openModal('confirm', {
                description: '내 게시글을 전체 삭제하시겠습니까?',
                onConfirm: async () => {
                    const res = await deleteAllPosts()
                    if (res.ok) {
                        queryClient.invalidateQueries({ queryKey: ['postList'] })
                        closeModal('confirm')
                    }
                },
            })
        } catch (error) {
            console.error('모든 포스트 삭제 실패:', error)
        }
    }

    return (
        <div className="flex items-center gap-3 flex-wrap justify-between">
            <div className="flex items-center gap-2">
                <div className="w-full min-w-[200px] relative">
                    <input
                        type="date"
                        placeholder="날짜 선택"
                        className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all border-gray-300 focus:ring-blue-500 focus:border-transparent pl-10 pr-3"
                        {...register('date')}
                    />
                </div>
                <div className="w-full min-w-[200px] relative">
                    <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="검색 입력"
                        className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all border-gray-300 focus:ring-blue-500 focus:border-transparent pl-10 pr-3"
                        {...register('search')}
                    />
                </div>
                <select
                    className="min-w-[120px] w-full appearance-none px-4 py-2.5 pr-10 text-sm border rounded-lg bg-white cursor-pointer transition-colors focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                    {...register('sort')}
                >
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <select
                    className="min-w-[120px] w-full appearance-none px-4 py-2.5 pr-10 text-sm border rounded-lg bg-white cursor-pointer transition-colors focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                    {...register('order')}
                >
                    {ORDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <select
                    className="min-w-[140px] w-full appearance-none px-4 py-2.5 pr-10 text-sm border rounded-lg bg-white cursor-pointer transition-colors focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500 focus:border-transparent hover:border-gray-400"
                    {...register('category')}
                >
                    {CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                    onClick={handleCreatePost}
                >
                    게시물 작성
                </button>
                <button
                    type="button"
                    className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={handleDeleteAllPosts}
                >
                    모두 삭제
                </button>
            </div>
        </div >

    )
}

export default PostListFilter
