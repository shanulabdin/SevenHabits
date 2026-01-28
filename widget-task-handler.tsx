import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import { GridWidget } from "./src/widgets/GridWidget";
import { PercentWidget } from "./src/widgets/PercentWidget";
import { StreakOnlyWidget } from "./src/widgets/StreakOnlyWidget";

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetInfo, widgetAction } = props;

  switch (widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED": {
      if (widgetInfo.widgetName === "StreakOnly") {
        props.renderWidget({
          light: <StreakOnlyWidget title="Forge" streak={12} bg={"#FFFFFF"} text={"#111111"} muted={"#11111199"} />,
          dark: <StreakOnlyWidget title="Forge" streak={12} bg={"#000000"} text={"#FFFFFF"} muted={"#FFFFFFB3"} />,
        });
        return;
      }
      if (widgetInfo.widgetName === "PercentCard") {
        props.renderWidget({
          light: <PercentWidget title="Forge" percent={64} subtitle="32/50" bg={"#FFFFFF"} text={"#111111"} muted={"#11111199"} />,
          dark: <PercentWidget title="Forge" percent={64} subtitle="32/50" bg={"#000000"} text={"#FFFFFF"} muted={"#FFFFFFB3"} />,
        });
        return;
      }

      if (widgetInfo.widgetName === "GridWidget") {
        // fallback dummy data (real data will come from requestWidgetUpdate)
        const todayKey = new Date().toISOString().slice(0, 10);
        props.renderWidget({
          light: (
            <GridWidget
              history={{}}
              endDateKey={todayKey}
              bg={"#FFFFFF"}
              orange={"#FF6D1F"}
              muted={"#00000014"}
            />
          ),
          dark: (
            <GridWidget
              history={{}}
              endDateKey={todayKey}
              bg={"#000000"}
              orange={"#FF6D1F"}
              muted={"#FFFFFF14"}
            />
          ),
        });
        return;
      }

      return;
    }

    case "WIDGET_CLICK":
      // Not needed if you use clickAction: "OPEN_APP"
      return;

    default:
      return;
  }
}
