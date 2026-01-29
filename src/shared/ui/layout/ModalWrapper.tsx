import type { PropsWithChildren } from 'react'
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
const ModalWrapper = ({ children }: PropsWithChildren) => {
    const currentModal = useModalStore(state => state.currentModal)
    const { closeModal } = useModalActions()

    if (!currentModal) {
        return <>{children}</>
    }

    const ModalComponent = MODAL_COMPONENTS[currentModal.key] as React.ComponentType<ModalComponentProps<AnyModalKey>>

    return (
        <>
            {children}
            {ModalComponent && (
                <ModalComponent
                    isOpen={currentModal.isOpen}
                    onClose={closeModal}
                    {...currentModal.props}
                />
            )}
        </>
    )
}

export default ModalWrapper

