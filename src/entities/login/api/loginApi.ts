import { ApiHelper } from "@/shared/api/api.base"
import { API_PATH } from "@/shared/constants/path.constants"
import type { ILoginRequest, ILoginResponse } from "@/entities/login/model/login.type"

/**
 * @description 로그인 API
 */
export const loginApi = {
    login: async (data: ILoginRequest) => {
        const response = await ApiHelper.post<ILoginResponse>(API_PATH.LOGIN, data)
        return response
    }
}