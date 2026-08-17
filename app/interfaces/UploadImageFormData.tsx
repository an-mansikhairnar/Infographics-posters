export interface UploadImageFormData {
  imgFolder: string;
  fullImageUrl: string;      // was File | null — now a built URL string
  thumbImageUrl: string;     // was File | null — now a built URL string
  imageAltText: string;
  fullImageFile: File | null;  // keep the raw file around for the actual upload
  thumbImageFile: File | null;
}