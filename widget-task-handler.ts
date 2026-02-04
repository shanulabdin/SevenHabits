import type { WidgetTaskHandlerProps as BaseProps } from "react-native-android-widget";

// Use 'extends' to inherit everything from the library and add your keys
interface WidgetTaskHandlerProps extends BaseProps {
  widgetId: string;
  widgetName: string;
}

export default async function widgetTaskHandler({
  widgetId,
  widgetName,
}: WidgetTaskHandlerProps) {
  return {
    widgetId,
    widgetName,
  };
}