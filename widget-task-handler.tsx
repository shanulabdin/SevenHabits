import React from "react";
import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import { HabitWidget } from "./src/widgets/HabitWidget";
import { StreakOnlyWidget } from "./src/widgets/StreakOnlyWidget";

// Map widgetName -> component
const nameToWidget = {
  Habit: HabitWidget,           // existing widget
  StreakOnly: StreakOnlyWidget, // NEW widget
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetInfo, widgetAction } = props;
  console.log("widgetInfo", widgetInfo);

  const Widget =
    nameToWidget[widgetInfo.widgetName as keyof typeof nameToWidget] ??
    HabitWidget;

  switch (widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED": {
      // Temporary static data for v1 wiring
      // (We’ll replace this with real habit data next)
      if (widgetInfo.widgetName === "StreakOnly") {
        props.renderWidget(
          <StreakOnlyWidget title="Forge" streak={12} />
        );
      } else {
        props.renderWidget(
          <HabitWidget title="Forge" streak={12} percent7d={64} />
        );
      }
      break;
    }

    case "WIDGET_CLICK":
      // Tap already opens the app via default intent — no-op here
      break;

    case "WIDGET_DELETED":
      // No cleanup needed for v1
      break;

    default:
      break;
  }
}
