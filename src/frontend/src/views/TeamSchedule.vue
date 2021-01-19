<template>
	<div class="cont">
		<h2>Team Schedule for {{ this.months[month] }}</h2>

		<div class="bgSelector">
			<label class="button" for="imgInput">
				<i class="fa fa-image"></i>
			</label>
			<input type="file" name="imgInput" id="imgInput" @change="handleImage" />

			<div class="button download" @click="download">Download Wallpaper</div>
		</div>

		<div class="calCont">
			<img
				:src="
					`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${$route.params.id}.svg`
				"
				class="inlineImg"
        width="100px"
        height="100px"
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
								`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/${
									notThisTeam(day.teams).team.id
								}.svg`
							"
              width="50px"
              height="50px"
							class="logo"
							@error="fallbackImg"
						/>
						<div class="time">
							{{ getTime(day.gameDate) }}
						</div>
					</div>
				</div>
			</div>
			<img class="calBg" v-if="customImg" :src="img" alt="Calendar Image" />
		</div>
	</div>
</template>

<script>
import Vue from "vue";
import html2canvas from "html2canvas";
export default {
	data() {
		return {
			team: {},
			month: 1,
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
			let resp = await this.$teams.getSchedule(10, this.month);
			console.log(resp);
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
		getTime(date) {
			date = new Date(date);
			let h = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
			let m = date.getMinutes() > 0 ? date.getMinutes() : "00";
			let am_pm = date.getHours() > 12 ? "pm" : "am";
			return `${h}:${m} ${am_pm}`;
		},
		download() {
			html2canvas(document.querySelector(".calCont"), {
        allowTaint: true,
        removeContainer: true,
				scale: 2,
				scrollX: -window.scrollX,
				scrollY: -window.scrollY,
				windowWidth: document.documentElement.offsetWidth,
        windowHeight: document.documentElement.offsetHeight,
			}).then(canvas => {
				var image = canvas.toDataURL("image/jpeg", 1.0);
				window.open(image, "_blank");
			});
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
.cont {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	text-align: center;
}

.inlineImg {
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
	background: var(--light);
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	transform-origin: top;
  position: relative;
}

.calCont h1 {
	margin-bottom: 20px;
}

.cal {
	width: 80%;
	position: relative;
	display: flex;
	flex-wrap: wrap;
	z-index: 2;
}

.calBg {
	object-fit: fill;
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
	background: #00000050;
	border-radius: 15px;
}

.number {
	font-size: 30px;
	font-weight: bold;
}

.day .logo {
	margin: 10px 0px;
}

.day .time {
	opacity: 0.6;
}
</style>
