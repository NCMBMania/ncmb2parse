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
if (options.key === '') {
    console.error('REST APIキーは必須です');
    process.exit(1);
}
((params) => __awaiter(void 0, void 0, void 0, function* () {
    const results = params.file.results;
    for (const data of results) {
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
        body.ncmbObjectId = data.objectId;
        body.createdDate = data.createDate;
        body.updatedDate = data.updateDate;
        const json = yield (0, utils_1.insert)(`${params.url}/installations`, params.app, params.key, body);
        console.log(`Installationの作成に成功しました。objectId: ${json.objectId}`);
    }
}))(options);
