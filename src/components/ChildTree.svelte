<script>
    import Avatar from '/src/components/Avatar.svelte'

    export let parentID // id of the parent
    export let characters // list of all characters
    export let selected

    const getChilds = id => characters.filter(c => c.parent1 === id || c.parent2 === id)
</script>

<li><Avatar char1={characters.filter(c => c.id === parentID)[0]} bind:selected />
    {#if getChilds(parentID).length > 0}
        <ul>
            {#each getChilds(parentID) as child}
                <svelte:self parentID={child.id} characters={characters} bind:selected />
            {/each}
        </ul>
    {/if}
</li>