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
    const downloadImageAsPNG = async (imageSrc: string, filename: string) => {
        try {
            // Create a canvas to convert image to PNG
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // Set canvas size to match the card dimensions
            canvas.width = 450;
            canvas.height = 280;

            img.crossOrigin = 'anonymous';

            return new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    if (ctx) {
                        // Fill with white background
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        // Draw the image
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                        // Convert to PNG and download
                        canvas.toBlob((blob) => {
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = filename;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(url);
                                resolve();
                            } else {
                                reject(new Error('Failed to create blob'));
                            }
                        }, 'image/png');
                    } else {
                        reject(new Error('Failed to get canvas context'));
                    }
                };

                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = imageSrc;
            });
        } catch (error) {
            console.error('Error downloading image:', error);
        }
    };

    const handleDownload = async () => {
        try {
            if (frontImage) {
                await downloadImageAsPNG(frontImage, 'vizitka-oldi.png');
            }

            if (backImage) {
                // Small delay between downloads
                await new Promise((resolve) => setTimeout(resolve, 500));
                await downloadImageAsPNG(backImage, 'vizitka-orqa.png');
            }
        } catch (error) {
            console.error('Error downloading images:', error);
            alert('Rasmlarni yuklab olishda xatolik yuz berdi');
        }
    };

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            title="Kartani PNG formatda yuklab olishdan oldin ko'rib chiqing"
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
                    <Button
                        className="text-lg px-4 py-2 h-auto"
                        onClick={onClose}
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        type="primary"
                        className="text-lg px-4 py-2 h-auto"
                        onClick={handleDownload}
                    >
                        PNG yuklab olish
                    </Button>
                </Space>
            </div>
        </Modal>
    );
};

export default PrintPreviewModal;
