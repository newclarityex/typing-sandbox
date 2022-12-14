<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import supabase from "../utils/supabaseClient";
    import fetchWords from "../utils/fetchWords";
    import Stats from "../lib/Stats.svelte";
    import { Link } from "svelte-routing";

    export let options;

    let completed: string[] = [];
    let upcoming: string[] = [];
    let current: string[] = [];
    let incorrect: string[] = [];

    let charIndex = 0;

    let active = false;
    let start = null as null | number;
    let finish = null as null | number;

    const finalize = () => {
        active = false;
        finish = Date.now();
        window.removeEventListener("keydown", handleKeyDown);
    };

    let completedWords = 0;
    let pastChars = 0;
    let lastWordCompleted = 0;
    const wordCompleted = async () => {
        lastWordCompleted = Date.now();

        completedWords++;
        pastChars += current.length;
        if (upcoming.length === 0 && options.limit.type === "count") finalize();

        completed.push(current.join(""));
        completed = completed;
        current = upcoming.shift().split("");
        upcoming = upcoming;
        charIndex = 0;

        if (options.limit.type !== "count") {
            if (options.type !== "random") {
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
            } else {
                for (let i = 0; i < 100; i++) {
                    upcoming.push(randomLetter());
                }
            }
        }
    };

    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const randomLetter = () => {
        return alphabet[Math.floor(Math.random() * alphabet.length)];
    };

    const initialize = async () => {
        // Reset all values
        start = null;
        finish = null;
        upcoming = [];
        completed = [];
        current = [];
        incorrect = [];
        charIndex = 0;
        completedWords = 0;

        // Generate or fetch data
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
            window.addEventListener("keydown", handleKeyDown);
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
            window.addEventListener("keydown", handleKeyDown);
        }
    };

    const countdownTimer = () => {
        // Set the finish time to be the start time incrimented by the time in MS
        finish = start + options.limit.value * 1000;

        setTimeout(() => {
            finalize();
        }, options.limit.value * 1000);
    };

    let lastTyped = Date.now();
    let autoTimeout = null as number | null;
    const resetAutoTimer = () => {
        clearTimeout(autoTimeout);
        lastTyped = Date.now();
        autoTimeout = window.setTimeout(() => {
            finalize();
        }, options.limit.value * 1000);
    };

    const beginTyping = () => {
        start = Date.now();
        active = true;
        if (options.limit.type === "time") countdownTimer();
        if (options.limit.type === "auto") resetAutoTimer();
    };

    function handleKeyDown(e: KeyboardEvent) {
        if (charIndex === current.length && !options.spaceRequired) {
            wordCompleted();
        }

        let key = e.key.toLowerCase();

        if (key === "backspace") {
            e.preventDefault();

            if (incorrect.length > 0) {
                if (options.limit.type === "auto") resetAutoTimer();
                incorrect.pop();
                incorrect = incorrect;
            } else if (charIndex > 0) {
                if (options.limit.type === "auto") resetAutoTimer();
                // Prevent backspace from deleting valid characters in random mode
                if (options.type === "random") return;

                charIndex--;
            }
            return;
        }

        if (key === " ") {
            e.preventDefault();

            if (charIndex === current.length) {
                if (options.limit.type === "auto") resetAutoTimer();
                wordCompleted();
            }
            return;
        }

        // Only allow letters
        if (!alphabet.includes(key.toLowerCase())) return;

        let char = current[charIndex];
        e.preventDefault();

        if (start === null) beginTyping();
        if (options.limit.type === "auto") resetAutoTimer();

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

    export let location = "";

    onMount(async () => {
        initialize();
    });

    onDestroy(() => {
        finalize();
    });
</script>

<div class="absolute h-full w-full flex flex-col items-center justify-center">
    <div class="relative w-full h-1/3">
        <Stats
            {active}
            {start}
            {finish}
            {options}
            words={completedWords}
            chars={pastChars + charIndex}
            {lastTyped}
            {lastWordCompleted}
        />
    </div>

    <div class="w-full h-1/3 flex flex-col justify-center">
        <div
            class="block relative w-full h-11 overflow-hidden text-4xl transition-opacity"
            class:opacity-0={upcoming.length === 0 && completed.length === 0}
        >
            <div class="text-white absolute left-1/2 upcoming">
                {#each current as char, index}
                    {#if index >= charIndex}
                        <span
                            class={`whitespace-pre ${
                                active ? "text-green-400" : ""
                            }`}>{char}</span
                        >
                    {/if}
                {/each}
                {#each upcoming as word, index}
                    {#if index < 10 || (options.type === "random" && index < 100)}
                        <span class="whitespace-pre">{word}&nbsp;</span>
                    {/if}
                {/each}
            </div>
            <div
                class="text-right text-white absolute right-1/2 completed opacity-50 flex flex-row"
            >
                {#each completed as word, index}
                    {#if index > completed.length - 10 || (options.type === "random" && index > completed.length - 100)}
                        <div class="whitespace-pre">{word}&nbsp;</div>
                    {/if}
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
    </div>
    <div class="h-1/3 flex flex-row gap-8 items-center">
        <button class="text-3xl px-6 py-4 menu-btn" on:click={initialize}>
            Reset
        </button>
        <Link to="options">
            <span class="text-3xl px-6 py-4 menu-btn"> Options </span>
        </Link>
    </div>
</div>

<style scoped>
    .upcoming {
        line-height: 100%;
        white-space: pre;
    }
    .completed {
        line-height: 100%;
        white-space: pre;
    }
    .menu-btn {
        color: rgba(255, 255, 255, 1);
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>
