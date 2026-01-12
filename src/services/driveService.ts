import axios from 'axios';

const DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v3/files';
const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3/files';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  thumbnailLink?: string;
  iconLink?: string;
}

export const driveService = {
  /**
   * Upload a file to Google Drive
   * Returns the file metadata including the shareable link
   */
  uploadFile: async (token: string, file: File): Promise<DriveFile> => {
    const metadata = {
      name: file.name,
      mimeType: file.type,
    };

    // Create multipart form data
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', file);

    try {
      // Upload file
      const uploadResponse = await axios.post(
        `${DRIVE_UPLOAD_URL}?uploadType=multipart&fields=id,name,mimeType,webViewLink`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fileId = uploadResponse.data.id;

      // Make file shareable (anyone with link can view)
      await axios.post(
        `${DRIVE_API_URL}/${fileId}/permissions`,
        {
          role: 'reader',
          type: 'anyone',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Get updated file metadata with webViewLink
      const fileResponse = await axios.get(
        `${DRIVE_API_URL}/${fileId}?fields=id,name,mimeType,webViewLink,thumbnailLink,iconLink`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return fileResponse.data;
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to upload file';
      console.error('Drive upload error:', error.response?.data || error);
      throw new Error(message);
    }
  },

  /**
   * Delete a file from Google Drive
   */
  deleteFile: async (token: string, fileId: string): Promise<void> => {
    try {
      await axios.delete(`${DRIVE_API_URL}/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to delete file';
      throw new Error(message);
    }
  },
};
