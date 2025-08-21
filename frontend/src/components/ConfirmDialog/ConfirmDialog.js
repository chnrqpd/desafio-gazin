import React from 'react';
import './ConfirmDialog.scss';

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  type = 'confirm',
}) => {
  if (!isOpen) return null;

  const isInfoType = type === 'info';

  return (
    <div className="confirm-overlay">
      <div className="confirm-dialog">
        <div className="confirm-header">
          <h3 className={isInfoType ? 'info-title' : ''}>{title}</h3>
        </div>
        <div className="confirm-body">
          <p>{message}</p>
        </div>
        <div className="confirm-actions">
          {isInfoType ? (
            <button className="btn btn-primary" onClick={onConfirm}>
              Entendi
            </button>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={onConfirm}>
                Excluir
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
