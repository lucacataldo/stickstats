<template>
	<div class="outer">
		<p>
			Thanks for checking out <a class="link" href="https://stickstats.club">StickStats</a>! Enjoy
			these wallpapers as a token of our appreciation. Click / tap on an image below to download the
			full-res wallpaper without any watermarks,
		</p>
		<div class="cont">
			<a v-for="(url, i) in thumbs" :key="url" :href="fulls[i]" class="thumbWrap float-up" download target="_blank" rel="noopener">
				<img class="thumb" :src="url" alt="Leafs 2021 Wallpaper" />
			</a>
		</div>
	</div>
</template>

<script>
export default {
	mounted() {},
	data() {
		return {
			variations: ["outline", "full"],
			colours: ["yellow", "blue", "pink", "teal", "orange"]
		};
	},
	computed: {
		thumbs: function() {
			let arr = [];
			this.variations.forEach(vari => {
				this.colours.forEach(col => {
					arr.push(`/files/img/${vari}/thumbnails/tn_${col}.jpg`);
				});
			});

			return arr;
		},
		fulls: function() {
			let arr = [];
			this.variations.forEach(vari => {
				this.colours.forEach(col => {
					arr.push(`/files/img/${vari}/${col}.jpg`);
				});
			});

			return arr;
		}
	}
};
</script>

<style scoped>
.outer {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.cont {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	max-width: 1280px;
}

p {
  text-align: center;
	max-width: 900px;
  font-size: 1.2em;
  margin: 25px var(--lrMargins);
}

.link {
	font-weight: bold;
	color: var(--mainText);
	background: var(--light);
	padding: 0px 5px;
	border-radius: 5px;
  transition: box-shadow 0.4s ease;
}

.thumb {
	width: 200px;
	margin: 0px;
}

.thumbWrap {
	width: 200px;
  height: 354px;
	margin: 10px;
  background: var(--light);
  border-radius: var(--mainBorderRad);
  overflow: hidden;
  transition: box-shadow 0.4s ease;
}

a:any-link:hover{
  box-shadow: 0px 0px 0px 2px var(--highlight);
}
</style>
