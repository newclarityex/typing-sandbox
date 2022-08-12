<script lang="ts">
    import { onMount } from "svelte";
    import { supabase } from "../supabaseClient";
    onMount(async () => {
        let { data, error } = await supabase
            .from("words")
            .select("text,length")
            .limit(100);
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    });

    let count: number = 0;
    const increment = () => {
        count += 1;
    };
</script>

<button on:click={increment}>
    count is {count}
</button>
