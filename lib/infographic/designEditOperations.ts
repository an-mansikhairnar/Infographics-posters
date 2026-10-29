export type ChatOperation =
  | {
      type: 'update_object';
      index: number;
      properties: {
        text?: string;
        fill?: string;
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: string | number;
        fontStyle?: 'normal' | 'italic';
        underline?: boolean;
        linethrough?: boolean;
        textAlign?: 'left' | 'center' | 'right';
        opacity?: number;
        angle?: number;
        left?: number;
        top?: number;
      };
    }
  | { type: 'add_text'; text: string; left?: number; top?: number; fontSize?: number; fill?: string; fontFamily?: string }
  | { type: 'delete_object'; index: number }
  | { type: 'scale_object'; index: number; factor: number }
  | { type: 'update_many'; indexes: number[]; properties: Extract<ChatOperation, { type: 'update_object' }>['properties'] }
  | { type: 'arrange_objects'; indexes: number[]; layout: 'horizontal' | 'vertical' | 'grid'; gap?: number }
  | { type: 'set_background'; color: string }
  | { type: 'resize_page'; width?: number; height?: number }
  | { type: 'set_theme'; theme: 'editorialGold' | 'modernBlue' | 'emeraldGrowth' | 'sunsetCoral' | 'midnightDark' }
  | { type: 'apply_template'; templateId: string };
