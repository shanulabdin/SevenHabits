'use no memo';

import {
  FlexWidget,
  TextWidget,
  type FlexWidgetProps,
} from "react-native-android-widget";

type Props = {
  title: string;
  streak: number;
};

export function StreakOnlyWidget({ title, streak }: Props) {
  const containerStyle: FlexWidgetProps["style"] = {
    width: "match_parent",
    height: "match_parent",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#151515",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <FlexWidget style={containerStyle}>
      {/* 🔥 + streak */}
      <FlexWidget
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <TextWidget
          text={`${streak}`}
          style={{
            fontSize: 32,
            fontFamily: "Poppins_600SemiBold",
            color: "#FFFFFF",
          }}
        />
        <TextWidget
          text="🔥"
          style={{
            fontSize: 28, // icon size
            marginRight: 6,
          }}
        />
      </FlexWidget>

      {/* Habit title */}
      <TextWidget
        text={title}
        style={{
          fontSize: 14,
          fontFamily: "Poppins_600SemiBold",
          color: "#ffffffb3",
        }}
      />
    </FlexWidget>
  );
}

// "Poppins_400Regular"
// "Poppins_500Medium"
// "Poppins_600SemiBold"
// "Poppins_700Bold"