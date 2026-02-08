// Allow importing .wasm files as ArrayBuffer via vite-plugin-arraybuffer.
declare module '*.wasm?arraybuffer' {
  const buffer: ArrayBuffer
  export default buffer
}
