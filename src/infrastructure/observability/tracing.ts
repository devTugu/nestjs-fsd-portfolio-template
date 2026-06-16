/**
 * OpenTelemetry bootstrap hook.
 * Set OTEL_ENABLED=true and add @opentelemetry/sdk-node to export traces.
 */
export function initTracing(): void {
  if (process.env.OTEL_ENABLED !== 'true') {
    return;
  }

  // Optional: dynamic import keeps OTEL packages out of the default bundle.
  // Example collector wiring:
  // const { NodeSDK } = require('@opentelemetry/sdk-node');
  // const sdk = new NodeSDK({ traceExporter: ... });
  // sdk.start();
}
