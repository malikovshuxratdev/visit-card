import React from 'react';
import { Modal, Button } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

interface PrintPreviewModalProps {
    visible: boolean;
    onClose: () => void;
    frontImage?: string;
    backImage?: string;
    onPrintStart: () => void;
}

const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
    visible,
    onClose,
    frontImage,
    backImage,
    onPrintStart,
}) => {
    const handlePrint = () => {
        if (!frontImage && !backImage) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        // Exact physical size of a standard business card
        // 85.6mm x 53.98mm, no margins for edge-to-edge printing
        const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      @page { size: 85.6mm 53.98mm; margin: 0; }
      html, body { height: 100%; }
      body { margin: 0; padding: 0; }
      .page {
        width: 85.6mm;
        height: 53.98mm;
        page-break-after: always;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ffffff;
      }
      .page:last-child { page-break-after: avoid; }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      @media print {
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      }
    </style>
  </head>
  <body>
    ${frontImage ? `<div class="page"><img src="${frontImage}" /></div>` : ''}
    ${backImage ? `<div class="page"><img src="${backImage}" /></div>` : ''}
    <script>
      window.onload = function() {
        window.focus();
        window.print();
        setTimeout(() => window.close(), 300);
      };
    <\/script>
  </body>
</html>`;

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();

        // Start full page loading
        onPrintStart();
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1000}
            centered
            title={
                <div className="text-2xl font-bold text-center py-2">
                    📋 Kartani chop etishdan oldin ko'rib chiqing
                </div>
            }
            bodyStyle={{
                padding: '10px',
                background:
                    'linear-gradient(to bottom right, rgba(255, 255, 255, 0.95), rgba(240, 240, 255, 0.95))',
            }}
        >
            <div className="flex flex-col items-center gap-8">
                {/* Cards Preview */}
                <div className="flex flex-row items-center justify-center gap-6">
                    {frontImage && (
                        <div className="relative">
                            <img
                                src={frontImage}
                                alt="Front Card Preview"
                                className="w-[450px] h-[280px] rounded-lg"
                            />
                        </div>
                    )}
                    {backImage && (
                        <div className="relative">
                            <img
                                src={backImage}
                                alt="Back Card Preview"
                                className="w-[450px] h-[280px] rounded-lg"
                            />
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-6">
                    <Button
                        size="large"
                        className="text-lg px-10 py-6 h-auto bg-gradient-to-r from-gray-100 to-gray-200 border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                        onClick={onClose}
                    >
                        ❌ Bekor qilish
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        className="text-lg px-10 py-6 h-auto bg-gradient-to-r from-green-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300"
                        icon={<PrinterOutlined />}
                        onClick={handlePrint}
                    >
                        🖨️ Chop etish
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PrintPreviewModal;
