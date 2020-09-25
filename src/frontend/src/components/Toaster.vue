<template>
	<transition name="open">
		<div v-if="isOpen" class="container">
			<div class="top">
				<i class="fas fa-times close" @click="isOpen = false"></i>
			</div>
			<div class="message">
				<span v-html="options.message">
				</span>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: "Toaster",
	data() {
		return {
			options: {
				message: "Loading message, please wait.",
				length: 5000
			},
			isOpen: false
		};
	},
	methods: {
		toast: function(opts = { message: "message", length: 5000}) {
			this.options = opts;
			this.isOpen =  true;

			setTimeout(() => {
				this.isOpen = false
			}, 25000);
		}
	}
};
</script>

<style scoped>
.container {
	position: fixed;
	width: 50%;
	left: 25%;
	bottom: 10px;
	min-height: 100px;
	background: var(--light);
	z-index: 100;
	border-radius: 20px;
	box-shadow: 0px 00px 50px 20px rgba(0, 0, 0, 0.9);
	display: flex;
	flex-direction: column;
	padding: 15px 50px;
	box-sizing: border-box;
}

.top {
	width: 100%;
	box-sizing: border-box;
	margin-bottom: 5px;
	text-transform: uppercase;
}

.message {
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	flex-grow: 1;
	font-size: 15px;
	line-height: 16px;
}

.message span {
	text-align: center;
}

.close {
	position: absolute;
	padding: 10px;
	left: 5px;
	top: 5px;
	opacity: 0.4;
	cursor: pointer;
	transition: opacity 0.3s ease;
}

.close:hover {
	opacity: 1;
}

.open-enter-active,
.open-leave-active{
	transition: all 0.4s ease;
}

.open-enter-active{
	transition-delay: 1s;
}

.open-enter, 
.open-leave-to{
	opacity: 0;
	transform: translateY(100px);
}

@media screen and (max-width: 1280px) {
	.container{
		width: 90%;
		left: 5%;
		text-align: l;
		padding: 30px;
	}

	.message span{
		padding: 5px;
	}
}
</style>
