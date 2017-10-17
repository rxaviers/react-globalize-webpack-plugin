# react-globalize webpack plugin 

## Webpack, React, and Globalize versions

Starting from *v2.0.0*, only *webpack 3* is supported. If you need support for *webpack 2*, use our *v1.x* releases. If you need support for *webpack 1*, use our *v0.x* releases.

| react-globalize-webpack-plugin | webpack | react | globalize     |
| ------------------------------ | ------- | ----- | ------------- |
| 2.x                            | ^3.0.0  | *     | ^1.3.0        |
| 1.1.x                          | ^2.2.0  | *     | ^1.3.0        |
| 1.0.x                          | ^2.2.0  | *     | ^1.1.0 <1.3.0 |
| 0.5.x                          | ^1.9.0  | *     | ^1.3.0        |
| 0.4.x                          | ^1.9.0  | *     | ^1.1.0 <1.3.0 |

## Usage

Please read [Globalize Webpack Plugin][] documentation. Usage is very similar, but with one more attribute:

* `writeMessages`: writes new default messages for all supported locales
  under the `messages` filepath specified.

`writeMessages` requires `messages` to be set.

Also, see [react-globalize][] and [Globalize][].

[Globalize]: https://github.com/jquery/globalize/
[Globalize Webpack Plugin]: https://github.com/rxaviers/globalize-webpack-plugin
[react-globalize]: https://github.com/kborchers/react-globalize
