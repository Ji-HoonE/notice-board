import { Suspense } from 'react'
import PostTable from './PostTable'
import PostTableSkeleton from './PostTableSkeleton'
import PostListFilter from './PostListFilter'
import usePostListFilter from '../hooks/usePostListFilter'

const PostList = () => {
    const { filterOptions, register } = usePostListFilter()

    return (
        <div className="w-full h-full flex flex-col space-y-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-shrink-0">
                <PostListFilter
                    register={register}
                />
            </div>
            <div className="flex-1">
                <Suspense fallback={<PostTableSkeleton />}>
                    <PostTable
                        filterOptions={filterOptions}
                    />
                </Suspense>
            </div>
        </div >
    )
}

export default PostList