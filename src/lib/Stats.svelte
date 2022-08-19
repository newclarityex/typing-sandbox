<script lang="ts">
	import { fade } from "svelte/transition";

	export let start: null | number;
	export let finish: null | number;
	export let words: number;
	export let chars: number;
	export let limit: {
		type: "count" | "time" | "auto";
		value: number;
	};
</script>

{#if start === null}
	<div
		class="absolute w-full h-full text-5xl text-white flex flex-col justify-center items-center"
		transition:fade
	>
		Start typing to begin
	</div>
{/if}
