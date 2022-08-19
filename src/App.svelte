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
            value: 0,
        },
    };
</script>

<main class="h-full w-full">
    <div class="h-full w-full flex flex-col items-center justify-center">
        <div class="text-5xl text-white h-1/3 flex flex-col justify-center">
            Start typing to begin
        </div>
        <div class="w-full h-1/3 flex flex-col justify-center">
            <TextHandler {options} />
        </div>
        <div class="h-1/3 flex flex-row gap-8 items-center">
            <button class="text-3xl px-6 py-4 menu-btn"> Reset </button>
            <button class="text-3xl px-6 py-4 menu-btn"> Options </button>
        </div>
        <!-- <OptionsMenu bind:options /> -->
    </div>
</main>

<style scoped>
    .menu-btn {
        color: rgba(255, 255, 255, 1);
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>
