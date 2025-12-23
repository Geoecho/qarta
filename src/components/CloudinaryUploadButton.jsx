import React from 'react';
import { Upload } from 'lucide-react';

const CloudinaryUploadButton = ({ onUpload, buttonText = "📤 Upload", small = false }) => {
    const handleClick = () => {
        if (window.cloudinary) {
            window.cloudinary.openUploadWidget({
                cloudName: 'demo', // Replace with your cloud name
                uploadPreset: 'ml_default', // Replace with your upload preset
                sources: ['local', 'url', 'camera'],
                multiple: false,
                maxFiles: 1,
                clientAllowedFormats: ['jpg', 'png', 'gif', 'webp'],
                maxFileSize: 5000000, // 5MB
                cropping: true,
                croppingAspectRatio: 1,
                folder: 'qarta-uploads'
            }, (error, result) => {
                if (!error && result && result.event === 'success') {
                    onUpload(result.info.secure_url);
                }
            });
        } else {
            alert('Upload widget not loaded. Please refresh the page.');
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            style={{
                padding: small ? '6px 12px' : '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                cursor: 'pointer',
                fontSize: small ? '11px' : '12px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}
        >
            {buttonText}
        </button>
    );
};

export default CloudinaryUploadButton;
