"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
;
;
;
;
;
;
commander_1.program
    .option('-k, --key <REST API Key', 'Parse ServerのREST APIキー', '')
    .option('-u, --url <URL>', 'Parse ServerのURL', '')
    .option('-a, --app <Application ID>', 'Parse ServerのApplication ID', '')
    .argument('<filePath>', 'installation.jsonのパス');
commander_1.program.parse();
const options = commander_1.program.opts();
const [filePath] = commander_1.program.args;
if (!filePath) {
    console.error('filePathは必須です');
    process.exit(1);
}
const params = Object.assign(Object.assign({}, options), { filePath: path_1.default.resolve(filePath) });
((params) => __awaiter(void 0, void 0, void 0, function* () {
    if (params.app === '') {
        console.error('アプリIDは必須です -a <App id>');
        process.exit(1);
    }
    if (params.url === '') {
        console.error('Parse ServerのURLは必須です。例） -u https://example.com/parse');
        process.exit(1);
    }
    if (params.key === '') {
        console.error('REST APIキーは必須です。例） -k REST_API_KEY');
        process.exit(1);
    }
    try {
        const file = fs_1.default.readFileSync(params.filePath, 'utf-8');
        params.file = JSON.parse(file);
    }
    catch (e) {
        console.error(`${params.filePath}が見つかりません`);
        process.exit(1);
    }
    for (const data of params.file.results) {
        const body = {
            appName: data.applicationName,
            appVersion: data.appVersion,
            badge: data.badge,
            channels: data.channels,
            deviceToken: data.deviceToken,
            deviceType: data.deviceType,
            sdkVersion: data.sdkVersion,
            timeZone: data.timeZone,
            acl: data.acl,
            pushType: data.pushType
        };
        for (const [key, value] of Object.entries(data)) {
            if (["objectId", "applicationName", "appVersion", "badge", "channels", "deviceToken", "deviceType", "sdkVersion", "timeZone", "createDate", "updateDate", "acl", "pushType"].includes(key)) {
                continue;
            }
            body[key] = value;
        }
        const res = yield (0, node_fetch_1.default)(`${params.url}/installations`, {
            method: 'POST',
            headers: {
                'X-Parse-Application-Id': params.app,
                'X-Parse-REST-API-Key': params.key,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (res.status !== 201) {
            console.error(`Installationの作成に失敗しました。${res.status} ${res.statusText}`);
            process.exit(1);
        }
        const json = yield res.json();
        console.log(`Installationの作成に成功しました。objectId: ${json.objectId}`);
    }
}))(params);
