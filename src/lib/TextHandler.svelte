<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import supabase from "../utils/supabaseClient";
    import fetchWords from "../utils/fetchWords";

    export let options;

    let completed: string[] = [];
    let upcoming: string[] = [];
    let current: string[] = [];
    let incorrect: string[] = [];

    let charIndex = 0;

    const wordCompleted = async () => {
        completed.push(current.join(""));
        completed = completed;
        current = upcoming.shift().split("");
        upcoming = upcoming;
        charIndex = 0;

        if (options.limit.type !== "count") {
            const { data, error } = await fetchWords(supabase, {
                minLength: 0,
                maxLength: options.maxLength,
                common: options.type === "frequent",
                limit: 100,
            });

            if (error) {
                console.error(error);
            }

            for (const word of data) {
                upcoming = [...upcoming, word.text];
            }
        }
    };

    const randomLetter = () => {
        const alphabet = "abcdefghijklmnopqrstuvwxyz";
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    };

    const initialize = async () => {
        upcoming = [];
        completed = [];
        current = [];
        incorrect = [];

        if (options.type === "random") {
            current = [];
            if (options.limit.type === "count") {
                for (let i = 0; i < options.limit.value; i++) {
                    upcoming.push(randomLetter());
                }
            } else {
                for (let i = 0; i < 100; i++) {
                    upcoming.push(randomLetter());
                }
            }
            current = upcoming[0].split("");
            upcoming = upcoming.slice(1);
        } else {
            const { data, error } = await fetchWords(supabase, {
                minLength: 0,
                maxLength: options.maxLength,
                common: options.type === "frequent",
                limit:
                    options.limit.type === "count" ? options.limit.value : 100,
            });

            if (error) {
                console.error(error);
            }

            for (const word of data) {
                upcoming = [...upcoming, word.text];
            }
            current = upcoming[0].split("");
            upcoming = upcoming.slice(1);
        }
    };

    $: if (options) {
        initialize();
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (charIndex === current.length && !options.spaceRequired) {
            wordCompleted();
        }

        let key = e.key;

        if (key === "Backspace") {
            e.preventDefault();

            if (incorrect.length > 0) {
                incorrect.pop();
                incorrect = incorrect;
            } else if (charIndex > 0) {
                // Prevent backspace from deleting valid characters in random mode
                if (options.type === "random") return;

                charIndex--;
            }
            return;
        }

        if (key === " ") {
            e.preventDefault();
            if (charIndex === current.length) {
                wordCompleted();
            }
            return;
        }

        // Only allow letters
        if (key.length !== 1) return;

        let char = current[charIndex];
        e.preventDefault();

        // If there are incorrect characters, or if the current character is incorrect, then add to array;
        if (incorrect.length > 0 || char !== key) {
            incorrect.push(key);
            incorrect = incorrect;
            return;
        }

        // If the current character is correct, then move to the next character
        charIndex++;

        if (options.type === "random" && options.limit.type !== "count") {
            upcoming.push(randomLetter());
        }

        // Check completion if space is not required
        if (charIndex === current.length && !options.spaceRequired) {
            wordCompleted();
            return;
        }
    }

    onMount(async () => {
        initialize();
        window.addEventListener("keydown", handleKeyDown);
    });

    onDestroy(() => {
        window.removeEventListener("keydown", handleKeyDown);
    });
</script>

<div class="block relative w-full h-11 overflow-hidden text-4xl">
    <div class="text-white absolute left-1/2 upcoming">
        {#each current as char, index}
            {#if index >= charIndex}
                <span class="whitespace-pre text-green-400">{char}</span>
            {/if}
        {/each}
        {#each upcoming as word}
            <span class="whitespace-pre">{word}&nbsp;</span>
        {/each}
    </div>
    <div
        class="text-right text-white absolute right-1/2 completed opacity-50 flex flex-row"
    >
        {#each completed as word}
            <div class="whitespace-pre">{word}&nbsp;</div>
        {/each}
        <div class="whitespace-pre text-green-400">
            {#each current as char, index}
                {#if index < charIndex}
                    {char}
                {/if}
            {/each}
        </div>
        <div class="whitespace-pre text-red-500 line-through">
            {#each incorrect as char}
                {char}
            {/each}
        </div>
    </div>
</div>

<style>
    .upcoming {
        line-height: 100%;
        white-space: pre;
    }
    .completed {
        line-height: 100%;
        white-space: pre;
    }
</style>
