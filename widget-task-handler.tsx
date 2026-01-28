import type { WidgetTaskHandlerProps } from "react-native-android-widget";

import { ContributionGridWidget } from "./src/widgets/ContributionGridWidget";
import { PercentWidget } from "./src/widgets/PercentWidget";
import { StreakOnlyWidget } from "./src/widgets/StreakOnlyWidget";

// ---- 1) YOUR CONTROL PANEL (edit these numbers) ----
const GRID_PRESETS = {
  // horizontal + short
  wideTall: { weeks: 16, box: 18, gap: 5, padding: 14 }, // top big
  wideShort: { weeks: 32, box: 10, gap: 3, padding: 12 }, // very wide + short
  midShort: { weeks: 23, box: 11, gap: 3, padding: 12 }, // medium wide + short
  smallShort: { weeks: 14, box: 12, gap: 4, padding: 12 }, // small wide + short

  // tall widgets
  tallLarge: { weeks: 12, box: 18, gap: 5, padding: 14 }, // large tall
  tallSmall: { weeks: 8, box: 18, gap: 5, padding: 14 }, // small tall
} as const;

type PresetKey = keyof typeof GRID_PRESETS;

// ---- 2) Detect which widget "shape" we are in ----
function pickPreset(w: number, h: number): PresetKey {
  // These thresholds are based on the sizes in your screenshots.
  const isTall = h >= 280;
  const isWide = w >= 600;
  const isMid = w >= 420;

  if (isTall && isWide) return "wideTall";
  if (isTall && isMid) return "tallLarge";
  if (isTall) return "tallSmall";

  // short
  if (isWide) return "wideShort";
  if (isMid) return "midShort";
  return "smallShort";
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const { widgetInfo, widgetAction } = props;

  const info: any = widgetInfo;
  const w = info.width ?? info.minWidth ?? 220;
  const h = info.height ?? info.minHeight ?? 120;

  const presetKey = pickPreset(w, h);
  const preset = GRID_PRESETS[presetKey];

  switch (widgetAction) {
    case "WIDGET_ADDED":
    case "WIDGET_UPDATE":
    case "WIDGET_RESIZED": {
      if (widgetInfo.widgetName === "StreakOnly") {
        props.renderWidget({
          light: (
            <StreakOnlyWidget
              title="Forge"
              streak={12}
              bg="#F6F6F6"
              text="#FFFFFF"
              muted="#0000004c"
            />
          ),
          dark: (
            <StreakOnlyWidget
              title="Forge"
              streak={12}
              bg="#151515"
              text="#000000"
              muted="#ffffffb3"
            />
          ),
        });
        break;
      }

      if (widgetInfo.widgetName === "ContributionGrid") {
        const fakeHistory: Record<string, boolean> = {};

        props.renderWidget({
          light: (
            <ContributionGridWidget
              title="Forge"
              history={fakeHistory}
              endDateKey="2026-01-28"
              weeks={preset.weeks}
              size={preset.box}
              gap={preset.gap}
              // IMPORTANT: make your widget fill the slot
              bg="#FFFFFF"
              empty="#ECECEC"
              filled="#FF7A00"
            />
          ),
          dark: (
            <ContributionGridWidget
              title="Forge"
              history={fakeHistory}
              endDateKey="2026-01-28"
              weeks={preset.weeks}
              size={preset.box}
              gap={preset.gap}
              bg="#151515"
              empty="#2A2A2A"
              filled="#FF7A00"
            />
          ),
        });
        break;
      }

      props.renderWidget({
        light: (
          <PercentWidget
            title="7 Day Score"
            percent={64}
            subtitle="32/50"
            bg="#F6F6F6"
            text="#FFFFFF"
            muted="#0000004c"
          />
        ),
        dark: (
          <PercentWidget
            title="7 Day Score"
            percent={64}
            subtitle="32/50"
            bg="#151515"
            text="#000000"
            muted="#ffffffb3"
          />
        ),
      });
      break;
    }

    case "WIDGET_CLICK":
      break;

    case "WIDGET_DELETED":
      break;

    default:
      break;
  }
}
