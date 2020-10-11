# remote-service-buffer

Buffer result from external fetchAPI, update only when needed

## Why

If you need to call a fetchAPI more times but you do not want to overload the API server.

You can execute Service more times, but Service makes one single call each 5 minutes (default, you can change it), and returns buffer.
If you do not execute Service, it not makes calls to server.

Service is faster. When You execute Service, it first returns the buffer, then performs the buffer update later.

## Installation

```npm
npm install remote-service-buffer
```

## Example

Calling the same service each second. the service buffers the result and returns it to you, then Service updates buffer only every 5 minutes.

```js
import service from "remote-service-buffer"

const fetchHeaders = {} //optional

const refreshTime = 1000 * 60 * 5 //optional

const myService = new service("http://worldtimeapi.org/api", "/ip", refreshTime, fetchHeaders)

async function loop() {
  console.log(await myService.get())
  setTimeout(loop, 1000)
}
loop()
```

## Refs

https://www.npmjs.com/package/remote-service-buffer
