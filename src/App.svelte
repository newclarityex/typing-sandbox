<script lang="ts">
	import OptionsMenu from "./lib/OptionsMenu.svelte";
	import TextHandler from "./lib/TextHandler.svelte";

	let options = {
		type: "frequent" as "random" | "frequent" | "all",
		spaceRequired: false,
		minLength: 0,
		maxLength: 16,
		limit: {
			type: "time" as "count" | "time" | "auto",
			value: 20,
		},
	};
</script>

<main class="h-full w-full">
	<TextHandler {options} />
</main>

<style scoped>
</style>
