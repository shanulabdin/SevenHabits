import {
  FlexWidget,
  TextWidget,
} from "react-native-android-widget";

export function GridWidget() {
  return (
    <FlexWidget
      style={{
        width: "match_parent",
        height: "match_parent",
        padding: 12,
        backgroundColor: "#111",
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextWidget
        text="Forge Widget"
        style={{
          fontSize: 16,
          color: "#fff",
          fontWeight: "600",
        }}
      />
    </FlexWidget>
  );
}
