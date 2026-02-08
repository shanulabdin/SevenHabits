import { useThemeColors } from "@/constants/theme";
import { hapticHeavy, hapticLight } from "@/utils/haptics";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string | React.ReactNode;

  onCancel?: () => void;
  onConfirm: () => void;

  cancelText?: string;
  showCancel?: boolean;
  confirmText?: string;

  // Optional: disable/opacity + countdown label
  confirmDisabled?: boolean;
  countdown?: number; // e.g. 3 -> shows "Delete 3"
  confirmCountdownLabel?: (count: number) => string;


  // Optional: modal width/padding overrides if needed
  containerStyle?: any;
};

export default function ConfirmModal({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  showCancel = true,
  confirmText = "Confirm",
  confirmDisabled = false,
  countdown,
  confirmCountdownLabel,
  containerStyle,
}: ConfirmModalProps) {
  const isCountdownActive = typeof countdown === "number" && countdown > 0;
  const disabled = confirmDisabled || isCountdownActive;

  const confirmLabel = isCountdownActive
    ? (confirmCountdownLabel ? confirmCountdownLabel(countdown!) : `${confirmText} ${countdown}`)
    : confirmText;

  const { colors } = useThemeColors();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            { backgroundColor: colors.card, borderColor: colors.border },
            containerStyle,
          ]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>

          {typeof message === "string" ? (
            <Text style={[styles.modalText, { color: colors.text }]}>{message}</Text>
          ) : (
            message
          )}

          <View style={styles.actions}>
            {showCancel && (
              <Pressable
                onPress={() => {
                  hapticLight();
                  onCancel?.();
                }}
                style={[styles.cancelBtn, { borderColor: colors.border }]}
              >
                <Text style={{ color: colors.text, fontFamily: "Poppins_400Regular" }}>{cancelText}</Text>
              </Pressable>
            )}

            <Pressable
              disabled={disabled}
              onPress={() => {
                hapticHeavy();
                onConfirm();
              }}
              style={[
                styles.confirmBtn,
                { backgroundColor: colors.orange, opacity: disabled ? 0.6 : 1,  },
              ]}
            >
              <Text style={[styles.confirmText, { color: colors.background }]}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 30,
  },
  modal: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
    fontFamily: "Poppins_600SemiBold",
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
  },
  cancelBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  confirmBtn: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  confirmText: {
    fontFamily: "Poppins_500Medium",
  },
});
