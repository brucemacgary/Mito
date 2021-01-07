import { Command, Flag, Argument } from 'discord-akairo';
import { Util, Message } from 'discord.js';
import util from 'util';

class EvalCommand extends Command {

	private eval: null;
	private hrStart: [number, number];
	private readonly _replaceToken: null;
	public constructor() {
		super('eval', {
			aliases: ['eval', 'e'],
			category: 'owner',
			optionFlags: ['--depth', '-d'],
			ownerOnly: true,
			description: {
				content: 'You can\'t use this anyway, so why to explain?',
				usage: '<code>'
			}
		});

		this.eval = null;
		this.hrStart = [0, 0];
	}

	public *args() {
		const depth = yield {
			'match': 'option',
			type: Argument.range('integer', 0, 3, true),
			'flag': ['--depth', '-d'],
			default: 0
		};

		const code = yield {
			match: 'rest',
			type: (msg: Message, code: string) => {
				if (!code) return Flag.cancel();
				return code;
			}
		};

		return { code, depth };
	}

	public async exec(message: Message, { code, depth }: { code: string; depth: number }) {
		let hrDiff = undefined;
		try {

			const hrStart = process.hrtime();
			this.eval = eval(code); // eslint-disable-line
			hrDiff = process.hrtime(hrStart);

			this.hrStart = process.hrtime();
			const result = this.result(await this.eval ?? '', hrDiff, code, depth);
			if (Array.isArray(result)) return result.map(async res => message.util?.send(res));
			return message.util?.send(result);

		} catch (error) {
			return message.util?.send([
				'**☠**\u2000**Error**',
				`\`\`\`js\n${error}\n\`\`\``
			]);
		}
	}

	// eslint-disable-next-line @typescript-eslint/default-param-last
	private result(result: string, hrDiff: [number, number], input: string | null = null, depth: number) {
		const inspected = util.inspect(result, { depth }).replace(new RegExp('!!NL!!', 'g'), '\n').replace(this.replaceToken ?? '', 'I am really sorry i cannot reveal my token.');
		const split = inspected.split('\n');
		const last = inspected.length - 1;
		const prependPart = !inspected.startsWith('{') && !inspected.startsWith('[') && !inspected.startsWith('\'') ? split[0] : inspected[0];
		const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== '\'' ? split[split.length - 1] : inspected[last];
		const prepend = `\`\`\`js\n${prependPart}\n`;
		const append = `\n${appendPart}\n\`\`\``;
		if (input) {
			return Util.splitMessage([
				`<:MitoTimer:786446116849582091> Executed in **${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms**`,
				'📤\u2000**Output**',
				`\`\`\`js\n${inspected}\`\`\``
			], {
				maxLength: 1900, prepend, append
			});
		}
		return Util.splitMessage(`*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms* \`\`\`js\n${inspected}\`\`\``, {
			maxLength: 1900, prepend, append
		});
	}

	private get replaceToken() {
		if (!this._replaceToken) {
			const token = this.client.token?.split('').join('[^]{0,2}');
			const revToken = this.client.token?.split('').reverse().join('[^]{0,2}');
			Object.defineProperty(this, '_replaceToken', { value: new RegExp(`${token}|${revToken}`, 'g') });
		}
		return this._replaceToken;
	}

}

module.exports = EvalCommand;
