export default {
	/**************
	method: wall
	params: packet
	describe: The global wall feature that installs with every agent
	***************/
	async wall(packet) {
		const wall = await this.methods.sign('wall', 'default', packet);
		return wall;
	},
};
