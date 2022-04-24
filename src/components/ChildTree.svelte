<script>
    // recursive generation of child tree boxes
    import Avatar from '/src/components/Avatar.svelte'

    export let parentID // id of the parent
    export let characters // list of all characters
    export let selected
    // used by avatar to send a new portrait
    export let tree = undefined

    // keep track of printed characters to avoid infinite loop
    export let treeCharList

    // keep track of printed chars in the tree: prevent from infinite loop
    treeCharList = [...treeCharList, selected]
    const countSelected = () => treeCharList.reduce((a,c) => a + (c === selected ? 1 : 0), 0)

    const getChilds = id => characters.filter(c => c.parent1 === id || c.parent2 === id)
</script>

<li><Avatar char1={characters.find(c => c.id === parentID)} bind:selected tree={tree} />
    <!-- In practice should be 1, but 2 shows if a parent loop is present -->
    {#if countSelected() <= 2 }
        {#if getChilds(parentID).length > 0}
            <ul>
                {#each getChilds(parentID) as child}
                    <svelte:self parentID={child.id} characters={characters} bind:selected bind:treeCharList />
                {/each}
            </ul>
        {/if}
    {/if}
</li>