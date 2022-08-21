<script lang="ts">
    import { Link } from "svelte-routing";

    export let options;

    const minFreqLen = 0;
    const maxFreqLen = 16;
    const minLen = 0;
    const maxLen = 31;

    export let location = "";
</script>

<div
    class="absolute w-full h-full flex flex-col items-center justify-center gap-24"
>
    <h1 class="text-white text-4xl">Options</h1>
    <div class="flex flex-col items-center justify-center gap-12">
        <h2 class="text-white text-3xl">Text Options</h2>
        <div class="text-white text-2xl flex flex-col items-center gap-4">
            <label for="text-type">Text Type</label>
            <select
                name="text-type"
                bind:value={options.type}
                class="px-2 py-2"
            >
                <option value="frequent">Frequent</option>
                <option value="all">All</option>
                <option value="random">Random</option>
            </select>
        </div>
        <div
            class="text-white text-2xl flex flex-col items-center gap-6"
            class:opacity-50={options.type === "random"}
            class:pointer-events-none={options.type === "random"}
        >
            <label for="require-space">Require Spacebar</label>
            <input
                name="require-space"
                type="checkbox"
                bind:checked={options.spaceRequired}
            />
        </div>
    </div>
    <div class="flex flex-col items-center justify-center gap-12">
        <h2 class="text-white text-3xl">Time Options</h2>
        <div class="text-white text-2xl flex flex-col items-center gap-4">
            <label for="text-type">Limit Type</label>
            <select
                name="text-type"
                bind:value={options.limit.type}
                class="px-2 py-2"
            >
                <option value="auto">Auto</option>
                <option value="count">Count</option>
                <option value="time">Duration</option>
            </select>
        </div>
        <div class="text-white text-2xl">
            Stop after <input
                name="require-space"
                type="text"
                bind:value={options.limit.value}
                class="mx-3 px-2 py-2 w-12 text-center"
            />
            {#if options.limit.type === "count"}
                {#if options.type === "random"}
                    character(s)
                {:else}
                    word(s)
                {/if}
            {:else}
                second(s)
                {#if options.limit.type === "auto"}
                    of inactivity
                {/if}
            {/if}
        </div>
    </div>
    <Link to="/">
        <span class="text-3xl px-6 py-4 menu-btn"> Back </span>
    </Link>
</div>

<style scoped>
    .menu-btn {
        color: rgba(255, 255, 255, 1);
        background-color: rgba(0, 0, 0, 0.5);
    }
    select,
    input {
        background: rgba(0, 0, 0, 0.5);
    }

    input[type="checkbox"] {
        appearance: none;
        position: relative;
        height: 36px;
        width: 36px;
        background: rgba(0, 0, 0, 0.5);
    }

    input[type="checkbox"]:checked::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 65%;
        height: 65%;
        background: #fff;
    }

    input[type="checkbox"]:hover {
        cursor: pointer;
    }
</style>
