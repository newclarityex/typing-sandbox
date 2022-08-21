<script lang="ts">
    import { Router, Link, Route } from "svelte-routing";
    import OptionsMenu from "./routes/OptionsMenu.svelte";
    import TextHandler from "./routes/TextHandler.svelte";

    let options = {
        type: "frequent" as "random" | "frequent" | "all",
        spaceRequired: false,
        minLength: 0,
        maxLength: 16,
        limit: {
            type: "time" as "count" | "time" | "auto",
            value: 60,
        },
    };
    export let url = "";
</script>

<main class="h-full w-full">
    <Router {url}>
        <Route path="/" component={TextHandler} {options} />
        <Route path="options" component={OptionsMenu} {options} />
    </Router>
</main>

<style scoped>
</style>
