const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

// Ensure consistent timestamp across all esbuild worker threads/processes
if (!process.env.BUILD_TIMESTAMP) {
  process.env.BUILD_TIMESTAMP = Date.now().toString();
}

module.exports = withNativeFederation({
  name: 'mcp-coop-agent-builder',
  version: `0.0.0-build-${process.env.BUILD_TIMESTAMP}`,

  exposes: {
    './Component': './src/app/app.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add further packages you don't need at runtime
  ],

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

  features: {
    // New feature for more performance and avoiding
    // issues with node libs. Comment this out to
    // get the traditional behavior:
    ignoreUnusedDeps: true,
  },
});
