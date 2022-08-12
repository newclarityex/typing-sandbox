<script lang="ts">
    import { onMount } from "svelte";
    import supabase from "./utils/supabaseClient";
    import fetchWords from "./utils/fetchWords";

    let completed = [];
    let upcoming = [];
    let incorrect = [];

    onMount(async () => {
        const { data, error } = await fetchWords(supabase, {
            minLength: 0,
            maxLength: 10,
            common: true,
            limit: 100,
        });
        if (error) {
            console.error(error);
        }
        const newUpcoming = [];
        for (const word of data) {
            newUpcoming.push(...word.text, " ");
        }
        upcoming = newUpcoming;

        window.addEventListener("keydown", (e) => {
            let key = e.key;

            if (key === "Backspace") {
                incorrect.pop();
                incorrect = incorrect;
                return;
            }

            let newUpcoming = [...upcoming];
            let char = newUpcoming.shift();

            if (key !== char && key.length === 1) {
                incorrect.push(key);
                incorrect = incorrect;
            } else {
                completed.push(char);
                upcoming = newUpcoming;
                completed = completed;
            }
        });
    });
</script>

<main class="h-full w-full">
    <div class="h-full w-full flex flex-col items-center justify-center">
        <div class="w-1/3 h-24 relative overflow-hidden text-3xl">
            <div class="text-white absolute left-1/2 upcoming">
                {#each upcoming as char}
                    <span class="whitespace-pre">{char}</span>
                {/each}
            </div>
            <div
                class="text-white absolute right-1/2 completed opacity-50 flex flex-row"
            >
                {#each completed as char}
                    <div>{char}</div>
                {/each}
                {#each incorrect as char}
                    <div class="text-red-500 line-through">{char}</div>
                {/each}
            </div>
        </div>
    </div>
</main>

<style>
    .upcoming {
        line-height: 6rem;
        white-space: pre;
    }
    .completed {
        line-height: 6rem;
        white-space: pre;
    }
</style>
