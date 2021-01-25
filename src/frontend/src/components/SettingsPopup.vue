<template>
	<div class="container">
		<i class="fas fa-ellipsis-v settingsButton" @click="menuOpen = !menuOpen"></i>
		<transition name="menu">
			<div v-if="menuOpen" class="menu">
				<span>Theme Colour</span>
				<ul class="colourOptions">
					<li
						v-for="colour in colourOptions"
						:key="colour"
						:style="{ background: '#' + colour }"
						@click="selectColour(colour)"
					></li>
				</ul>
        <br>
        <div @click="clearStorage()" class="button noselect">Clear Cache</div>
        
			</div>
		</transition>
	</div>
</template>

<script>
export default {
	name: "SettingsPopup",
	data() {
		return {
			colourOptions: ["fbff12", "0affc2", "00ccf5", "ff7700", "f50076"],
			menuOpen: false
		};
	},
	methods: {
		selectColour: function(colour) {
			colour = "#" + colour;
			this.$parent.themeColour = colour;
			localStorage.themeColour = colour;
    },
    clearStorage: function () {
      localStorage.clear(); 
      alert('Cleared!');
    }
	},
	mounted() {
		document.addEventListener("click", e => {
			if (
				e.target !== document.querySelector(".settingsButton") &&
				this.menuOpen === true &&
				!document.querySelector(".menu").contains(e.target)
			) {
				this.menuOpen = false;
			}
		});
	}
};
</script>

<style scoped>
.container {
	position: absolute;
	right: 25px;
	top: 25px;
	z-index: 20;
}

.settingsButton {
	position: absolute;
	height: 20px;
	width: 20px;
	font-size: 20px;
	opacity: 0.5;
	top: 0px;
	right: 0px;
	cursor: pointer;
	transition: opacity 0.2s ease;
	padding: 5px;
}

.settingsButton:hover {
	opacity: 1;
}

.menu {
	position: relative;
	width: 200px;
	max-height: 250px;
	overflow-y: auto;
	background: var(--light);
	top: 0px;
	right: 25px;
	padding: 10px;
	border-radius: var(--mainBorderRad);
	box-sizing: border-box;
	transform-origin: top right;
	transform: scale(1);
	opacity: 1;
}

.menu-enter-active,
.menu-leave-active {
	transition: transform 0.4s ease, opacity 0.4s ease;
}

.menu-enter,
.menu-leave-to {
	transform: scale(0);
	opacity: 0;
}

.colourOptions {
	position: relative;
	display: flex;
	flex-shrink: 0;
	flex-wrap: wrap;
	width: 100%;
	justify-content: flex-start;
}

li {
	margin: 5px;
	list-style: none;
	width: 25px;
	border-radius: var(--mainBorderRad);
	height: 25px;
	cursor: pointer;
	transition: transform 0.3s ease;
}

li:hover {
	transform: translateY(-5px) scale(1.2);
}
</style>
