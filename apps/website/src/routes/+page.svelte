<script>
    import { fade } from 'svelte/transition';
    import Button from '../components/ui/Button.svelte';

    const texts = [
        "dev",
        "general",
        "weeb"
    ];

    $: text = texts[Math.floor(Math.random() * texts.length)];

    setInterval(() => {
        text = texts[Math.floor(Math.random() * texts.length)];
    }, 3000);
</script>

<div class="p-12 text-left flex flex-col gap-3 max-w-3xl">
    <div class="flex flex-row gap-3 items-center">
        <img src="/favicon.png" alt="logo" class="h-16 w-16" />
        <h1 class="text-5xl font-extrabold">
            A bot for {text} communities
        </h1>
    </div>
    <p class="text-gray-300 text-lg">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Et expedita recusandae alias excepturi iure vero deserunt odit voluptates quo nam sint, obcaecati consectetur quibusdam sunt! Corrupti, aliquid. Aspernatur, maiores nemo!
    </p>
    <div class="flex gap-3">
        <Button>Get</Button>
    </div>
</div>