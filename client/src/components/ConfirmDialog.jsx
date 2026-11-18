// client/src/components/ConfirmDialog.jsx
// Simple yes/no confirmation for destructive actions.

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <div className="modal__header">
          <h2>{title}</h2>
        </div>
        <p>{message}</p>
        <div className="modal__footer">
          <button className="btn btn--ghost" onClick={onCancel}>Cancel</button>
          <button className="btn btn--danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}