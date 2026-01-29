import { useModalActions } from "../model/modal.store"

interface ConfirmProps {
    description?: string
    onConfirm?: () => void
}

const Confirm = ({ description, onConfirm }: ConfirmProps) => {
    const { closeModal } = useModalActions()
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">

                {description && (
                    <p className="mb-4 text-sm text-gray-600">
                        {description}
                    </p>
                )}
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => closeModal('confirm')}
                        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm?.()}
                        className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Confirm