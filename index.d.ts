declare namespace service {
  export function get(): string
}

declare function service(path: string, name: string, refresh?: number, headers?: object): void
export = service
