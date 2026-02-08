import Storage from 'expo-sqlite/kv-store';
import { Linking } from 'react-native';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { GridWidget } from './GraphWidget';
import { ScoreWidget } from './ScoreWidget';
import { StreakWidget } from './StreakWidget';

const nameToWidget = {
  Grid: GridWidget,
  Streak: StreakWidget,
  Score: ScoreWidget,
};

// Get Streak widget data 
const STREAK_STORAGE_KEY = "@forge/widget_streak";
const STREAK_TITLE_KEY = "@forge/widget_title";

function getStoredStreakData() {
  const streak = Number(Storage.getItemSync(STREAK_STORAGE_KEY)) || 0;
  const title = Storage.getItemSync(STREAK_TITLE_KEY) || "Forge";

  return { streak, title };
}

// Get SCORE widget data 
const SCORE_STORAGE_KEY = "@forge/widget_score_percent";
const SCORE_TITLE_KEY = "@forge/widget_score_title";

function getStoredScoreData() {
  const score = Number(Storage.getItemSync(SCORE_STORAGE_KEY)) || 0;
  const title = Storage.getItemSync(SCORE_TITLE_KEY) || "Forge";

  return { score, title };
}

// Get Grid widget data 
const GRID_HISTORY_KEY = "@forge/widget_score_title";
function getGridHistory() {
  const stored = Storage.getItemSync(GRID_HISTORY_KEY);
  const firstHistory = stored ? JSON.parse(stored) : {}

  return firstHistory;
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
        const firstHistory = getGridHistory();

        props.renderWidget({
          light: (
            <Widget
              history={firstHistory ? firstHistory : {}}
              endDateKey={todayKey}
              bg={"#ffffffff"}
              orange={"#FF6D1F"}
              muted={"#00000026"}
            />
          ),
          dark: (
            <Widget
              history={firstHistory ? firstHistory : {}}
              endDateKey={todayKey}
              bg={"#111111ff"}
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
              bg={"#ffffffff"}
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
        const { score, title } = getStoredScoreData();

        props.renderWidget({
          light:
            <Widget
              title={title ? title : "Forge"}
              percent={score ? score : 0}
              bg={"#ffffffff"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title ? title : "Forge"}
              percent={score ? score : 0}
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
        const firstHistory = getGridHistory();

        props.renderWidget({
          light: (
            <Widget
              history={firstHistory ? firstHistory : {}}
              endDateKey={todayKey}
              bg={"#ffffffff"}
              orange={"#FF6D1F"}
              muted={"#00000026"}
            />
          ),
          dark: (
            <Widget
              history={firstHistory ? firstHistory : {}}
              endDateKey={todayKey}
              bg={"#111111ff"}
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
              bg={"#ffffffff"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title}
              streak={streak ? streak : 0}
              bg={"#111111ff"}
              text={"#FFFFFF"}
              muted={"#FFFFFFB3"}
            />,
        });

      } else if (widgetInfo.widgetName === "Score") {
        const { score, title } = getStoredScoreData();

        props.renderWidget({
          light:
            <Widget
              title={title ? title : "Forge"}
              percent={score ? score : 0}
              bg={"#ffffffff"}
              text={"#111111"}
              muted={"#11111199"}
            />,
          dark:
            <Widget
              title={title ? title : "Forge"}
              percent={score ? score : 0}
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
        Linking.openURL("expo-router://")
        break;
      }

      break;
    }

    default:
      break;
  }
}