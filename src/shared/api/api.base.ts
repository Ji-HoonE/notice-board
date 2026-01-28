import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

const apiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * @description Request 인터셉터: 모든 요청에 토큰 자동 추가
 */
apiInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token') || localStorage.getItem('accessToken')
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 * @description API 요청 헬퍼 클래스
 */
export const ApiHelper = {
    /**
     * GET 요청
     * @template T - 응답 데이터의 타입
     * @param {string} url - 요청할 URL 경로
     * @param {import('axios').AxiosRequestConfig} [config] - Axios 요청 설정 옵션
     * @returns {Promise<T>} 응답 데이터를 반환하는 Promise
     * @throws {Error} 네트워크 오류 또는 HTTP 오류 발생 시 예외 처리
     */
    get: async <T = unknown>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> => {
        const response: AxiosResponse<T> = await apiInstance.get(url, config)
        return response.data
    },

    /**
     * POST 요청
     * @template T - 응답 데이터의 타입
     * @param {string} url - 요청할 URL 경로
     * @param {unknown} [data] - 요청 본문에 포함할 데이터
     * @param {import('axios').AxiosRequestConfig} [config] - Axios 요청 설정 옵션
     * @returns {Promise<T>} 응답 데이터를 반환하는 Promise
     * @throws {Error} 네트워크 오류 또는 HTTP 오류 발생 시 예외 처리
     */
    post: async <T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> => {
        const response: AxiosResponse<T> = await apiInstance.post(url, data, config)
        return response.data
    },

    /**
     * DELETE 요청
     * @template T - 응답 데이터의 타입
     * @param {string} url - 요청할 URL 경로
     * @param {import('axios').AxiosRequestConfig} [config] - Axios 요청 설정 옵션
     * @returns {Promise<T>} 응답 데이터를 반환하는 Promise
     * @throws {Error} 네트워크 오류 또는 HTTP 오류 발생 시 예외 처리
     */
    delete: async <T = unknown>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<T> => {
        const response: AxiosResponse<T> = await apiInstance.delete(url, config)
        return response.data
    },

    /**
     * PATCH 요청
     * @template T - 응답 데이터의 타입
     * @param {string} url - 요청할 URL 경로
     * @param {unknown} [data] - 요청 본문에 포함할 데이터
     * @param {import('axios').AxiosRequestConfig} [config] - Axios 요청 설정 옵션
     * @returns {Promise<T>} 응답 데이터를 반환하는 Promise
     * @throws {Error} 네트워크 오류 또는 HTTP 오류 발생 시 예외 처리
     */
    patch: async <T = unknown>(
        url: string,
        data?: unknown,
        config?: AxiosRequestConfig
    ): Promise<T> => {
        const response: AxiosResponse<T> = await apiInstance.patch(url, data, config)
        return response.data
    },
}
