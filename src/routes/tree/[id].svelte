<script>
    // populated with data from the endpoint
    /*
        [
            {id, firstname,lastname,parent1,parent2}
        ]
    */
    import Avatar from '/src/components/Avatar.svelte'
    import ChildTree from '/src/components/ChildTree.svelte'

    // export let tree
    export let characters

    let selected
    let editing = false
    
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

    const onEdit = () => {
        editing = !editing
    }

    const sendEdit = () => {
        
    }

</script>

<!-- FORM TO ADD A NEW CHARACTER -->
<div class="form">
	<h2>Ajouter un personnage</h2>
	
	<form method="post" enctype="multipart/form-data">
		<label for='file'>Fichier: </label><input type='file' name='file' id='file'>
        <label for='lastname'>Nom: </label><input type="text" name='lastname' />
		<label for='firstname'>Prénom: </label><input type="text" name='firstname' />
        <label for='parent1'>Parent 1: </label>
        <select name="parent1" size="1">
			<option value="0"> --- </option>
			{#each characters as perso}
				<option value={perso.id}>{perso.firstname} {perso.lastname}</option>
            {/each}
		</select>
        <label for='parent1'>Parent 2: </label>
        <select name="parent2" size="1">
			<option value="0"> --- </option>
			{#each characters as perso}
                <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
            {/each}
		</select>
		<input type="submit" value="Submit" />
	</form>
</div>

<center id='treeBody'>
    <!-- SELECT ACTIVE CHARACTER -->
    <label for='character'>Select a Character</label><select id='character' bind:value={selected} name="Afficher" size="1">
        <option style="display:none"></option>
        {#each characters as perso}
            <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
        {/each}
    </select>
    {#if selected}
        <button id='editButton' on:click={onEdit}>{editing? 'Cacher' : 'Editer'}</button>
    {/if}

    <!-- EDIT FORM OF SELECTED CHAR -->
    {#if editing}
        <div>
            Prénom: <input type='text' bind:value={currentChar.firstname} />
            Nom: <input type='text' bind:value={currentChar.lastname} />
            Parent1:
            <select bind:value={currentChar.parent1} name="parent1" size="1">
                <option value="0"> --- </option>
                {#each characters.filter(c => c.id !== currentChar.id && (c.id !== currentChar.parent2 || currentChar.parent2 === 0)) as perso}
                    <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
                {/each}
		    </select>
            Parent2:
            <select bind:value={currentChar.parent2} name="parent2" size="1">
                <option value="0"> --- </option>
                {#each characters.filter(c => c.id !== currentChar.id && (c.id !== currentChar.parent1 || currentChar.parent1 === 0)) as perso}
                    <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
                {/each}
		    </select>
            <input type='file' name='file' />
            <input type='submit' value='Save' />
        </div>
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
                            <ChildTree parentID={sibling.id} characters={characters} bind:selected />
                        {/each}
                    {/if}
                    <ChildTree parentID={currentChar.id} characters={characters} bind:selected />
                </ul>
            </li></ul>
        {:else}
        <!-- No parents & siblings -->
            <ul>
                <ChildTree parentID={currentChar.id} characters={characters} bind:selected />
            </ul>
        {/if}
        </div>
    {/if}
</center>