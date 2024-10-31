import { Modal, ModalBody, ModalFooter, ModalHeader } from '@/components/Modal/Modal';
import { Button } from '@/components/ui/button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { X } from 'lucide-react';
import React from 'react';

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => Promise<void>;
    title: string;
    description: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
    isOpen,
    onClose,
    onDelete,
    title,
    description,
}) => {
    return (
        <Modal isOpen={isOpen} className="w-full max-w-md">
            <ModalHeader>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faTrash} className="text-red-600" />
                        <h3 className="text-lg font-semibold">{title}</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </ModalHeader>
            <ModalBody>
                <p className="text-sm text-gray-500">{description}</p>
            </ModalBody>
            <ModalFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={onDelete}
                >
                    Delete
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteModal;