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
const utils_1 = require("./utils");
const node_1 = __importDefault(require("parse/node"));
const options = (0, utils_1.content)();
if (options.masterKey === '') {
    console.error('masterKeyは必須です');
    process.exit(1);
}
if (options.javascriptKey === '') {
    console.error('javascriptKeyは必須です');
    process.exit(1);
}
if (options.name === '') {
    console.error('クラス名は必須です');
    process.exit(1);
}
node_1.default.initialize(options.app, options.javascriptKey, options.masterKey);
node_1.default.serverURL = options.url;
((params) => __awaiter(void 0, void 0, void 0, function* () {
    const query = new node_1.default.Query(node_1.default.User);
    const users = yield query
        .limit(1000)
        .find({ useMasterKey: true });
    const { results } = params.file;
    for (const data of results) {
        data.ncmbObjectId = data.objectId;
        data.createdDate = data.createDate;
        data.updatedDate = data.updateDate;
        data.ACL = data.acl;
        delete data.objectId;
        delete data.createDate;
        delete data.updateDate;
        delete data.acl;
        for (const user of users) {
            if (data.ACL[user.get('ncmbObjectId')]) {
                data.ACL[user.id] = data.ACL[user.get('ncmbObjectId')];
                delete data.ACL[user.get('ncmbObjectId')];
            }
        }
        try {
            const json = yield (0, utils_1.insert)(`${params.url}/classes/${params.name}`, params.app, params.key, data);
            console.log(`${params.name}の作成に成功しました。objectId: ${json.objectId}`);
        }
        catch (e) {
            console.error(e.message);
            console.log(`${params.name}の作成に失敗しました。元objectId: ${data.objectId}`);
        }
    }
}))(options);
