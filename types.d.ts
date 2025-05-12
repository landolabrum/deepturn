declare module '*.css' {
    const css: String;
    export default css;
}

declare module '*.scss' {
  const  ecss: CompiledCss;
  export default css;
}

type CompiledCss = String & { __hash?: string};