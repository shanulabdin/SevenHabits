import Storage from 'expo-sqlite/kv-store';
import type { ColorProp, WidgetTaskHandlerProps } from 'react-native-android-widget';
import { CounterWidget } from './CounterWidget';
import { HelloWidget } from './HelloWidget';

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  Hello: HelloWidget,
  Counter: CounterWidget
};

export const COUNTER_STORAGE_KEY = "CounterWidget:count";
export const COUNTER_BACKGROUND_KEY = "CounterWidget:backgroundColor";

export function getStoredBackgroundColor(): ColorProp {
  return (Storage.getItemSync(COUNTER_BACKGROUND_KEY) ||
    "#1F2937") as ColorProp
}

function getStorageData(): { count: number; backgroundColor: ColorProp } {
  const stored = Storage.getItemSync(COUNTER_STORAGE_KEY);
  const count = stored ? Number(stored) : 0;
  const backgroundColor = getStoredBackgroundColor();

  return { count, backgroundColor };
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const Widget =
    nameToWidget[
      widgetInfo.widgetName as keyof typeof nameToWidget
    ] as any;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED': {
      if (widgetInfo.widgetName === "Counter") {
        const { count, backgroundColor } = getStorageData();
        props.renderWidget(<Widget count={count} backgroundColor={backgroundColor} />);
      } else {
        props.renderWidget(<Widget />);
      }
      break;
    }
    case 'WIDGET_UPDATE':
      // Not needed for now
      break;

    case 'WIDGET_RESIZED':
      // Not needed for now
      break;

    case 'WIDGET_DELETED':
      // Not needed for now
      break;

    case 'WIDGET_CLICK':
      // Not needed for now
      break;

    default:
      break;
  }
}