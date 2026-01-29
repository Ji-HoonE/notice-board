import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'

/**
 * @description 전역 모달 키 정의
 */
export type ModalKey = 'postForm' | 'confirm'

/**
 * @description 모달별로 전달할 props 타입 매핑
 */
export interface ModalPayloadMap {
    postForm: {
        postId: string
    },
    confirm: {
        description?: string
        onConfirm?: () => void
    }
}

export type AnyModalKey = keyof ModalPayloadMap

interface ModalState<K extends AnyModalKey = AnyModalKey> {
    key: K
    isOpen: boolean
    props?: ModalPayloadMap[K]
}

interface ModalStore {
    /**
     * @description 현재 띄워진 모달 (하나만 관리)
     */
    currentModal: ModalState | null
    /**
     * @description 모달 열기 - 모달 키와 해당 모달 props를 제네릭으로 안전하게 전달
     */
    openModal: <K extends AnyModalKey>(key: K, props: ModalPayloadMap[K]) => void
    /**
     * @description 모달 닫기
     */
    closeModal: (key?: AnyModalKey) => void
}

export const useModalStore = create<ModalStore>((set) => ({
    currentModal: null,
    openModal: (key, props) =>
        set({
            currentModal: {
                key,
                isOpen: true,
                props,
            },
        }),
    closeModal: (key) =>
        set((state) => {
            if (!key) {
                return { currentModal: null }
            }
            if (state.currentModal?.key === key) {
                return { currentModal: null }
            }
            return state
        }),
}))

/**
 * @description 스토어의 액션만 선택하는 훅
 */
export const useModalActions = () => {
    return useModalStore(
        useShallow((state) => ({
            openModal: state.openModal,
            closeModal: state.closeModal,
        }))
    );
};