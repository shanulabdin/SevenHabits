import Storage from 'expo-sqlite/kv-store';
import { Linking } from 'react-native';
import type { ColorProp, WidgetTaskHandlerProps } from 'react-native-android-widget';
import { CounterWidget } from './CounterWidget';
import { HelloWidget } from './HelloWidget';
import { StreakWidget } from './StreakWidget';

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  Hello: HelloWidget,
  Counter: CounterWidget,
  Streak: StreakWidget,
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
      } else if (widgetInfo.widgetName === "Streak") {
        props.renderWidget({
          light: <Widget
            title="Forge"
            streak={12}
            bg={"#FFFFFF"}
            text={"#111111"}
            muted={"#11111199"}
          />,
          dark: <Widget
            title="Forge"
            streak={12}
            bg={"#000000"}
            text={"#FFFFFF"}
            muted={"#FFFFFFB3"}
          />,
        });
      } else {
        props.renderWidget(<Widget />);
      }
      break;
    }
    case 'WIDGET_UPDATE': {
      if (widgetInfo.widgetName === "Counter") {
        const { count, backgroundColor } = getStorageData();
        props.renderWidget(<Widget count={count} backgroundColor={backgroundColor} />);
      } else if (widgetInfo.widgetName === "Streak") {
        props.renderWidget(<Widget title="Forge" streak={12} bg={"#FFFFFF"} text={"#111111"} muted={"#11111199"} />);
      } else {
        props.renderWidget(<Widget />);
      }
      break;
    }

    case 'WIDGET_RESIZED':
      // Not needed for now
      break;

    case 'WIDGET_DELETED':
      // Not needed for now
      break;

    case 'WIDGET_CLICK': {
      if (props.clickAction === "OPEN_APP") {
        Linking.openURL("forge://home")
        break;
      }

      if (props.clickAction === "OPEN_APP") {
        Linking.openURL("forge://home")
        break;
      }

      if (widgetInfo.widgetName === "Counter") {
        const currentValue = Number(props.clickActionData?.value) || 0;
        const backgroundColor = (props.clickActionData?.backgroundColor || getStoredBackgroundColor()) as ColorProp;

        const count = currentValue + (props.clickAction === "INCREMENT" ? 1 : -1);

        props.renderWidget(<Widget count={count} backgroundColor={backgroundColor} />);

        Storage.setItemSync(COUNTER_STORAGE_KEY, `${count}`)
      }

      break;
    }

    default:
      break;
  }
}