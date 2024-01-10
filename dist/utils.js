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
exports.insert = exports.content = void 0;
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const content = () => {
    commander_1.program
        .option('-k, --key <REST API Key>', 'Parse ServerのREST APIキー', '')
        .option('-u, --url <URL>', 'Parse ServerのURL')
        .option('-a, --app <Application ID>', 'Parse ServerのApplication ID')
        .option('-n, --name <Name>', 'クラス名、ロール名を指定', '')
        .option('-m, --masterKey <Master Key>', 'Parse ServerのMaster Key', '')
        .option('-j, --javascriptKey <JavaScript Key>', 'Parse ServerのJavaScript Key', '')
        .argument('<filePath>', 'インポートするJSONファイルのパス');
    commander_1.program.parse();
    const options = commander_1.program.opts();
    const [filePath] = commander_1.program.args;
    if (!filePath) {
        console.error('filePathは必須です');
        process.exit(1);
    }
    const file = fs_1.default.readFileSync(filePath, 'utf-8');
    options.file = JSON.parse(file);
    options.filePath = filePath;
    return options;
};
exports.content = content;
const insert = (url, appId, key, body) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(url, {
        method: 'POST',
        headers: {
            'X-Parse-Application-Id': appId,
            'X-Parse-REST-API-Key': key,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (res.status !== 201) {
        throw new Error(`データ作成に失敗しました。${res.status} ${yield res.text()}`);
    }
    return res.json();
});
exports.insert = insert;
