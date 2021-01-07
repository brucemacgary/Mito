import Env from 'dotenv';
Env.config();
import Client from './bot/client/Client';

const client = new Client();

void client.start(process.env.TOKEN!);
