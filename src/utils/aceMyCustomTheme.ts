// src/utils/aceMyCustomTheme.ts
// Utility to register the custom Ace Editor theme "mycustom"
import ace from 'ace-builds/src-noconflict/ace';

export function registerAceMyCustomTheme() {
  if (typeof ace === 'undefined' || !ace.define) {
    throw new Error('Ace Editor is not loaded.');
  }

  ace.define(
    'ace/theme/mycustom',
    ['require', 'exports', 'module', 'ace/lib/dom'],
    function (require, exports, module) {
      exports.isDark = true;
      exports.cssClass = 'ace-mycustom';
      exports.cssText = `
      .ace-mycustom .ace_gutter {
        background: #102b13 !important;
        color: #4AFF00 !important;
        border-right: 1px solid #4AFF00 !important;
      }
      .ace-mycustom {
        background-color: #102b13 !important;
        color: #4AFF00 !important;
        border: 1px solid #4AFF00;
        font-family: 'Fira Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
        font-size: 0.95rem;
      }
      .ace-mycustom .ace_cursor {
        color: #4AFF00 !important;
      }
      .ace-mycustom .ace_print-margin {
        display: none !important;
      }
      .ace-mycustom .ace_marker-layer,
      .ace-mycustom .ace_active-line {
        background: none !important;
      }
      .ace-mycustom .ace_gutter-active-line {
        background-color: #102b13 !important;
      }
      .ace-mycustom .ace_line {
        color: #4AFF00 !important;
      }
      .ace-mycustom .ace_marker-layer .ace_selection {
        background: #0A0A0A !important;
        color: #4AFF00 !important;
      }
      `;
      const dom = require('../lib/dom');
      dom.importCssString(exports.cssText, exports.cssClass);
    }
  );
}
