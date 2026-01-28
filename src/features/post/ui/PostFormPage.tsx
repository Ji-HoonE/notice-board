import { useNavigate, useSearchParams } from 'react-router'
import { AiOutlineArrowLeft } from 'react-icons/ai'
import { ROUTER_PATH } from '@/shared/constants/path.constants'
import usePostForm from '../hooks/usePostForm'
import Input from '@/shared/ui/Input'
import TextArea from '@/shared/ui/TextArea'
import Select from '@/shared/ui/Select'

const PostFormPage = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const type = searchParams.get('type')
    const isCreateMode = type === 'create'

    const {
        register,
        handleSubmit,
        errors,
        isValid,
    } = usePostForm()

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => navigate(ROUTER_PATH.HOME)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <AiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {isCreateMode ? '게시글 작성' : '게시글 수정'}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                카테고리<span className="text-red-500">*</span>
                            </label>
                            <Select
                                id="category"
                                {...register('category')}
                                className="w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all"
                                options={[
                                    { value: 'NOTICE', label: '공지사항' },
                                    { value: 'QNA', label: '질문' },
                                    { value: 'FREE', label: '자유게시판' },
                                ]}
                            />
                        </div>
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                제목 <span className="text-red-500">*</span>
                            </label>
                            <Input
                                id="title"
                                type="text"
                                placeholder="제목을 입력하세요"
                                {...register('title')}
                                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all`}
                                error={errors.title?.message}
                            />
                        </div>
                        <div>
                            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                                본문 <span className="text-red-500">*</span>
                            </label>
                            <TextArea
                                id="body"
                                placeholder="본문을 입력하세요"
                                {...register('body')}
                                className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all resize-none`}
                                error={errors.body?.message}

                            />
                        </div>
                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                태그
                            </label>
                            <Input
                                id="tags"
                                type="text"
                                placeholder="태그를 입력하세요"
                                {...register('tags')}
                                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all`}
                                error={errors.tags?.message}
                            />
                            <p className="text-xs text-gray-500 mt-1">쉼표로 구분하여 여러 태그를 입력할 수 있습니다</p>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate(ROUTER_PATH.HOME)}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={!isValid}
                                className={`px-6 py-2.5 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isValid
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isCreateMode ? '작성하기' : '수정하기'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default PostFormPage