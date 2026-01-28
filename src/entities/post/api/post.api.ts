import { ApiHelper } from "@/shared/api/api.base"
import type { IPostListRequest, IPostListResponse } from "../model/post.type"
import { API_PATH } from "@/shared/constants/path.constants"

/**
 * @description 로그인 API
 */
export const postApi = {
    getPostList: async (params: IPostListRequest): Promise<IPostListResponse> => {
        const response = await ApiHelper.get<IPostListResponse>(API_PATH.POSTS, {
            params,
        })
        return response
    }
}