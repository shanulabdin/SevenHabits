import { useCallback, useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";

type Colors = {
  card: string;
  border: string;
  text: string;
  mutedText: string;
  confirmBg: string;
  confirmText: string;
}

export function useComingSoon(colors: Colors) {
  const [visible, setVisible] = useState(false);

  const openComingSoon = useCallback(() => setVisible(true), []);
  const closeComingSoon = useCallback(() => setVisible(false), []);

  const ComingSoonModal = (
    <ConfirmModal
      visible={visible}
      title="Coming soon"
      message="This feature is under development."
      cancelText="Close"
      confirmText="OK"
      onCancel={closeComingSoon}
      onConfirm={closeComingSoon}
      colors={colors}
    />
  );

  return { openComingSoon, ComingSoonModal }
}