<template>
	<div class="cont" :class="{ darkTheme: theme === false, lightTheme: theme === true }">
		<div class="result" v-if="doneImg">
			<i @click="closeResult" class="fa fa-2x fa-times"></i>
			<h1>Here's your wallpaper!</h1>
			<p>Tap or click the image to download</p>
			<a target="_blank" :href="wallpaperImg" download="wallpaper.jpeg">
				<img :src="wallpaperImg" />
			</a>
		</div>
		<h2 class="float-up">Team Schedule for {{ this.months[month] }}</h2>

		<div class="bgSelector float-up">
			<label class="button" for="imgInput"> <i class="fa fa-image"></i> Custom BG </label>
			<input type="file" name="imgInput" id="imgInput" @change="handleImage" />

			<div class="button download" @click="download">Download Wallpaper</div>
		</div>
		<div>
			<flipper-switch
				class="float-up"
				@flipped="darkLightEvent"
				height="20px"
				width="80px"
				optOne="Dark Text"
				optTwo="Light Text"
			/>
		</div>

		<loader message="Generating Wallpaper..." v-if="loading" />

		<div>
			<br />
			<h3 class="float-up">Preview</h3>
			<br />
		</div>

		<div class="calCont float-up">
			<img
				:src="
					`https://www-league.nhlstatic.com/images/logos/teams-current-primary-${
						theme ? 'light' : 'dark'
					}/${$route.params.id}.svg`
				"
				class="inlineImg"
				width="150px"
				height="150px"
				@error="fallbackImg"
			/>
			<h1>
				{{ this.months[month] }}
			</h1>
			<div class="cal">
				<div v-for="day in dates" :key="day.gameDate" class="day">
					<div v-if="day.noGame">
						<div class="number">
							{{ day.gameDate }}
						</div>
					</div>
					<div v-else>
						<div class="number">
							{{ new Date(day.gameDate).getDate() }}
						</div>
						<img
							:src="
								`https://www-league.nhlstatic.com/images/logos/teams-current-primary-${
									theme ? 'light' : 'dark'
								}/${notThisTeam(day.teams).team.id}.svg`
							"
							width="65px"
							height="65px"
							class="logo"
							@error="fallbackImg"
						/>
						<div class="time">
							{{ getTime(day.gameDate) }}
						</div>
					</div>
				</div>
			</div>
			<div class="watermark">
				<span class="color-highlight">{</span>
				StickStats.club
				<span class="color-highlight">}</span>
			</div>
			<img class="calBg" v-if="customImg" :src="img" alt="Calendar Image" />
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import { toJpeg } from "html-to-image";
import FlipperSwitch from "../components/FlipperSwitch.vue";
import Loader from "../components/Loader.vue";
export default {
	components: { FlipperSwitch, Loader },
	data() {
		return {
			team: {},
			theme: false,
			month: 1,
			loading: false,
			doneImg: false,
			wallpaperImg: "",
			months: [
				null,
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			],
			dates: [],
			customImg: false,
			img: "#"
		};
	},
	async mounted() {
		if (this.$route.params.id) {
			if (this.$route.params.month) {
				this.month = parseInt(this.$route.params.month);
			} else {
				this.month = new Date().getMonth() + 1;
			}

			if (window.innerWidth < 1024) {
				this.scaleFactor = window.innerWidth / 1440;
			} else {
				this.scaleFactor = window.innerWidth / 1920;
			}

			document.querySelector(".calCont").style.transform = `scale(${this.scaleFactor})`;

			let resp = await this.$teams.getSchedule(10, this.month);
			let year = new Date().getFullYear();

			let numDays = new Date(year, this.month, 0).getDate();

			let gameDates = resp.dates.map(d => d.games[0]);

			for (let i = 0; i < numDays; i++) {
				let found = gameDates.find(d => {
					return new Date(d.gameDate).getDate() === i;
				});

				if (found) {
					Vue.set(this.dates, i, found);
				} else {
					Vue.set(this.dates, i, { noGame: true, gameDate: i });
				}
			}

			this.dates.shift();
		} else {
			alert("No team ID");
		}
	},
	methods: {
		notThisTeam(teams) {
			if (parseInt(teams.away.team.id) !== parseInt(this.$route.params.id)) {
				return teams.away;
			} else {
				return teams.home;
			}
		},
		darkLightEvent(state) {
			this.theme = state;
		},
		getTime(date) {
			date = new Date(date);
			let h = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
			let m = date.getMinutes() > 0 ? date.getMinutes() : "00";
			let am_pm = date.getHours() > 12 ? "pm" : "am";
			return `${h}:${m} ${am_pm}`;
		},
		download() {
			document.querySelector(".calCont").style.transform = `scale(1)`;
			this.loading = true;
			toJpeg(document.querySelector(".calCont"), {
				pixelRatio: 1,
				quality: 0.8
			}).then(img => {
				this.wallpaperImg = img;
				document.querySelector(".calCont").style.transform = `scale(${this.scaleFactor})`;
				this.loading = false;
				this.doneImg = true;
				document.querySelector("body").style.overflowY = "hidden";
			});
		},
		closeResult(){
			this.doneImg = false,
			this.wallpaperImg = "",
			document.querySelector("body").style.overflowY = "auto";
			this.animate()
		},
		handleImage() {
			this.customImg = false;
			var reader = new FileReader();
			reader.readAsDataURL(document.querySelector("#imgInput").files[0]);

			reader.onload = e => {
				this.img = e.target.result;
				this.customImg = true;
			};
		}
	}
};
</script>

<style scoped>
.darkTheme {
	--calText: var(--mainText);
	--calBg: url("/wall_bg.png");
	--dayBg: #00000070;
	--dayShad: none;
}

.lightTheme {
	--calText: #222222;
	--calBg: url("/wall_bg_light.png");
	--dayBg: #ffffff90;
	--dayShad: 0px 0px 10px #00000020;
}

.cont {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	text-align: center;
}

.result {
	position: fixed;
	padding: 50px;
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	background: var(--mainBg);
	z-index: 25;
	top: 0px;
	overflow-y: auto;
	left: 0px;
}

.result i {
	position: absolute;
	left: 20px;
	top: 20px;
	cursor: pointer;
}

.result img {
	max-width: 100%;
	max-height: 100%;
	margin-top: 50px;
}

.inlineImg {
	z-index: 2;
	display: block;
}

.button {
	display: inline-block;
	color: var(--mainText);
}

.button:hover {
	color: var(--light);
}

.download {
	margin-left: 10px;
}

.bgSelector {
	margin: 25px 0px;
}

.bgSelector input {
	display: none;
}

.calCont {
	width: 1080px;
	height: 1920px;
	background: var(--calBg);
	background-size: 100px;
	color: var(--calText);
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	transform-origin: top;
	position: relative;
}

.calCont h1 {
	text-shadow: 0px 0px 5px var(--dayBg);
	margin-bottom: 20px;
	z-index: 2;
}

.cal {
	width: 80%;
	position: relative;
	display: flex;
	flex-wrap: wrap;
	z-index: 2;
}

.calBg {
	object-fit: cover;
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 1;
}

.cal .day {
	text-align: center;
	width: 13%;
	height: 150px;
	box-sizing: border-box;
	padding: 5px;
	margin: 0.6%;
	background: var(--dayBg);
	box-shadow: var(--dayShad);
	border-radius: 15px;
}

.number {
	font-size: 30px;
	font-weight: bold;
}

.day .time {
	opacity: 0.8;
}

.watermark {
	position: absolute;
	bottom: 15px;
	justify-self: self-end;
	font-weight: 900;
}
</style>
