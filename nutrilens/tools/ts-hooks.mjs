// Lets Node resolve the app's extensionless imports.
//
// Metro resolves "./nutrients" to "./nutrients.ts"; Node's ESM resolver does
// not, and rewriting every import in the app to satisfy the test runner would
// be the tail wagging the dog. This hook tries the bare specifier first and
// falls back to the TypeScript extensions.
const TRY = ['.ts', '.tsx', '/index.ts'];

export async function resolve(specifier, context, next) {
  try {
    return await next(specifier, context);
  } catch (error) {
    if (!specifier.startsWith('.') && !specifier.startsWith('/')) throw error;
    for (const ext of TRY) {
      try {
        return await next(specifier + ext, context);
      } catch {
        // try the next one
      }
    }
    throw error;
  }
}
