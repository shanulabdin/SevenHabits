import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";
import { HabitWidget } from "./src/widgets/HabitWidget";

// This string must match the widgetName we'll register later in Expo config.
// We'll use "Habit" for v1 to keep it simple.
const nameToWidget = {
  Habit: HabitWidget,
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetInfo, widgetAction } = props;

  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget] ??
    HabitWidget;

  switch (widgetAction) {
    case "WIDGET_ADDED":
      props.renderWidget(<Widget title="Forge" streak={0} percent7d={0} />);
      break;

    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED":
      props.renderWidget(<Widget title="Forge" streak={0} percent7d={0} />);
      break;

    case "WIDGET_DELETED":
      // We'll handle cleanup later (v1 can ignore)
      break;

    case "WIDGET_CLICK":
      // We'll wire "tap opens app" later in v1.
      break;

    default:
      break;
  }
}
