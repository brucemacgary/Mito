
import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

interface SingleAction {
	kind: 'single';
	num: number;
}

interface SliceAction {
	kind: 'slice';
	from: number;
	to: number;
	reverse: boolean;
}

interface SpreadAction {
	kind: 'spread';
}

type Action = SingleAction | SliceAction | SpreadAction;

interface OrderingMatch {
	sliceFrom?: string;
	sliceTo?: string;
	singleNum?: string;
	spread?: string;
}

const ORDERING_REGEX = /\s*(?<sliceFrom>\d+)-(?<sliceTo>\d+)\s*|\s*(?<singleNum>\d+)\s*|\s*(?<spread>\*)\s*/g;

export default class ReorderCommand extends Command {

	public constructor() {
		super('reorder', {
			aliases: ['reorder', '↕'],
			description: {
				content: 'Reorders the current queue.\nA number means that the song at that number currently will be moved to that position.\nA \'-\' between two numbers means to move all the songs, starting from first number to the second number.\nA \'\\*\' means to spread the remaining songs out (multiple \'\\*\' will split it evenly).',
				usage: '<ordering>',
				examples: ['1-3 7 *', '1 2 3 *', '10-7 * 1 2 3 3 * 10-7']
			},
			category: 'music',
			channel: 'guild',
			ratelimit: 2,
			args: [
				{
					id: 'ordering',
					match: 'content'
				}
			]
		});
	}

	public async exec(message: Message, { ordering }: { ordering: string | null }) {
		if (!message.member?.voice?.channel) {
			return message.util!.reply({
				embed: { description: '<:MItoCross:769434647234347009> You must be connected to a voice channel to use that command!', color: 'RED' }
			});
		}

		if (!ordering) {
			return message.util!.reply({
				embed: { description: '<:MItoCross:769434647234347009> You need to supply a new order of the queue!', color: 'RED' }
			});
		}
		const orderingMatch = ordering.match(ORDERING_REGEX);
		if (!orderingMatch || orderingMatch.join('').length !== ordering.length) {
			return message.util!.reply({
				embed: { description: '<:MItoCross:769434647234347009> You need to supply a valid order of the queue!', color: 'RED' }
			});
		}

		const queue = this.client.music.queues.get(message.guild!.id);
		const queueLength = await queue.length();
		const actions: Action[] = [];
		// eslint-disable-next-line @typescript-eslint/init-declarations
		let match;
		while ((match = ORDERING_REGEX.exec(ordering)) !== null) {
			const groups: OrderingMatch = match.groups!;
			if (groups.sliceFrom && groups.sliceTo) {
				let from = Number(groups.sliceFrom) - 1;
				let to = Number(groups.sliceTo) - 1;
				let reverse = false;
				if (to < from) {
					[from, to] = [to, from];
					reverse = true;
				}

				if (from >= queueLength || to >= queueLength || from < 0 || to < 0) {
					return message.util!.reply({
						embed: { description: '<:MItoCross:769434647234347009> Some song number were out of the bond!', color: 'RED' }
					});
				}

				actions.push({
					kind: 'slice',
					from,
					to,
					reverse
				});
			} else if (groups.singleNum) {
				const num = Number(groups.singleNum) - 1;
				if (num >= queueLength || num < 0) {
					return message.util!.reply({
						embed: { description: '<:MItoCross:769434647234347009> Some song number were out of the bond!', color: 'RED' }
					});
				}

				actions.push({
					kind: 'single',
					num
				});
			} else {
				actions.push({
					kind: 'spread'
				});
			}
		}

		const tracks = await queue.tracks();
		const unusedIndices = new Set(Array.from({ length: queueLength }, (_, i) => i));
		const newTracks = [];
		for (const action of actions) {
			switch (action.kind) {
				case 'single':
					newTracks.push(tracks[action.num]);
					unusedIndices.delete(action.num);
					break;
				case 'slice':
					// eslint-disable-next-line no-case-declarations
					const slice = tracks.slice(action.from, action.to + 1);
					if (action.reverse) slice.reverse();
					newTracks.push(...slice);
					for (let i = action.from; i <= action.to; i++) {
						unusedIndices.delete(i);
					}
					break;
				case 'spread':
					newTracks.push('*');
					break;
				default:
					break;
			}
		}

		const spreadAmount = actions.filter(a => a.kind === 'spread').length;
		if (spreadAmount) {
			const sliceSize = Math.ceil(unusedIndices.size / spreadAmount);
			const unusedTracks = Array.from(unusedIndices, n => tracks[n]);
			for (let i = 0; i < newTracks.length; i++) {
				if (newTracks[i] === '*') {
					newTracks.splice(i, 1, ...unusedTracks.splice(0, sliceSize));
				}
			}
		}
		queue.store.cached.delete(queue.keys.next);
		await queue.add(...newTracks);

		return message.util!.reply({
			embed: { description: '<:MitoShuffle:781825691355709480> Re-ordered the queue!', color: '#F04438' }
		});
	}

}
