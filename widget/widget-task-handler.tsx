import Storage from 'expo-sqlite/kv-store';
import { Linking } from 'react-native';
import type { ColorProp, WidgetTaskHandlerProps } from 'react-native-android-widget';
import { GridWidget } from './GridWidget';
import { ScoreWidget } from './ScoreWidget';
import { StreakWidget } from './StreakWidget';

const nameToWidget = {
  Grid: GridWidget,
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
      if (widgetInfo.widgetName === "Grid") {
        const todayKey = new Date().toISOString().slice(0, 10);
        props.renderWidget({
          light: (
            <Widget
              history={{}}
              endDateKey={todayKey}
              bg={"#FFFFFF"}
              orange={"#FF6D1F"}
              muted={"#00000026"}
            />
          ),
          dark: (
            <Widget
              history={{}}
              endDateKey={todayKey}
              bg={"#000000"}
              orange={"#FF6D1F"}
              muted={"#ffffff26"}
            />
          ),
        });

      } else if (widgetInfo.widgetName === "Streak") {
        const { streak, title } = getStoredStreakData();

        props.renderWidget({
          light:
            <Widget
              title={title ? title : "Forge"}
              streak={streak ? streak : 0}
              bg={"#f5f5f5ff"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title ? title : "Forge"}
              streak={streak ? streak : 0}
              bg={"#111111ff"}
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
              percent={70}
              bg={"#f5f5f5ff"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title ? title : "Forge"}
              percent={70}
              bg={"#111111ff"}
              text={"#FFFFFF"}
              muted={"#FFFFFFB3"}
            />
        });
      }
      break;
    }
    case 'WIDGET_UPDATE': {
      if (widgetInfo.widgetName === "Grid") {
        const todayKey = new Date().toISOString().slice(0, 10);
        props.renderWidget({
          light: (
            <Widget
              history={{}}
              endDateKey={todayKey}
              bg={"#FFFFFF"}
              orange={"#FF6D1F"}
              muted={"#00000026"}
            />
          ),
          dark: (
            <Widget
              history={{}}
              endDateKey={todayKey}
              bg={"#000000"}
              orange={"#FF6D1F"}
              muted={"#ffffff26"}
            />
          ),
        });

      } else if (widgetInfo.widgetName === "Streak") {
        const { streak, title } = getStoredStreakData();

        props.renderWidget({
          light:
            <Widget
              title={title ? title : "Forge"}
              streak={streak ? streak : "Forge"}
              bg={"#f5f5f5ff"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title}
              streak={streak ? streak : 0}
              bg={"#000111111ff000"}
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
              percent={70}
              subtitle="32/50"
              bg={"#f5f5f5ff"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title ? title : "Forge"}
              percent={70}
              subtitle="32/50"
              bg={"#111111ff"}
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

      break;
    }

    default:
      break;
  }
}