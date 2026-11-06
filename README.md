# logfmt-check

Validate [logfmt](https://brandur.org/logfmt) lines and report malformed
`key=value` pairs with their line number.

```sh
cat app.log | logfmt-check
```

Exit code is `0` when every token is a valid pair, `1` otherwise. Values may be
quoted to keep spaces.

## Development

```sh
npm test
```
