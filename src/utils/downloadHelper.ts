/**
 * Helper function to trigger a file download from a Blob.
 * 
 * @param blob The Blob data received from the API.
 * @param filename The desired filename for the downloaded file.
 */
export const downloadFileFromBlob = (blob: Blob, filename: string) => {
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    
    // Append to body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    if (link.parentNode) link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
};
