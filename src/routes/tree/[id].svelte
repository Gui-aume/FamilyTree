<script>
    import CreateForm from '../../components/CreateForm.svelte'
    import EditForm from '../../components/EditForm.svelte'
    import Avatar from '../../components/Avatar.svelte'
    import ChildTree from '../../components/ChildTree.svelte'

    // populated with data from the endpoint
    /*
        [
            {id, firstname,lastname,parent1,parent2}
        ]
    */
    export let characters
    export let tree
    
    // selected character
    let selected

    // list characters printed in the tree to avoid infinite loop
    let treeCharList = []
    
    // ref on the current character object
    let currentChar
    let parent1
    let parent2
    let siblings
    
    // Refresh tree when selected change (even from childs)
    $: if (selected) {
        currentChar = characters.find(c => c.id === selected)
        
        parent1 = currentChar && characters.find(c => c.id === currentChar.parent1)
        parent2 = currentChar && characters.find(c => c.id === currentChar.parent2)

        siblings = characters.filter(c => c.id !== currentChar.id && c.parent1 === currentChar.parent1 && c.parent2 === currentChar.parent2)
    }

</script>

<!-- FORM TO ADD A NEW CHARACTER -->
<CreateForm characters={characters} />

<center id='treeBody'>
    <!-- SELECT ACTIVE CHARACTER -->
    <label for='character'>Select a Character</label><select id='character' bind:value={selected} name="Afficher" size="1">
        <option style="display:none"></option>
        {#each characters as perso}
            <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
        {/each}
    </select>
    
    {#if selected}
        <EditForm bind:selected bind:characters />
    {/if}

    <!-- SHOW THE TREE FROM SELECTED CHARACTER -->
    {#if currentChar}
        <div class='tree'>
        <!-- Get parents & siblings (no half-siblings) -->
        {#if currentChar?.parent1 > 0 || currentChar?.parent2 > 0}
            <ul><li>
                <Avatar char1={parent1} char2={parent2} bind:selected />
                <ul>
                    {#if siblings?.length > 0}
                        {#each siblings as sibling}
                            <ChildTree parentID={sibling.id} characters={characters} bind:selected bind:treeCharList />
                        {/each}
                    {/if}
                    <ChildTree parentID={currentChar.id} characters={characters} bind:selected bind:treeCharList tree={tree} />
                </ul>
            </li></ul>
        {:else}
        <!-- No parents & siblings -->
            <ul>
                <ChildTree parentID={currentChar.id} characters={characters} bind:selected bind:treeCharList tree={tree} />
            </ul>
        {/if}
        </div>
    {/if}
</center>