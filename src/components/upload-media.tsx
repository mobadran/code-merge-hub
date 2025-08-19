"use client";

import React, { useRef, useState } from "react";

type UploadMediaProps = {
  /** Endpoint in your Next.js API that returns the presigned POST */
  endpoint: string;

  /** Optional callback when upload succeeds */
  onUploaded?: (url: string) => void;

  /** Optional callback when upload fails */
  onError?: (error: Error) => void;

  /** Children render-prop, so you can control UI */
  children: (props: {
    selectFile: () => void;
    isUploading: boolean;
    progress: number;
    error: string | null;
    file: File | null;
  }) => React.ReactNode;

  /** Restrict file types (image/*, video/*, etc.) */
  accept?: string;
};

export default function UploadMedia({
  endpoint,
  onUploaded,
  onError,
  children,
  accept,
}: UploadMediaProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const selectFile = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);

    try {
      setError(null);
      setIsUploading(true);
      setProgress(0);

      // Step 1: request presigned POST from server
      const presignRes = await fetch(
        endpoint + "?contentType=" + selected.type
      );

      if (!presignRes.ok) {
        throw new Error("Failed to get presigned URL");
      }

      const { postURL: url, formData: fields } = await presignRes.json();
      console.log(url, fields);

      // Step 2: build FormData
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => {
        formData.append(k, v as string);
      });
      formData.append("file", selected);

      // Step 3: upload to MinIO directly
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable) {
            setProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 204) {
            setProgress(100);
            onUploaded?.(`${url}/${fields.key}`);
            resolve();
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(formData);
      });
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
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        onChange={handleFileChange}
      />
      {children({ selectFile, isUploading, progress, error, file })}
    </>
  );
}
