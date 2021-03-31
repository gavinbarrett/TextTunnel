import * as Redis from 'ioredis';
import { Pool } from 'pg';

const pool = new Pool({
	user: process.env.USER,
	host: process.env.HOST,
	database: "tunnelr",
	password: process.env.PW,
	port: 5432
});

const redisClient = new Redis({
	host: 'localhost',
	port: 6379,
	password: ''
});
//redisClient.on('error', err => { if (err) console.log(`Error: ${err}`) });

export const query = (text, values) => {
	return pool.query(text, values);
}

export const get = id => {
	return redisClient.get(id);
}

export const set = (id, user, type, exp) => {
	return redisClient.set(id, user, type, exp);
}

export const del = id => {
	return redisClient.del(id);
}

export const exists = id => {
	return redisClient.exists(id);
}

export const xadd = (channelName, message, sender) => {
	return redisClient.xadd(channelName, "*", "message", message, "sender", sender)
}

export const xread = channelName => {
	return redisClient.xread("BLOCK", 10000, "STREAMS", channelName, 0);
}
