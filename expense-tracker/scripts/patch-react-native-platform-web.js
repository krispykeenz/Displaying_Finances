const fs = require('fs');
const path = require('path');

// React Native 0.79.x is missing some *.web.js files, but Metro resolves platform
// variants when bundling for web. Add minimal shims to unblock `expo export -p web`.

const shims = [
  {
    relPath: ['react-native', 'Libraries', 'Utilities', 'Platform.web.js'],
    contents: "import Platform from 'react-native-web/dist/exports/Platform';\nexport default Platform;\n",
  },
  {
    relPath: ['react-native', 'Libraries', 'Components', 'AccessibilityInfo', 'legacySendAccessibilityEvent.web.js'],
    contents: "export default function legacySendAccessibilityEvent() {}\n",
  },
  {
    relPath: ['react-native', 'Libraries', 'StyleSheet', 'PlatformColorValueTypes.web.js'],
    contents:
      "export const PlatformColor = () => null;\n" +
      "export const DynamicColorIOSPrivate = (tuple) => tuple?.light ?? null;\n" +
      "export const normalizeColorObject = () => null;\n" +
      "export const processColorObject = (color) => color;\n",
  },
  {
    relPath: ['react-native', 'Libraries', 'NativeComponent', 'BaseViewConfig.web.js'],
    contents: "export { default } from './BaseViewConfig.ios';\n",
  },
  {
    relPath: ['react-native', 'Libraries', 'Alert', 'RCTAlertManager.web.js'],
    contents:
      "export default {\n" +
      "  alertWithArgs: () => {},\n" +
      "};\n",
  },
  {
    relPath: ['react-native', 'Libraries', 'Utilities', 'BackHandler.web.js'],
    contents:
      "function emptyFunction() {}\n" +
      "export default {\n" +
      "  exitApp: emptyFunction,\n" +
      "  addEventListener: () => ({ remove: emptyFunction }),\n" +
      "};\n",
  },
];

try {
  for (const shim of shims) {
    const targetPath = path.join(__dirname, '..', 'node_modules', ...shim.relPath);

    if (fs.existsSync(targetPath)) {
      continue;
    }

    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, shim.contents, 'utf8');
  }
} catch (err) {
  console.error('Failed to write React Native web shim(s):', err);
  process.exit(1);
}
