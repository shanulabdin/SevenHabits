import type { WidgetTaskHandlerProps } from "react-native-android-widget";

/**
 * SAFETY GUARD
 * If anything throws here, it will NOT affect app startup
 */
export async function widgetTaskHandler({
  widgetName,
  widgetId,
  event,
}: WidgetTaskHandlerProps) {
  try {
    if (widgetName === "Grid") {
      const { GridWidget } = await import("./GridWidget");
      return GridWidget({ widgetId, event });
    }
  } catch (e) {
    // NEVER throw — widgets must fail silently
    console.warn("Widget error:", e);
  }
}
