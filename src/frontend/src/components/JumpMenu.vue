<template>
	<div class="nav-menu">
		<div v-for="item in items" :key="item.name">
			<div
				class="menu-item"
				:data-id="item.name"
				:id="'menu-button-' + item.tag.slice(1)"
				@click="jumpTo(item.tag)"
			>
				{{ item.name }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		items: Array
	},
	mounted() {
		let intMargin = window.innerHeight - 150;
		let observer = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						document.querySelector(`#menu-button-${entry.target.id}`).style.boxShadow =
							"0px 2px 0px var(--highlight)";
					} else if (!entry.isIntersecting) {
						document.querySelector(`#menu-button-${entry.target.id}`).style.boxShadow =
							"0px 0px 0px var(--highlight)";
					}
				});
			},
			{ rootMargin: `-50px 0px -${intMargin}px 0px` }
		);

		this.items.forEach(element => {
			observer.observe(document.querySelector(element.tag));
		});
	},
	methods: {
		jumpTo: function(tag) {
			let top = document.querySelector(tag).offsetTop - 40;

			window.scrollTo({ top, behavior: "smooth" });
		}
	}
};
</script>

<style scoped>
.nav-menu {
	justify-content: center;
	display: flex;
	position: sticky;
	top: -1px;
	padding: 10px;
	box-sizing: border-box;
	background: var(--mainBg);
	z-index: 19;
	width: 100%;
}

.menu-item {
	cursor: pointer;
	padding: 5px 15px;
	transition: box-shadow 0.3s ease;
}

.menu-item:hover {
	box-shadow: 0px 5px 0px var(--highlight) !important;
}
</style>
