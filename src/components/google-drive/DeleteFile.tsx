import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { database } from '../../firebase';
import { ROOT_FOLDER, useFolder } from '../../hooks/useFolder';
import { storage } from '../../firebase';

interface PropType {
  fileId: string;
  fileName: string;
  userId: string;
  fileFolderId: string;
}

function DeleteFile({ fileId, fileName, userId, fileFolderId }: PropType) {
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);

  const { folder }: any = useFolder(fileFolderId);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function showError() {
    setOpenError(true);
  }

  function hideError() {
    setOpenError(false);
  }

  function deleteFile() {
    closeModal();

    const filePath: string =
      folder === ROOT_FOLDER
        ? `files/${userId}${folder.path.join('/')}/${fileName}`
        : `files/${userId}/${folder.path.join('/')}/${folder.name}/${fileName}`;

    const storageRef = storage.ref();
    const fileRef = storageRef.child(filePath);

    fileRef
      .delete()
      .then(() => {
        database.files
          .doc(fileId)
          .delete()
          .then(() => {
            console.log('Successfully deleted in database');
          })
          .catch(() => showError());
      })
      .catch(() => showError());
  }

  return (
    <>
      <button
        onClick={() => {
          openModal();
        }}
        className="item_menu_button"
      >
        Delete
      </button>

      <Modal show={open} onHide={closeModal}>
        <Modal.Body>
          <p>Are you sure you want to permanently delete this file?</p>
          <div className="modal_container_buttons">
            <button
              onClick={() => {
                deleteFile();
              }}
              className="modal_button"
            >
              <div className="button_container_icon">
                <img
                  src={require(`../../images/confirm.png`)}
                  alt="File Icon"
                />
              </div>
            </button>
            <button
              onClick={() => {
                closeModal();
              }}
              className="modal_button"
            >
              <div className="button_container_icon">
                <img src={require(`../../images/cancel.png`)} alt="File Icon" />
              </div>{' '}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={openError} onHide={hideError}>
        <Modal.Body>
          <p>Failed to delete file. Please try again</p>
          <Button
            variant="danger"
            onClick={() => {
              hideError();
            }}
          >
            Close
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DeleteFile;
