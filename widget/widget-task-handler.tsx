import Storage from 'expo-sqlite/kv-store';
import { Linking } from 'react-native';
import type { ColorProp, WidgetTaskHandlerProps } from 'react-native-android-widget';
import { CounterWidget } from './CounterWidget';
import { ScoreWidget } from './ScoreWidget';
import { StreakWidget } from './StreakWidget';

const nameToWidget = {
  // Hello will be the **name** with which we will reference our widget.
  Counter: CounterWidget,
  Streak: StreakWidget,
  Score: ScoreWidget,
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

const STREAK_STORAGE_KEY = "@forge/widget_streak";
const STREAK_TITLE_KEY = "@forge/widget_title";

function getStoredStreakData() {
  const streak = Number(Storage.getItemSync(STREAK_STORAGE_KEY)) || 0;
  const title = Storage.getItemSync(STREAK_TITLE_KEY) || "Forge";

  return { streak, title };
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
        const { streak, title } = getStoredStreakData();

        props.renderWidget({
          light:
            <Widget
              title={title ? title : "Forge"}
              streak={streak ? streak : 0}
              bg={"#FFFFFF"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title ? title : "Forge"}
              streak={streak ? streak : 0}
              bg={"#000000"}
              text={"#FFFFFF"}
              muted={"#FFFFFFB3"}
            />,
        });

      } else if (widgetInfo.widgetName === "Score") {
        const { title } = getStoredStreakData();

        props.renderWidget({
          light:
            <Widget
              title={title ? title : "Forge"}
              percent={0}
              subtitle="32/50"
              bg={"#FFFFFF"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title ? title : "Forge"}
              percent={0}
              subtitle="32/50"
              bg={"#000000"}
              text={"#FFFFFF"}
              muted={"#FFFFFFB3"}
            />
        });
      }
      break;
    }
    case 'WIDGET_UPDATE': {
      if (widgetInfo.widgetName === "Counter") {
        const { count, backgroundColor } = getStorageData();
        props.renderWidget(<Widget count={count} backgroundColor={backgroundColor} />);

      } else if (widgetInfo.widgetName === "Streak") {
        const { streak, title } = getStoredStreakData();

        props.renderWidget({
          light:
            <Widget
              title={title ? title : "Forge"}
              streak={streak ? streak : "Forge"}
              bg={"#FFFFFF"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title}
              streak={streak ? streak : 0}
              bg={"#000000"}
              text={"#FFFFFF"}
              muted={"#FFFFFFB3"}
            />,
        });

      } else if (widgetInfo.widgetName === "Score") {
        const { title } = getStoredStreakData();

        props.renderWidget({
          light:
            <Widget
              title={title ? title : "Forge"}
              percent={80}
              subtitle="32/50"
              bg={"#FFFFFF"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title ? title : "Forge"}
              percent={80}
              subtitle="32/50"
              bg={"#000000"}
              text={"#FFFFFF"}
              muted={"#FFFFFFB3"}
            />
        });
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