# pear-messages

> Receive object messages from a Pear application's processes/threads using object pattern-matching

## Usage

```js
import messages from 'pear-messages'

const stream = messages({ some: 'props' })

stream.once('data', console.log)
```

Elsewhere in app use [`pear-message`](https://github.com/holepunchto/pear-message):

```js
import message from 'pear-message'

await message({ some: 'props', to: {pattern: ['match', 'against'] }})
```


Should log: `{ some: 'props', to: {pattern: ['match', 'against'] }}`

## API

### `messages(pattern[, listener]) -> stream | messages(listener, pattern) -> stream`

Listen for application messages sent with [`pear-message`](https://github.com/holepunchto/pear-message) based on `pattern` which is an object whose properties match a subset of the properties for a given target message.

## License

Apache-2.0