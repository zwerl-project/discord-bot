import { Client } from 'discord.js';
import http from 'http';
import express from 'express';
import websocket from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new websocket.Server({ server });
		
export const initializeServer = async (client: Client) => {
	return;
};