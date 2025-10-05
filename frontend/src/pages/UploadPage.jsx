
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import styles from './UploadPage.module.css';
import btnStyles from '../components/Button.module.css';

const FileIcon = () => (
    <svg className={styles.fileIcon} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>
);
const UploadCloudIcon = () => (
    <svg className={styles.dropzoneIcon} xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);


const UploadPage = () => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        setFiles(prevFiles => {
            const newFiles = acceptedFiles.filter(newFile => 
                !prevFiles.some(existingFile => existingFile.name === newFile.name && existingFile.size === newFile.size)
            );
            return [...prevFiles, ...newFiles];
        });
    }, []);
    
    const removeFile = (fileName) => {
        setFiles(files.filter(file => file.name !== fileName));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
    });
    
    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error('Please select files to upload.');
            return;
        }

        const formData = new FormData();
        files.forEach(file => {
            formData.append('resumes', file);
        });
        
        const idempotencyKey = uuidv4();
        const loadingToast = toast.loading('Uploading and processing resumes...');

        try {
            const response = await api.post('/resumes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Idempotency-Key': idempotencyKey
                },
            });
            toast.success(response.data.message || 'Files uploaded successfully!', { id: loadingToast });
            setFiles([]);
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || 'Upload failed.';
            toast.error(errorMessage, { id: loadingToast });
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Upload Resumes</h1>
            <p className={styles.subtitle}>Upload one or more resumes in PDF format.</p>
            
            <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}>
                <input {...getInputProps()} />
                <UploadCloudIcon />
                <p className={styles.dropzoneText}>Drag 'n' drop some PDF resumes here, or click to select files</p>
                <p className={styles.dropzoneHint}>Only PDF files are accepted</p>
            </div>
            
            {files.length > 0 && (
                <aside className={styles.fileListContainer}>
                    <h4 className={styles.fileListTitle}>Files to upload:</h4>
                    <ul className={styles.fileList}>
                        {files.map((file, index) => (
                            <li key={`${file.path}-${index}`} className={styles.fileListItem} style={{ animationDelay: `${index * 100}ms` }}>
                                <div className={styles.fileInfo}>
                                    <FileIcon />
                                    <span className={styles.fileName}>{file.name}</span>
                                </div>
                                <div className={styles.fileActions}>
                                    <span className={styles.fileSize}>{Math.round(file.size / 1024)} KB</span>
                                    <button onClick={() => removeFile(file.name)} className={styles.removeButton} title="Remove file">
                                        &times;
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>
            )}

            <button onClick={handleUpload} disabled={files.length === 0}
                className={`${btnStyles.btn} ${btnStyles.btnPrimary}`} style={{marginTop: '1.5rem'}}>
                Upload {files.length} {files.length === 1 ? 'file' : 'files'}
            </button>
        </div>
    );
};

export default UploadPage;