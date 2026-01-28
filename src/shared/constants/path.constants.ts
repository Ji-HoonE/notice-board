/**
 * @description 라우터 경로 상수
 */
export const ROUTER_PATH = {
    ROOT: '/',
    LOGIN: '/login',
    HOME: '/home',
    POSTS: '/posts',
    DATA: '/data',
}

export const API_PATH = {
    LOGIN: '/auth/login',
    POSTS: '/posts',
    POSTS_DETAIL: (id: string) => `/posts/${id}`,
}