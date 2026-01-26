import { useCallback, useState } from "react";
import ConfirmModal from "../../components/ConfirmModal";


export function useComingSoon() {
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
      showCancel={false}
      onConfirm={closeComingSoon}
    />
  );

  return { openComingSoon, ComingSoonModal }
}