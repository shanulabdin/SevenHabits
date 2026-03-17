import { useThemeColors } from "@/constants/theme";
import type { Reminder } from "@/types/habit";
import { DAY_LABELS, dayIndexToExpoWeekday, expoWeekdayToDayIndex } from "@/utils/notifications";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  reminder: Reminder | null;
  onChange: (reminder: Reminder | null) => void;
};

export default function ReminderPicker({ reminder, onChange }: Props) {
  const { colors } = useThemeColors();
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Enabled state
  const enabled = reminder !== null;

  // Parse time or use default
  const timeStr = reminder?.time ?? "08:00";
  const [h, m] = timeStr.split(":").map(Number);
  const timeDate = new Date();
  timeDate.setHours(h, m, 0, 0);

  // Selected days (as 0-indexed: 0=Sun…6=Sat)
  const selectedDays = new Set(
    (reminder?.days ?? [2, 3, 4, 5, 6]).map(expoWeekdayToDayIndex) // Default: Mon-Fri
  );

  function toggleEnabled() {
    if (enabled) {
      onChange(null);
    } else {
      // Turn on with defaults: 08:00 Mon-Fri
      onChange({
        time: "08:00",
        days: [2, 3, 4, 5, 6], // Mon-Fri in Expo weekday format
      });
    }
  }

  function toggleDay(dayIndex: number) {
    if (!enabled) return;
    const newDays = new Set(selectedDays);
    if (newDays.has(dayIndex)) {
      if (newDays.size <= 1) return; // Must have at least 1 day
      newDays.delete(dayIndex);
    } else {
      newDays.add(dayIndex);
    }
    onChange({
      time: timeStr,
      days: Array.from(newDays).map(dayIndexToExpoWeekday),
    });
  }

  function onTimeChange(_event: DateTimePickerEvent, date?: Date) {
    setShowTimePicker(Platform.OS === "ios"); // iOS keeps picker open
    if (date && enabled) {
      const newTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      onChange({
        time: newTime,
        days: reminder?.days ?? [2, 3, 4, 5, 6],
      });
    }
  }

  // Format display time
  const displayTime = timeDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Toggle row */}
      <Pressable style={styles.toggleRow} onPress={toggleEnabled}>
        <View style={styles.toggleLeft}>
          <Ionicons
            name="notifications-outline"
            size={20}
            color={enabled ? colors.orange : colors.text}
          />
          <Text style={[styles.label, { color: colors.text }]}>Reminder</Text>
        </View>
        <View
          style={[
            styles.toggleTrack,
            { backgroundColor: enabled ? colors.orange : colors.border },
          ]}
        >
          <View
            style={[
              styles.toggleThumb,
              {
                backgroundColor: enabled ? "#fff" : colors.text,
                transform: [{ translateX: enabled ? 18 : 2 }],
              },
            ]}
          />
        </View>
      </Pressable>

      {enabled && (
        <>
          {/* Time picker */}
          <Pressable
            style={[styles.timeRow, { borderTopColor: colors.border }]}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={[styles.timeLabel, { color: colors.text }]}>Time</Text>
            <Text style={[styles.timeValue, { color: colors.orange }]}>
              {displayTime}
            </Text>
          </Pressable>

          {showTimePicker && (
            <DateTimePicker
              value={timeDate}
              mode="time"
              is24Hour={false}
              onChange={onTimeChange}
            />
          )}

          {/* Day selector */}
          <View style={styles.daysRow}>
            {DAY_LABELS.map((label, i) => {
              const active = selectedDays.has(i);
              return (
                <Pressable
                  key={label}
                  onPress={() => toggleDay(i)}
                  style={[
                    styles.dayChip,
                    {
                      backgroundColor: active ? colors.orange : "transparent",
                      borderColor: active ? colors.orange : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      { color: active ? "#000" : colors.text },
                    ]}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },

  toggleTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
  },
  timeValue: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },

  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    gap: 6,
  },
  dayChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  dayChipText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
  },
});
