// src/components/CompletionModal.js
import React from "react";
import Modal from "./Modal";

function CompletionModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Training Completed ✅">
      <p className="modal-text">
        You have successfully completed all HP 2026 Quality Excellence criteria.
        This indicates strong alignment with our global QA expectations.
      </p>

      <div className="modal-actions">
        <button className="primary-btn" type="button" onClick={onClose}>
          Continue
        </button>

        <button className="resource-btn" type="button" disabled>
          📄 Download Certificate (soon)
        </button>
      </div>

      <p className="modal-footnote">
        Certificate generation will be enabled once we finalize branding, names,
        and tracking requirements for 2026.
      </p>
    </Modal>
  );
}

export default CompletionModal;
