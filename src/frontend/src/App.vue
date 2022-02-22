<template>
	<div v-bind:style="{ '--highlight': themeColour }" id="app">
		<toaster ref="toaster"></toaster>
		<div class="header">
			<router-link to="/">
				<h1 class="title">
					<span class="beta-tag">BETA</span>
					<span class="highlight">{</span>
					&nbsp;
					<h1 style="display: inline">StickStats</h1>
					&nbsp;
					<span class="highlight">}</span>
				</h1>
			</router-link>
			<settings-popup></settings-popup>
		</div>

		<div class="routerView">
			<transition @after-enter="animate()">
				<router-view :theme="themeColour" :key="$route.path"></router-view>
			</transition>
		</div>

		<div class="copyright">
			{{ $teams.copyright }}
		</div>
	</div>
</template>

<script>
import SettingsPopup from "./components/SettingsPopup";
import Toaster from "./components/Toaster";

export default {
	name: "App",
	data() {
		return {
			copyright: "",
			themeColour: "#fbff12"
		};
	},
	components: {
		SettingsPopup,
		Toaster
	},
	methods: {
		toggleSettings: function() {}
	},
	async mounted() {
		localStorage.clear();
		this.$teams.init();
		if (localStorage.themeColour) {
			this.themeColour = localStorage.themeColour;
		}

		this.$refs.toaster.toast({
			message: `
				Hey, thanks for checking out StickStats. We're currently in <b>BETA</b> meaning 
				that there might be some hiccups and bugs along the way.`,
			length: process.env.VUE_APP_TOAST_LENGTH || 5000
		});
	}
};
</script>

<style>
* {
	margin: 0px;
	padding: 0px;
}

.float-up {
	opacity: 0;
}

:root {
	--mainBg: #05040c;
	--mainText: #fefefe;
	--light: #151519;
	--lrMargins: 100px;
	--mainBorderRad: 20px;
	font-family: Heebo, Arial, Helvetica, sans-serif;
	font-display: swap;
}

body {
	background: var(--mainBg);
	color: var(--mainText);
}

.routerView {
	min-height: 700px;
}

.noselect {
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently*/
}

.highlight {
	transition: color 0.4s ease;
	color: var(--highlight);
}

.subtitle {
	display: block;
	font-weight: 100;
	opacity: 0.5;
}

h1 {
	font-weight: 900 !important;
	font-size: 55px;
}

.header {
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 150px;
}

a:link,
a:visited,
:target {
	color: var(--mainText);
	text-decoration: none;
	border: none;
	outline: none;
}

.title {
	display: block;
	position: relative;
}

.title .highlight {
	display: inline-block;
	transition: transform 0.3s ease;
}

.title:hover .highlight {
	transform: translateX(5px) !important;
}

.title:hover .highlight:nth-child(2) {
	transform: translateX(-5px) !important;
}

.beta-tag {
	position: absolute;
	font-size: 15px;
	opacity: 0.5;
	top: 0px;
	right: 0px;
	margin-top: -10px;
	margin-right: 30px;
}

.copyright {
	text-align: center;
	margin: 20px var(--lrMargins);
	font-size: 13px;
	opacity: 0.5;
}

.button {
	padding: 10px 20px;
	border-radius: 100px;
	color: var(--mainText);
	box-shadow: 0px 0px 0px 3px var(--highlight);
	transition: all 0.3s ease;
	font-weight: bold;
	cursor: pointer;
}

.searchBox {
	width: 50%;
	font-size: 20px;
	background: none;
	color: var(--mainText);
	outline: none;
	border-radius: 100px;
	padding: 15px;
	box-sizing: border-box;
	text-align: center;
	margin-left: 25%;
	margin-bottom: 25px;
	border: solid 2px var(--highlight);
	text-transform: capitalize;
	transition: border 0.3s ease;
	transition: all 0.3s ease;
}

.searchBox:focus {
	box-shadow: inset 0px 0px 0px 3px var(--highlight);
}

.button:hover {
	background: var(--highlight);
	color: var(--mainBg);
}

a:any-link.niceLink{
  color: var(--highlight) !important;
}

@media screen and (max-width: 1280px) {
	:root {
		--lrMargins: 25px;
	}

	h1 {
		font-size: 40px;
	}

	.header {
		height: 150px;
	}

	.searchBox {
		width: 90%;
		margin-left: 5%;
	}
}

@media screen and (max-width: 768px) {
	:root {
		--lrMargins: 10px;
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}
</style>
