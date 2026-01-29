import PostFormModal from '@/features/post/ui/PostFormModal'
import { useModalActions, useModalStore } from '@/shared/model/modal.store'
import type { AnyModalKey, ModalPayloadMap } from '@/shared/model/modal.store'
import Confirm from '../Confirm'

type ModalComponentProps<K extends AnyModalKey> = {
    isOpen: boolean
    onClose: () => void
} & ModalPayloadMap[K]

const MODAL_COMPONENTS = {
    postForm: PostFormModal,
    confirm: Confirm,
} satisfies {
    [K in AnyModalKey]: React.ComponentType<ModalComponentProps<K>>
}

/**
 * @description 전역 모달 스토어를 구독해 열린 모달만 렌더합니다.
 * 레이아웃 내부에서 <ModalProvider /> 형태로 사용합니다.
 */
const ModalProvider = () => {
    const currentModal = useModalStore((state) => state.currentModal)
    const { closeModal } = useModalActions()

    if (!currentModal) return null

    const ModalComponent = MODAL_COMPONENTS[currentModal.key] as React.ComponentType<
        ModalComponentProps<AnyModalKey>
    >

    return ModalComponent ? (
        <ModalComponent
            isOpen={currentModal.isOpen}
            onClose={() => closeModal(currentModal.key)}
            {...currentModal.props}
        />
    ) : null
}
export default ModalProvider
