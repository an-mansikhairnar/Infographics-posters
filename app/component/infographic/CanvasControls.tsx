// 'use client';
// import { Icon, IconBtn } from './ui';
// import type { EditorApi } from './interfaces';

// type CanvasControlsProps = {
//   api: EditorApi;
//   zoom: number;
//   flags: { undo: boolean; redo: boolean };
// };

// /**
//  * Floating controls over the canvas area: "Add 500px height" (top centre),
//  * undo / redo (top right) and zoom (bottom left). Same api calls the top bar used to make.
//  */
// export default function CanvasControls({ api, zoom, flags }: Readonly<CanvasControlsProps>) {
//   return (
//     <>
//       <div className="ie-float ie-float-top">
//         <span />
//         <button type="button" className="ie-pill font-semibold inter-text" onClick={() => api.extendPage(500)} title="Make the page 500px taller">
//           <Icon name="plus" size={14} /> Add 500px height
//         </button>
//         <div className="ie-float-hist">
//           <IconBtn icon="undo" title="Undo (Ctrl+Z)" disabled={!flags.undo} onClick={() => api.undo()} />
//           <IconBtn icon="redo" title="Redo (Ctrl+Shift+Z)" disabled={!flags.redo} onClick={() => api.redo()}  />
//         </div>
//       </div>

//       <div className="ie-float ie-float-zoom">
//         <IconBtn icon="minus" title="Zoom out" onClick={() => api.setZoom(zoom - 0.1)} />
//         <button type="button" className="ie-zoom inter-text" title="Fit to width" onClick={() => api.fit()}>
//           {Math.round(zoom * 100)}%
//         </button>
//         <IconBtn icon="plus" title="Zoom in" onClick={() => api.setZoom(zoom + 0.1)} />
//       </div>
//     </>
//   );
// }

'use client';
import { Icon, IconBtn } from './ui';
import type { EditorApi } from './interfaces';

type ToolbarProps = {
  api: EditorApi;
  flags: { undo: boolean; redo: boolean };
};

/** Sits above the canvas: "Add 500px height" (left), undo / redo (right). */
export function CanvasToolbar({ api, flags }: Readonly<ToolbarProps>) {
  return (
    <div className="ie-canvas-toolbar">
      <button
        type="button"
        className="ie-pill font-semibold inter-text"
        onClick={() => api.extendPage(500)}
        title="Make the page 500px taller"
      >
        <Icon name="plus" size={14} /> Add 500px height
      </button>
      <div className="ie-float-hist">
        <IconBtn icon="undo" title="Undo (Ctrl+Z)" disabled={!flags.undo} onClick={() => api.undo()} />
        <IconBtn icon="redo" title="Redo (Ctrl+Shift+Z)" disabled={!flags.redo} onClick={() => api.redo()} />
      </div>
    </div>
  );
}

type ZoomProps = { api: EditorApi; zoom: number };

/** Floating zoom control (bottom left of the workspace). */
export function ZoomControls({ api, zoom }: Readonly<ZoomProps>) {
  return (
    <div className="ie-float ie-float-zoom">
      <IconBtn icon="minus" title="Zoom out" onClick={() => api.setZoom(zoom - 0.1)} />
      <button type="button" className="ie-zoom inter-text" title="Fit to width" onClick={() => api.fit()}>
        {Math.round(zoom * 100)}%
      </button>
      <IconBtn icon="plus" title="Zoom in" onClick={() => api.setZoom(zoom + 0.1)} />
    </div>
  );
}