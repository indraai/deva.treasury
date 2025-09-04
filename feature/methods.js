export default {
	/**************
	method: treasury
	params: packet
	describe: The global wall feature that installs with every agent
	***************/
	async treasury(packet) {
		const treasury = await this.methods.sign('treasury', 'default', packet);
		return treasury;
	},
};
