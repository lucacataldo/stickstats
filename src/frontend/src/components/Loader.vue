<template>
	<div class="cont">
		<i class="fa fa-5x fa-circle-notch"></i>
	</div>
</template>

<style scoped>
.cont {
	display: flex;
	grid-column: span 5;
	justify-content: center;
	margin: 200px 0px;
	color: var(--highlight);
}

i{
	animation: spin 1s linear infinite;
}

@keyframes spin {
	from{
		transform: rotate(0deg);
	}

	to{
		transform: rotate(360deg);
	}
}
</style>
