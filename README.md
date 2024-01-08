# NCMBのInstallationをParse Serverへ移行するスクリプト

## 準備

以下が必要です。

- NCMBのInstallationクラスをJSON形式でエクスポートしたファイル
- Parse Serverの各種データ

## NCMBのInstallationクラスをJSON形式でエクスポートする

NCMBの管理画面でデータをエクスポートするか、[NCMB Extension](https://chromewebstore.google.com/detail/ncmb-extension/dglkhlplcpmnbgodhbngcmdfpojkbdnc?hl=ja)を利用してください。

[NCMBの管理画面をGoogle Chrome機能拡張で便利にする（CSVエクスポート） \#JavaScript \- Qiita](https://qiita.com/goofmint/items/19bccf321f210b013e10)

## Parse Serverの各種データを取得する

Parse Serverを起動する際の、下記データが必要です。

- アプリケーションID
- REST APIキー
- Parse ServerのURL

## スクリプトを実行する

スクリプトを実行するには、Node.jsが必要です。実行時には、オプションを指定してください。

### プッシュ通知の移行

```bash
npx node dist/push.js -a YOUR_APP_ID \
  -k YOUR_REST_API_KEY \
  -u YOUR_PARSE_SERVER_URL\
  /path/to/installation.json
```

### ユーザーデータの移行

```bash
npx node dist/user.js -a YOUR_APP_ID \
  -k YOUR_REST_API_KEY \
  -u YOUR_PARSE_SERVER_URL\
  /path/to/users.json
```

### オプション

指定できるオプションです。

```
Usage: push.js [options] <filePath>

Arguments:
  filePath                    JSONファイルののパス

Options:
  -k, --key <REST API Key>    Parse ServerのREST APIキー
  -u, --url <URL>             Parse ServerのURL
  -a, --app <Application ID>  Parse ServerのApplication ID
  -h, --help                  display help for command
```


## ライセンス

MIT

