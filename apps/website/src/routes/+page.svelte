<script>
    const features = [
        'Image manipulation',
        'Fun commands',
        "Stuff"
    ]
</script>

<div class="flex flex-col items-center justify-center h-screen gap-4">
    <img src="/favicon.png" alt="logo" class="h-28 w-28" />
    <h1 class="text-5xl font-bold">
        Descentralising bots industry.
    </h1>
    <div class="flex divide-foreground divide-x-2">
        {#each features as feature}
        <p class="px-2">{feature}</p>
        {/each}
    </div>
</div>