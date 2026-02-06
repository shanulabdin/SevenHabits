import type { ColorProp } from "react-native-android-widget";
import { FlexWidget, ImageWidget, TextWidget } from "react-native-android-widget";

interface CounterWidgetProps {
  count: number;
  backgroundColor?: ColorProp;
}

export function CounterWidget({
  count,
  backgroundColor
}: CounterWidgetProps) {

//   #FFFFFF
//   #FF6D1F
// #00000026

// #000000
//   #FF6D1F
//   #ffffff26

  const isDarkBackground = backgroundColor === "#1F2937" || "#EC4899";

  const textColor = isDarkBackground ? "#FFFFFF" : "#00000026";
  const subtitleColor = isDarkBackground ? "#FFFFFF" : "#000000";

  const buttonColors: Record<string, ColorProp> = {
    '#4ade80': '#059669',
    '#38bdf8': '#1d4ed8',
    '#fbbf24': '#b45309',
    '#fb7185': '#be123c',
    '#818cf8': '#4338ca',
    '#c084fc': '#7e22ce',
    '#22d3ee': '#0f766e',
  };

  const buttonBg: ColorProp = buttonColors[backgroundColor as string] || '#5e5e5eff';

  return (
    <FlexWidget
      style={{
        height: "match_parent",
        width: "match_parent",
        backgroundColor: backgroundColor,
        borderRadius: 24,
        padding: 12,
        flexDirection: "column",
      }}
      clickAction="OPEN_APP"
    >
      {/* Header with Expo branding */}
      <FlexWidget
        style={{
          width: "match_parent",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          height: "wrap_content",
        }}
      >
        <ImageWidget
          image={require("../assets/images/flame-1.svg")}
          imageWidth={14}
          imageHeight={14}
          radius={3}
        />
        <TextWidget
          text="Powered by Expo"
          style={{
            fontSize: 10,
            color: subtitleColor,
            fontWeight: "500",
            marginLeft: 4,
          }}
        />
      </FlexWidget>

      {/* Main counter section - takes remaining space and centers content */}
      <FlexWidget
        style={{
          width: "match_parent",
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexGap: 12,
        }}
      >
        {/* Decrement button */}
        <FlexWidget
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: buttonBg,
            alignItems: "center",
            justifyContent: "center",
          }}
          clickAction="DECREMENT"
          clickActionData={{ value: count, backgroundColor }}
        >
          <TextWidget
            text="-"
            style={{
              fontSize: 24,
              color: textColor,
              fontWeight: "300",
            }}
          />
        </FlexWidget>

        {/* Count display */}
        <TextWidget
          text={`${count}`}
          style={{
            fontSize: 48,
            color: textColor,
            fontWeight: "200",
            fontFamily: "sans-serif-light",
          }}
        />

        {/* Increment button */}
        <FlexWidget
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: buttonBg,
            alignItems: "center",
            justifyContent: "center",
          }}
          clickAction="INCREMENT"
          clickActionData={{ value: count, backgroundColor }}
        >
          <TextWidget
            text="+"
            style={{
              fontSize: 24,
              color: textColor,
              fontWeight: "300",
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Footer label */}
      <FlexWidget
        style={{
          width: "match_parent",
          alignItems: "center",
          justifyContent: "center",
          height: "wrap_content",
        }}
      >
        <TextWidget
          text="COUNTER"
          style={{
            fontSize: 9,
            color: subtitleColor,
            fontWeight: "600",
            letterSpacing: 2,
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}
