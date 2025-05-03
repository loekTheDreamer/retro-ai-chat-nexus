// src/utils/aceMyCustomTheme.ts
// Utility to register the custom Ace Editor theme "mycustom"
import ace from 'ace-builds/src-noconflict/ace';
import { color } from 'html2canvas/dist/types/css/types/color';

export function registerAceMyCustomTheme() {
  if (typeof ace === 'undefined' || !ace.define) {
    throw new Error('Ace Editor is not loaded.');
  }

  // const commentPatterns: { [key: string]: RegExp } = {
  //   html: /<!--\s*([^\s]+\.html)\s*.*-->/,
  //   svg: /<!--\s*([^\s]+\.svg)\s*.*-->/,
  //   xml: /<!--\s*([^\s]+\.xml)\s*.*-->/,
  //   css: /\/\*\s*([^\s]+\.css)\s*.*\*\//,
  //   javascript: /\/\/\s*([^\s]+\.js)\s*.*/
  // };

  // // Define a custom theme
  // const customTheme = {
  //   $id: 'ace/theme/mycustom',
  //   $name: 'My Custom Theme',
  //   rules: [
  //     {
  //       token: 'constant.language.escape',
  //       regex: /<!--\s*([^\s]+\.html)\s*.*-->/,
  //       color: '#000000', // Change to your desired color
  //       fontStyle: 'italic'
  //     }
  //   ],
  //   inherit: 'ace/theme/textmate'
  // };

  // // Register the theme
  // ace.define(
  //   'ace/theme/mycustom',
  //   ['require', 'exports', 'module', 'ace/lib/dom'],
  //   function (require, exports, module) {
  //     exports.isDark = false;
  //     exports.cssClass = 'ace-my-custom-theme';
  //     exports.rules = customTheme.rules;
  //     exports.inherit = customTheme.inherit;
  //   }
  // );

  ace.define(
    'ace/theme/mycustom',
    ['require', 'exports', 'module', 'ace/lib/dom'],
    function (require, exports, module) {
      exports.isDark = true;
      exports.cssClass = 'ace-mycustom';
      // exports.rules = [
      //   {
      //     token: 'comment',
      //     foreground: '#000', // Change to your desired color
      //     fontStyle: 'italic'
      //   }
      // ];
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
