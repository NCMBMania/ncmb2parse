import { Params, ParseRoleRequest, ParseUserRequest, RoleJson, UserJson } from './type.d';
import { insert, content } from './utils';
import Parse, { javaScriptKey } from 'parse/node';

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
	console.error('ロール名は必須です');
	process.exit(1);
}

Parse.initialize(options.app, options.javascriptKey, options.masterKey);
Parse.serverURL = options.url;

(async (params: Params) => {
	const roleName = params.name!;
	const results = (params.file! as RoleJson).results;
	const roleACL = new Parse.ACL();
	roleACL.setPublicReadAccess(true);
	const role = new Parse.Role(roleName, roleACL);
	const objectIds = results.map((result) => result.objectId);
	const query = new Parse.Query(Parse.User);
	const users = await query
		.containedIn('ncmbObjectId', objectIds)
		.limit(1000)
		.findAll({useMasterKey: true});
	users.map((user) => role.getUsers().add(user));
	try {
		await role.save();
		console.log(`ロールの作成に成功しました。ロール名: ${role.getName()}`)
	} catch (e) {
		console.error((e as Error).message);
		console.log(`ロールの作成に失敗しました。ロール名: ${role.getName()}`)
	}
})(options);
