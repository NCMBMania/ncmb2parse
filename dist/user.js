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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const options = (0, utils_1.content)();
((params) => __awaiter(void 0, void 0, void 0, function* () {
    const results = params.file.results;
    for (const data of results) {
        const body = {
            username: data.userName,
            mailAddress: data.mailAddress,
            password: data.userName,
            acl: data.acl
        };
        if (data.authData) {
            body.authData = data.authData;
        }
        for (const [key, value] of Object.entries(data)) {
            if (["objectId", "authData"].includes(key)) {
                continue;
            }
            body[key] = value;
        }
        body.ncmbObjectId = data.objectId;
        body.createdDate = data.createDate;
        body.updatedDate = data.updateDate;
        const json = yield (0, utils_1.insert)(`${params.url}/users`, params.app, params.key, body);
        console.log(`Userの作成に成功しました。objectId: ${json.objectId}`);
    }
}))(options);