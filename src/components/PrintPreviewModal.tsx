import React from 'react';
import { Modal, Button, Space } from 'antd';

interface PrintPreviewModalProps {
    visible: boolean;
    onClose: () => void;
    frontImage?: string;
    backImage?: string;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
    visible,
    onClose,
    frontImage,
    backImage,
}) => {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
        <html>
          <head><title>Chop etish</title></head>
          <body style="margin:0; display:flex; flex-direction:column; align-items:center; gap:20px;">
            <img src="${frontImage}" style="width:450px; height:280px;"/>
            <img src="${backImage}" style="width:450px; height:280px;"/>
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            title="Kartani chop etishdan oldin ko‘rib chiqing"
        >
            <div className="flex flex-col items-center gap-6">
                {frontImage && (
                    <img
                        src={frontImage}
                        alt="Front Card Preview"
                        className="w-[450px] h-[280px] border shadow-md"
                    />
                )}
                {backImage && (
                    <img
                        src={backImage}
                        alt="Back Card Preview"
                        className="w-[450px] h-[280px] border shadow-md"
                    />
                )}

                <Space>
                    <Button onClick={onClose}>Bekor qilish</Button>
                    <Button type="primary" onClick={handlePrint}>
                        Chop etish
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};

export default PrintPreviewModal;
