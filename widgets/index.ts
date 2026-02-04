import type { WidgetTaskHandlerProps as BaseProps } from "react-native-android-widget";

// Use 'extends' to inherit everything from the library and add your keys
interface WidgetTaskHandlerProps extends BaseProps {
  widgetId: string;
  widgetName: string;
  event: any;
}
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
