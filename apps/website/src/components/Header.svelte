<script>
    import Button from "./ui/Button.svelte";
    import { GithubIcon } from "lucide-svelte";
</script>

<header class="sticky top-0 z-40 w-full bg-gradient-to-b from-background via-background to-transparent">
    <div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div class="flex items-center gap-2">
            <img src="/favicon.png" alt="logo" class="w-8 h-8" />
            <h1>Zeyr</h1>
        </div>
        <Button>
            <GithubIcon class="mr-2 h-5 w-5" /> GitHub
        </Button>
    </div>
</header>