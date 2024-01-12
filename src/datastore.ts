import { DataStoreJson, Params, ParseRoleRequest, ParseUserRequest, RoleJson, UserJson } from './type.d';
import { insert, content } from './utils';
import Parse from 'parse/node';

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
	console.error('クラス名は必須です');
	process.exit(1);
}

Parse.initialize(options.app, options.javascriptKey, options.masterKey);
Parse.serverURL = options.url;

(async (params: Params) => {
	const query = new Parse.Query(Parse.User);
	const users = await query
		.limit(1000)
		.find({ useMasterKey: true });
	const { results } = params.file! as DataStoreJson;
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
			const json = await insert(`${params.url}/classes/${params.name}`, params.app, params.key!, data);
			console.log(`${params.name}の作成に成功しました。objectId: ${json.objectId}`);
		} catch (e) {
			console.error((e as Error).message);
			console.log(`${params.name}の作成に失敗しました。元objectId: ${data.objectId}`);
		}
	}
})(options);
