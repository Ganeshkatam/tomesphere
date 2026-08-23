"use client";

import { useState, useCallback, useEffect } from "react";
import { checkUserPermissionAction, grantUserPermissionAction } from "@/modules/storage/presentation/actions/storage";

export function usePhotoUploadPermission() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [onAllowCallback, setOnAllowCallback] = useState<((file: File) => void) | null>(null);

  // Check initial permission status from database
  useEffect(() => {
    let isMounted = true;
    checkUserPermissionAction("photo_upload").then((res) => {
      if (isMounted && res.success) {
        setHasPermission(res.data.granted);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Request permission to upload a photo file.
   * If permission was already granted in database, directly executes onProceed(file).
   * Otherwise, opens the permission request modal.
   */
  const requestPhotoUpload = useCallback(
    async (file: File, onProceed: (file: File) => void) => {
      // If we already know permission is granted in current session
      if (hasPermission === true) {
        onProceed(file);
        return;
      }

      // Verify live from database if not cached yet
      if (hasPermission === null) {
        const checkRes = await checkUserPermissionAction("photo_upload");
        if (checkRes.success && checkRes.data.granted) {
          setHasPermission(true);
          onProceed(file);
          return;
        }
      }

      // User has not granted permission yet -> Open permission modal
      setPendingFile(file);
      setOnAllowCallback(() => onProceed);
    },
    [hasPermission],
  );

  /**
   * Called when user clicks "Allow" in permission modal
   */
  const handleAllow = useCallback(
    async (file: File) => {
      setHasPermission(true);
      await grantUserPermissionAction("photo_upload");
      const cb = onAllowCallback;
      setPendingFile(null);
      setOnAllowCallback(null);
      if (cb) {
        cb(file);
      }
    },
    [onAllowCallback],
  );

  /**
   * Called when user clicks "Don't Allow" in permission modal
   */
  const handleDeny = useCallback(() => {
    setPendingFile(null);
    setOnAllowCallback(null);
  }, []);

  return {
    hasPermission,
    pendingFile,
    requestPhotoUpload,
    handleAllow,
    handleDeny,
  };
}
