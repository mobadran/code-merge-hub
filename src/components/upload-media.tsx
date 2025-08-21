"use client";

import React, { useRef, useState } from "react";

type UploadMediaProps = {
  /** Endpoint in your Next.js API that returns the presigned POST */
  endpoint: string;

  /** Optional callback when upload succeeds */
  onUploaded?: (urls: string[]) => void;

  /** Optional callback when upload fails */
  onError?: (error: Error) => void;

  /** Children render-prop, so you can control UI */
  children: (props: {
    selectFile: () => void;
    isUploading: boolean;
    progress: number;
    error: string | null;
    files: File[];
  }) => React.ReactNode;

  /** Restrict file types (image/*, video/*, etc.) */
  accept?: string;

  /** Allow multiple file selection */
  multiple?: boolean;
};

export default function UploadMedia({
  endpoint,
  onUploaded,
  onError,
  children,
  accept,
}: UploadMediaProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const selectFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);

    try {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      const uploadedUrls: string[] = [];

      // Process each file sequentially
      for (const file of selectedFiles) {
        // Step 1: request presigned POST from server
        const presignRes = await fetch(
          endpoint + "?contentType=" + file.type
        ).catch(() => {
          throw new Error("Failed to get presigned URL");
        });

        if (!presignRes.ok) {
          throw new Error("Failed to get presigned URL");
        }

        const { postURL: url, formData: fields } = await presignRes.json();

        // Step 2: build FormData
        const formData = new FormData();
        Object.entries(fields).forEach(([k, v]) => {
          formData.append(k, v as string);
        });
        formData.append("file", file);

        // Step 3: upload to MinIO directly
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", url, true);

          xhr.upload.onprogress = (evt) => {
            if (evt.lengthComputable) {
              // Update progress for the current file
              const fileProgress = Math.round((evt.loaded / evt.total) * 100);
              // Calculate overall progress across all files
              const fileIndex = selectedFiles.indexOf(file);
              const progressPerFile = 100 / selectedFiles.length;
              const baseProgress = (fileIndex / selectedFiles.length) * 100;
              const currentFileProgress =
                (fileProgress / 100) * progressPerFile;
              setProgress(baseProgress + currentFileProgress);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 204) {
              const fileUrl = `${url}/${fields.key}`;
              uploadedUrls.push(fileUrl);
              resolve();
            } else {
              reject(new Error(`Upload failed for file: ${file.name}`));
            }
          };

          xhr.onerror = () =>
            reject(new Error(`Upload failed for file: ${file.name}`));
          xhr.send(formData);
        });
      }

      // All files uploaded successfully
      onUploaded?.(uploadedUrls);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
      onError?.(err);
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
        multiple
      />
      {children({
        selectFile,
        isUploading,
        progress,
        error,
        files,
      })}
    </>
  );
}
