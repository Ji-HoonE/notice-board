import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from "zustand/react/shallow";

interface CommonStore {
    token: string | null
    setToken: (token: string) => void
    removeToken: () => void
}

/**
 * @description 공통 스토어 - 로컬스토리지 토큰 관리 (zustand persist)
 */
export const useCommonStore = create<CommonStore>()(
    persist(
        (set) => ({
            token: null,
            setToken: (token: string) => set({ token }),
            removeToken: () => set({ token: null }),
        }),
        {
            name: 'common-storage'
        }
    )
)


/**
 * @description 스토어의 액션만 선택하는 훅
 */
export const useCommonAction = () => {
    return useCommonStore(
        useShallow((state) => ({
            setToken: state.setToken,
            removeToken: state.removeToken,
        }))
    );
};