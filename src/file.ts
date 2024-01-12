import { FileJson, Params, ParseRoleRequest, ParseUserRequest, RoleJson, UserJson } from './type.d';
import { insert, content } from './utils';
import Parse, { javaScriptKey } from 'parse/node';
import fs from 'fs';
import path from 'path';

const options = content() as Params;

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

Parse.initialize(options.app, options.javascriptKey, options.masterKey);
Parse.serverURL = options.url;

(async (params: Params) => {
	const { results } = (params.file! as FileJson);
	const File = Parse.Object.extend(options.name!);
	const dir = path.dirname(options.filePath);
	for (const data of results) {
		const obj = new File();
		try {
			const bytes = fs.readFileSync(path.join(dir, data.fileName));
			const file = new Parse.File(data.fileName, [...bytes], data.mimeType);
			obj.set('data', file);
		} catch (e) {
			console.log((e as Error).message);
			continue;
		}
		obj
			.set('fileName', data.fileName)
			.set('mimeType', data.mimeType)
			.set('fileSize', data.fileSize)
			.set('createDate', data.createDate)
			.set('updateDate', data.updateDate);
		const acl = new Parse.ACL();
		if (data.acl) {
			Object.entries(data.acl).forEach(([key, value]) => {
				if (key === '*') {
					if (value.read) acl.setPublicReadAccess(true);
					if (value.write) acl.setPublicWriteAccess(true);
					return;
				}
				if (key.indexOf('role:') === 0) {
					const roleName = key.split(':')[1];
					if (value.read) acl.setRoleReadAccess(roleName, true);
					if (value.write) acl.setRoleWriteAccess(roleName, true);
					return;
				}
				if (value.read) acl.setReadAccess(key, true);
				if (value.write) acl.setWriteAccess(key, true);
			});
			obj.setACL(acl);
		}
		try {
			await obj.save();
			console.log(`ファイルを保存しました。objectId = ${obj.id}、ファイル名 ${data.fileName}`);
		} catch (e) {
			console.error((e as Error).message);
			console.log(`ファイルの保存に失敗しました。ファイル名: ${data.fileName}`)
		}
	}
})(options);
