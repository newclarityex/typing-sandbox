<script lang="ts">
    import { fade } from "svelte/transition";
    import { onMount, onDestroy } from "svelte";

    export let start: null | number;
    export let finish: null | number;
    export let words: number;
    export let chars: number;
    export let limit: {
        type: "count" | "time" | "auto";
        value: number;
    };

    let timePassed: number;
    let WPM: string;

    const updateStats = () => {
        timePassed = (Date.now() - start) / 1000 / 60;
        WPM = (words / timePassed).toFixed(2);
    };

    let updateInterval: number;
    onMount(() => {
        updateInterval = window.setInterval(updateStats, 1000 / 60);
    });
    onDestroy(() => {
        clearInterval(updateInterval);
    });
</script>

{#if start === null}
    <div
        class="absolute w-full h-full text-5xl text-white flex flex-row justify-center items-center"
        transition:fade
    >
        Start typing to begin
    </div>
{:else if limit.type === "count"}
    <div
        class="absolute w-full h-full text-5xl text-white flex flex-row justify-center items-center"
        transition:fade
    >
        <div>{timePassed} WPM</div>
    </div>
{:else if limit.type === "time"}
    <div
        class="absolute w-full h-full text-5xl text-white flex flex-row justify-center items-center"
        transition:fade
    >
        <div>{WPM} WPM</div>
    </div>
{:else if limit.type === "auto"}
    <div
        class="absolute w-full h-full text-5xl text-white flex flex-col justify-center items-center"
        transition:fade
    >
        .
    </div>
{/if}
