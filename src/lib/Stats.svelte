<script lang="ts">
    import { onDestroy } from "svelte";

    export let lastTyped: number;
    export let active: boolean;
    export let start: null | number;
    export let finish: null | number;
    export let words: number;
    export let chars: number;
    export let options;

    let timePassed: number;
    // Words per minute
    let WPM: number;
    // Keys per second
    let KPS: number;

    // Time limit only
    let remainingTime = 0;

    // Auto limit only
    let autoRemaining = 0;

    const updateStats = () => {
        timePassed = (Date.now() - start) / 1000;
        remainingTime = options.limit.value - timePassed;
        autoRemaining = options.limit.value - (Date.now() - lastTyped) / 1000;
        if (!active) {
            remainingTime = 0;
            timePassed = (finish - start) / 1000;
            clearInterval(updateInterval);
        }
        WPM = (words / timePassed) * 60;
        KPS = chars / timePassed;
        if (options.spaceRequired) KPS += words;
    };

    let updateInterval: number;
    $: if (active) {
        clearInterval(updateInterval);
        console.log(words);
        updateInterval = window.setInterval(updateStats, 1000 / 60);
    }
    onDestroy(() => {
        clearInterval(updateInterval);
    });
</script>

<div
    class="absolute w-full h-full text-5xl text-white flex flex-col justify-center items-center gap-12"
>
    {#if start === null}
        Start typing to begin
    {:else}
        {#if options.limit.type === "count"}
            <div
                class={`text-6xl ${
                    active ? "" : "opacity-50"
                } transition-opacity`}
            >
                {options.limit.value - words} remaining
            </div>
        {:else if options.limit.type === "time"}
            <div
                class={`text-6xl ${
                    active ? "" : "opacity-50"
                } transition-opacity`}
            >
                {remainingTime.toFixed(remainingTime < 60 ? 2 : 0)}s
            </div>
        {:else if options.limit.type === "auto"}
            <div
                class={`text-6xl ${
                    active ? "" : "opacity-50"
                } transition-opacity`}
            >
                {autoRemaining.toFixed(autoRemaining < 60 ? 2 : 0)}s
            </div>
        {/if}
        <div class="flex flex-row items-center justify-center gap-8">
            <div class="text-4xl">
                {(WPM || 0).toFixed(2)} WPM
            </div>
            <div class="text-4xl">
                {(KPS || 0).toFixed(2)} KPS
            </div>
        </div>
    {/if}
</div>
