import { AiOutlineSearch } from 'react-icons/ai'
import Input from '@/shared/ui/Input'
import Select from '@/shared/ui/Select'
import type { UseFormRegister } from 'react-hook-form'
import { CATEGORY_OPTIONS, ORDER_OPTIONS, SORT_OPTIONS } from '@/shared/constants/post.constants'
import type { PostListFilterData } from '../model/post.type'
import { useNavigate } from 'react-router'
import { ROUTER_PATH } from '@/shared/constants/path.constants'

interface IPostListFilterProps {
    register: UseFormRegister<PostListFilterData>
}


/** 
 * @description 게시판 목록 필터 컴포넌트
 */
const PostListFilter = ({ register }: IPostListFilterProps) => {
    const navigate = useNavigate()

    const handleCreatePost = () => {
        navigate(`${ROUTER_PATH.POSTS}?type=create`)
    }
    return (
        <div className="flex items-center gap-3 flex-wrap justify-between">
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <Input
                        type="date"
                        className="min-w-[140px]"
                        register={register('date')}
                    />
                </div>
                <div className="w-64 relative">
                    <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="검색 입력"
                        className="pl-10 pr-3 py-2"
                        register={register('search')}
                    />
                </div>
                <Select
                    options={SORT_OPTIONS}
                    className="min-w-[120px]"
                    register={register('sort')}
                />
                <Select
                    options={ORDER_OPTIONS}
                    className="min-w-[120px]"
                    register={register('order')}
                />
                <Select
                    options={CATEGORY_OPTIONS}
                    className="min-w-[140px]"
                    register={register('category')}
                />

            </div>
            <button
                type="button"
                className="px-4 h-10 text-sm font-medium rounded-lg bg-gray-900 text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                onClick={handleCreatePost}
            >
                게시물 작성
            </button>
        </div>

    )
}

export default PostListFilter
