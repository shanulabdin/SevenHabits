import ConfirmModal from "@/components/ConfirmModal";
import { useCallback, useEffect, useState } from "react";

type UseConfirmModalArgs = {
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onCancel?: () => void;

  onConfirm: (id?: string) => void;

  countdownSeconds?: number; // optional
};

export function useConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onCancel,
  onConfirm,
  countdownSeconds,
}: UseConfirmModalArgs) {
  const [visible, setVisible] = useState(false);
  const [countdown, setCountdown] = useState(countdownSeconds ?? 0);

  const openConfirm = useCallback(() => {
    setCountdown(countdownSeconds ?? 0);
    setVisible(true);
  }, [countdownSeconds]);

  const closeConfirm = useCallback(() => {
    setVisible(false);
  }, []);

  useEffect(() => {
    if (!visible || countdown <= 0) return;

    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [visible, countdown]);

  const Confirm = (
    <ConfirmModal
      visible={visible}
      title={title}
      message={message}
      cancelText={cancelText}
      confirmText={confirmText}
      countdown={countdown}
      confirmCountdownLabel={(c) => `${confirmText} ${c}`}
      onConfirm={() => {
        closeConfirm();
        onConfirm();
      }}
      onCancel={() => {
        closeConfirm();
        onCancel?.();   // optional external callback
      }}

    />
  );

  return {
    openConfirm,
    closeConfirm,
    Confirm,
    visible, // optional, sometimes useful
  };
}
