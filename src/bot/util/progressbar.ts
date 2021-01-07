const emoji = {
	left: '<:MitoProgressLeft:781127460183474176>',
	middle: '<:MitoProgressMiddle:781127559558463488>',
	right: '<:MitoProgressRight:781127644959866911>'
};

const progress = (num: number, max: number, size = 10) => {
	const percentage = num / max;
	const progress = Math.round(size * percentage);
	if (progress === 0) return emoji.right.repeat(size);
	const emptyProgress = size - progress;
	const progressText = (emoji.left).repeat(progress - 1);
	const middleText = emoji.middle;
	const emptyProgressText = (emoji.right).repeat(emptyProgress);

	return `${progressText}${middleText}${emptyProgressText}`;
};

export default progress;
