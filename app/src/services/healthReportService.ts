import { toast } from '@/components/ui/use-toast';
import LocalStorageManager from '@/lib/localStorageManager';
import { api } from '@/lib/httpClient';

export interface HealthReportUploadResponse {
  success: boolean;
  message: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  timestamp: string;
  service: string;
}

export interface HealthReportFile {
  name: string;
  size: number;
  url?: string;
}

const UPLOAD_ENDPOINT = '/onboarding/upload-health-report';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates file before upload
 */
const validateFile = (file: File): { isValid: boolean; error?: string } => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: 'File too large. Please upload a file smaller than 10MB'
    };
  }

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload PDF, DOC, TXT, JPG, or PNG files'
    };
  }

  return { isValid: true };
}

/**
 * Uploads a health report file to the backend
 */
export const uploadHealthReport = async (file: File): Promise<HealthReportUploadResponse> => {
  // Note: Authentication is handled by cookie-based session in httpClient

  // Validate file
  const validation = validateFile(file);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Create FormData for file upload
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Use the central api client which handles cookies and authentication
    const response = await api.post(UPLOAD_ENDPOINT, formData, {
      requireAuth: true
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to upload health report');
    }

    return response.data as HealthReportUploadResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error occurred while uploading file');
  }
}

/**
 * Handles file upload with UI feedback
 */
export const handleFileUpload = async (
  file: File,
  onSuccess: (fileData: HealthReportFile) => void,
  onError?: (error: string) => void
): Promise<void> => {
  try {
    const result = await uploadHealthReport(file);

    const fileData: HealthReportFile = {
      name: result.fileName,
      size: result.fileSize,
      url: result.fileUrl
    };

    onSuccess(fileData);

    toast({
      title: "Upload successful",
      description: "Health report uploaded successfully",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to upload health report";

    if (onError) {
      onError(errorMessage);
    }

    toast({
      title: "Upload failed",
      description: errorMessage,
      variant: "destructive",
    });
  }
}

/**
 * Extracts filename from URL
 */
export const extractFileNameFromUrl = (url: string): string => {
  return url.split('/').pop()?.split('?')[0] || 'health-report.pdf';
}

/**
 * Formats file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Gets file type icon based on file extension
 */
export const getFileTypeIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'pdf':
      return '📄';
    case 'doc':
    case 'docx':
      return '📝';
    case 'txt':
      return '📄';
    case 'jpg':
    case 'jpeg':
    case 'png':
      return '🖼️';
    default:
      return '📄';
  }
}

export interface BiomarkerData {
  name: string;
  value: number | string;
  unit: string;
  ref_range: string;
  flag: 'low' | 'normal' | 'high' | 'elevated' | string;
  importance: string;
  test_group: string;
}

export interface HealthReportSummaryResponse {
  status: 'success' | 'no_report' | 'error';
  report_date?: string;
  biomarkers?: BiomarkerData[];
}

/**
 * Fetches the health report summary for a user
 */
export const fetchHealthReportSummary = async (userId: string): Promise<HealthReportSummaryResponse> => {
  try {
    const response = await api.get(`/athena/user/${userId}/health-report-summary`, {
      requireAuth: true
    });

    // api in httpClient assumes success response is the body or wrapped. 
    // Assuming our backend endpoints return JSON response directly:
    const anyRes = response as any;
    if (anyRes && anyRes.status === 'success') {
      return anyRes;
    } else if (anyRes && anyRes.status === 'no_report') {
      return { status: 'no_report' };
    }

    // In case the api helper returns { data, success } wrapping:
    if (response.success && response.data) {
      return response.data as HealthReportSummaryResponse;
    }

    return response as any;
  } catch (error) {
    console.error(`Failed to fetch health report summary for user ${userId}`, error);
    return { status: 'error' };
  }
}

