/* eslint-disable @typescript-eslint/ban-types */
import chalk from 'chalk';
import moment from 'moment';
import util from 'util';

interface T {
	[key: string]: string;
}

const COLORS: T = {
	debug: 'yellow',
	info: 'cyan',
	warn: 'magenta',
	error: 'red'
};

const TAGS: T = {
	debug: '[DEBUG]',
	info: '[INFO ]',
	warn: '[WARN ]',
	error: '[ERROR]'
};

export default class Logger {

	public debug(message: string | object, { label }: { label?: string }) {
		return (this.constructor as typeof Logger).write(message, { label, tag: 'debug' });
	}

	public info(message: string | object, { label }: { label?: string }) {
		return (this.constructor as typeof Logger).write(message, { label, tag: 'info' });
	}

	public error(message: string | object, { label }: { label?: string }) {
		return (this.constructor as typeof Logger).write(message, { error: true, label, tag: 'error' });
	}

	public warn(message: string | object, { label }: { label?: string }) {
		return (this.constructor as typeof Logger).write(message, { label, tag: 'warn' });
	}

	private static write(message: string | object, { error, label, tag }: { error?: boolean; label?: string; tag: string }) {
		const timestamp = chalk.cyan(moment().utcOffset('+05:30').format('DD-MM-YYYY kk:mm:ss'));
		const content = this.clean(message);
		const stream = error ? process.stderr : process.stdout;
		const color = COLORS[tag] as 'red' | 'cyan' | 'yellow' | 'magenta';
		stream.write(`[${timestamp}] [SHARD 0] ${chalk[color].bold(TAGS[tag])} » ${label ? `[${label}] » ` : ''}${content}\n`);
	}

	private static clean(message: string | object) {
		if (typeof message === 'string') return message;
		return util.inspect(message, { depth: Infinity });
	}

}
