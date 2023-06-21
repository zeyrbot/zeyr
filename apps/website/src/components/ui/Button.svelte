<script lang="ts">
    const classes = {
        primary: "px-4 py-2 font-normal bg-primary rounded-md hover:bg-opacity-80 text-background flex items-center active:bg-opacity-70",
        secondary: ""
    };

    let variant: "primary" | "secondary";
</script>

<button class={classes[variant]}>
    <slot>
        error
    </slot>
</button>