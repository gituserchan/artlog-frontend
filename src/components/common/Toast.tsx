interface ToastProps {
    message: string;
    type?: "success" | "error" | "info";
    onClose: () => void;
}

function Toast({ message, type = "info", onClose }: ToastProps) {
    if (!message) {
        return null;
    }

    return (
        <div className={`toast toast-${type}`}>
            <p>{message}</p>

            <button type="button" onClick={onClose}>
                닫기
            </button>
        </div>
    );
}

export default Toast;