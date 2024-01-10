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

### ロールデータの移行

```bash
npx node dist/role.js -m MASTER_KEY \
  -a YOUR_APP_ID \
  -j YOUR_JAVASCRIPT_KEY \
  -n ROLE_NAME \
  -u YOUR_PARSE_SERVER_URL\
  /path/to/role.json
```

### オプション

指定できるオプションです。

```
Usage: file [options] <filePath>

Arguments:
  filePath                              インポートするJSONファイルのパス

Options:
  -k, --key <REST API Key>              Parse ServerのREST APIキー (default: "")
  -u, --url <URL>                       Parse ServerのURL
  -a, --app <Application ID>            Parse ServerのApplication ID
  -n, --name <Name>                     クラス名、ロール名を指定 (default: "")
  -m, --masterKey <Master Key>          Parse ServerのMaster Key (default: "")
  -j, --javascriptKey <JavaScript Key>  Parse ServerのJavaScript Key (default: "")
  -h, --help                            display help for command
```

## ライセンス

MIT

