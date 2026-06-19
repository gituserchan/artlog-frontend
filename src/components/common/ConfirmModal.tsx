interface ConfirmModalProps {
    open: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

function ConfirmModal({
                          open,
                          title,
                          description,
                          confirmText = "확인",
                          cancelText = "취소",
                          danger = false,
                          loading = false,
                          onConfirm,
                          onCancel,
                      }: ConfirmModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div className="modal-backdrop">
            <div className="confirm-modal">
                <p className="eyebrow">Confirm</p>
                <h2>{title}</h2>
                <p>{description}</p>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="subtle-button"
                        disabled={loading}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className={danger ? "danger-button" : "primary-link"}
                        disabled={loading}
                        onClick={onConfirm}
                    >
                        {loading ? "처리 중..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmModal;