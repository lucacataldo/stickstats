<template>
	<div class="cont" :class="{ open: isOpen }">
		<div class="button" @click="open">
			<i class="fa fa-exchange-alt"></i>
		</div>
		<div class="selectorCont" v-if="isOpen">
      <h3>Compare With</h3>
			<input placeholder="search" type="text" v-model="searchTerm" />
      <div class="results">
        <a href="../compare/10">
          <img width="75px" :src="`https://www-league.nhlstatic.com/images/logos/teams-current-primary-dark/10.svg`">
        </a>
      </div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			isOpen: false,
			searchTerm: ""
		};
	},
	methods: {
		open() {
			this.isOpen = !this.isOpen;
		}
	}
};
</script>

<style scoped>
.cont {
	z-index: 19;
	position: fixed;
	width: 60px;
	height: 60px;
	bottom: 10px;
	right: 10px;
}

.cont.open {
	width: 250px;
	height: 400px;
}

.button {
	position: absolute;
	bottom: 5px;
	right: 5px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 10px !important;
	box-sizing: border-box;
	width: 50px;
	height: 50px;
	background: var(--light);
	color: var(--mainText);
}

.button:hover {
	background: var(--highlight);
	color: var(--light);
}

.selectorCont {
	width: 100%;
	height: 100%;
	position: absolute;
	background: var(--light);
	box-sizing: border-box;
	padding: 20px;
	border-radius: var(--mainBorderRad);
  text-align: center;
}

input {
  margin: 10px 0px;
	width: 100%;
	height: 30px;
	box-sizing: border-box;
	border: none;
	outline: none;
	border-radius: 100px;
	text-align: center;
  background: var(--mainBg);
  color: var(--mainText);
  font-weight: 900;
}

input:focus{
box-shadow: 0px 0px 0px 2px var(--highlight);
}

.results{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
