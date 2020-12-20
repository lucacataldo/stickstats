<template>
	<div class="cont">
		<div>
			<i class="fa fa-5x fa-circle-notch"></i>
			<div v-if="!isLongWait" class="message">{{ message }}</div>
			<div v-else class="message">{{ waitMsg }}</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isDestroyed: false,
			isLongWait: false,
			waitMsg: ""
		};
	},
	async mounted() {
		await this.wait(5000);
		this.isLongWait = true;
		this.waitMsg = "Remember when the Leafs lost to a Zamboni driver?";
		if (this.isDestroyed) {
			return 0;
		}

		await this.wait(5000);
		this.waitMsg = "That was fun :)";
		if (this.isDestroyed) {
			return 0;
    }
    
    await this.wait(5000);
		this.waitMsg = "Shoutout to /r/hockey!";
		if (this.isDestroyed) {
			return 0;
		}

		await this.wait(5000);
		this.waitMsg = "Sorry it shouldn't take this long...";
		if (this.isDestroyed) {
			return 0;
		}

		await this.wait(5000);
		this.waitMsg = "Maybe you requested a lot of data.";
		if (this.isDestroyed) {
			return 0;
		}

		await this.wait(5000);
		alert("Hmm, sorry this is taking so long. It might be a good idea to try again later.");
		if (this.isDestroyed) {
			return 0;
		}
	},
	beforeDestroy() {
		this.isDestroyed = true;
	},
	timers: [0],
	props: {
		message: {
			type: String,
			default: ""
		}
	},
	methods: {
		wait: async function(time) {
			await new Promise(resolve => {
				setTimeout(() => {
					resolve();
				}, time);
			});
		}
	}
};
</script>

<style scoped>
.cont {
	display: flex;
	grid-column: span 5;
	justify-content: center;
	margin: 100px 0px;
	color: var(--highlight);
	text-align: center;
}

.message {
	margin-top: 20px;
}

i {
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}
</style>
