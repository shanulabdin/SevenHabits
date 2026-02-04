import { FlexWidget, TextWidget } from "react-native-android-widget";

export function GridWidget({ widgetId }: { 
  widgetId: number | string; 
  event?: any;
  }) {
  return (
    <FlexWidget
      style={{
        width: 180,
        height: 120,
        padding: 12,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111111",
      }}
    >
      <TextWidget
        text="Forge Grid"
        style={{
          color: "#ffffff",
          fontSize: 16,
        }}
      />
    </FlexWidget>
  );
}
