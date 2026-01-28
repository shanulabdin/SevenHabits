import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import { PercentWidget } from "./src/widgets/PercentWidget";
import { StreakOnlyWidget } from "./src/widgets/StreakOnlyWidget";

// Map widgetName -> component

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetInfo, widgetAction } = props;

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
        props.renderWidget({
          light: <PercentWidget title="7 Day Score" percent={64} subtitle="32/50" bg={"#F6F6F6"} text={"#FFFFFF"} muted={"#0000004c"} />,
          dark: <PercentWidget title="7 Day Score" percent={64} subtitle="32/50" bg={"#151515"} text={"#000000"} muted={"#ffffffb3"} />,
        });
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
