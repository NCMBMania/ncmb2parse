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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
    options.name = 'files';
}
node_1.default.initialize(options.app, options.javascriptKey, options.masterKey);
node_1.default.serverURL = options.url;
((params) => __awaiter(void 0, void 0, void 0, function* () {
    const { results } = params.file;
    const File = node_1.default.Object.extend(options.name);
    const dir = path_1.default.dirname(options.filePath);
    for (const data of results) {
        const obj = new File();
        try {
            const bytes = fs_1.default.readFileSync(path_1.default.join(dir, data.fileName));
            const file = new node_1.default.File(data.fileName, [...bytes], data.mimeType);
            obj.set('data', file);
        }
        catch (e) {
            console.log(e.message);
            continue;
        }
        obj
            .set('fileName', data.fileName)
            .set('mimeType', data.mimeType)
            .set('fileSize', data.fileSize)
            .set('createDate', data.createDate)
            .set('updateDate', data.updateDate);
        const acl = new node_1.default.ACL();
        if (data.acl) {
            Object.entries(data.acl).forEach(([key, value]) => {
                if (key === '*') {
                    if (value.read)
                        acl.setPublicReadAccess(true);
                    if (value.write)
                        acl.setPublicWriteAccess(true);
                    return;
                }
                if (key.indexOf('role:') === 0) {
                    const roleName = key.split(':')[1];
                    if (value.read)
                        acl.setRoleReadAccess(roleName, true);
                    if (value.write)
                        acl.setRoleWriteAccess(roleName, true);
                    return;
                }
                if (value.read)
                    acl.setReadAccess(key, true);
                if (value.write)
                    acl.setWriteAccess(key, true);
            });
            obj.setACL(acl);
        }
        try {
            yield obj.save();
            console.log(`ファイルを保存しました。objectId = ${obj.id}、ファイル名 ${data.fileName}`);
        }
        catch (e) {
            console.error(e.message);
            console.log(`ファイルの保存に失敗しました。ファイル名: ${data.fileName}`);
        }
    }
}))(options);
