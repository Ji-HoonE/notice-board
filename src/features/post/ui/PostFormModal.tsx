import { AiOutlineClose } from 'react-icons/ai'
import usePostForm from '../hooks/usePostForm'
import { CATEGORY_OPTIONS } from '@/shared/constants/post.constants'
import { useModalActions } from '@/shared/model/modal.store'

interface IPostFormModalProps {
    postId: string
}
/**
 * @description 게시글 폼 모달 컴포넌트
 */
const PostFormModal = ({ postId }: IPostFormModalProps) => {
    /** 모달 닫기 액션 */
    const { closeModal } = useModalActions()
    /** 게시글 폼 커스텀 훅 */
    const { register, handleSubmit, errors, isValid, handleAddTag, handleRemoveTag, tagInput, tags, setTagInput, isLoading } =
        usePostForm(postId)
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
        >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
            <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="px-6 sm:px-8 pt-6 pb-5 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{postId ? '게시글 수정' : '게시글 작성'}</h2>
                        </div>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white cursor-pointer"
                            aria-label="닫기"
                            onClick={() => closeModal('postForm')}
                        >
                            <AiOutlineClose className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="relative px-6 sm:px-8 py-6 space-y-6 min-h-[817px]">
                    {postId && isLoading ? (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
                            <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin" />
                        </div>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                    카테고리
                                    <span className="text-red-500"> *</span>
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        className={`w-full appearance-none px-4 py-2.5 pr-10 text-sm border rounded-lg bg-white cursor-pointer transition-colors focus:outline-none focus:ring-2 hover:border-gray-400 ${errors.category
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                            }`}
                                        {...register('category')}
                                    >
                                        {CATEGORY_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600" role="alert">
                                        {errors.category.message as string}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-end gap-2">
                                    <div className="flex-1">
                                        <label htmlFor="tagInput" className="block text-sm font-medium text-gray-700 mb-2">
                                            태그
                                        </label>
                                        <input
                                            id="tagInput"
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            placeholder="예) 리액트"
                                            className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all border-gray-300 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        disabled={
                                            !tagInput.trim() ||
                                            tagInput.trim().length > 24 ||
                                            tags.length >= 5
                                        }
                                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${!tagInput.trim() ||
                                            tagInput.trim().length > 24 ||
                                            tags.length >= 5
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                    >
                                        추가
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    태그 목록 (중복 제거, 최대 5개, 각 24자 이내)
                                </p>

                                <div className="mt-1 flex flex-wrap gap-2 min-h-[1.5rem]">
                                    {tags.map((tag: string) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                                        >
                                            {tag}
                                            <button
                                                type="button"
                                                className="text-blue-700 hover:text-blue-900"
                                                onClick={() => handleRemoveTag(tag)}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                {errors.tags && (
                                    <p className="mt-1 text-sm text-red-600" role="alert">
                                        {errors.tags.message as string}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                    제목
                                    <span className="text-red-500"> *</span>
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="제목을 입력하세요"
                                    maxLength={80}
                                    className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.title
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    {...register('title')}
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600" role="alert">
                                        {errors.title.message as string}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                                    본문
                                    <span className="text-red-500"> *</span>
                                </label>
                                <textarea
                                    id="body"
                                    placeholder="본문을 입력하세요"
                                    rows={14}
                                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none ${errors.body
                                        ? 'border-red-500 focus:ring-red-500'
                                        : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
                                        }`}
                                    {...register('body')}
                                />
                                {errors.body && (
                                    <p className="mt-1 text-sm text-red-600" role="alert">
                                        {errors.body.message as string}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-5 border-t border-gray-200">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50"
                                    onClick={() => closeModal('postForm')}
                                >
                                    취소
                                </button>
                                <button
                                    disabled={!isValid}
                                    type="submit"
                                    className={`inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium rounded-xl transition-colors ${!isValid
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    확인
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div >
        </div >
    )
}

export default PostFormModal