import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { postFormSchema, type PostFormData } from "../model/post.type"
import { useNavigate } from "react-router"
import { ROUTER_PATH } from "@/shared/constants/path.constants"



const usePostForm = () => {
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        watch,
        setValue,
    } = useForm<PostFormData>({
        resolver: zodResolver(postFormSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            body: '',
            category: 'FREE',
            tags: [],
        },
    })
    const onSubmit = async (data: PostFormData) => {
        try {
            navigate(ROUTER_PATH.HOME)
        } catch (error) {
            console.error('게시글 저장 실패:', error)
        }
    }

    return {
        register,
        handleSubmit: handleSubmit(onSubmit),
        errors,
        isValid,
        watch,
        setValue,
    }
}

export default usePostForm