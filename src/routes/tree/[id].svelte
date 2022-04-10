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
    
    let currentChar
    let parent1
    let parent2
    let siblings

    let files = []
    let form = {
        firstname:'', lastname:'', parent1:0, parent2:0
    }

    // Refresh tree when selected change (even from childs)
    $: if (selected) {
        currentChar = characters.find(c => c.id === selected)
        
        parent1 = currentChar && characters.find(c => c.id === currentChar.parent1)
        parent2 = currentChar && characters.find(c => c.id === currentChar.parent2)

        siblings = characters.filter(c => c.id !== currentChar.id && c.parent1 === currentChar.parent1 && c.parent2 === currentChar.parent2)
    }

    // Validate the form when adding a new char
    const validateForm = e => {
        e.preventDefault()

        if(!form.firstname) return
        
        console.log(files)
        if(files[0]?.size >= 4000000) {
            console.log('file too big')
            return
        }

        return

        fetch(window.location.href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...form })
        }).then(res => {
            if(res.status === 200)
                location.reload()
            else console.error(res)
        })
    }

</script>

<div class="form">
	<h2>Ajouter un personnage</h2>
	
	<form on:submit={validateForm} enctype="multipart/form-data">
		<label for='file'>Fichier: </label><input bind:files type='file' name='file' id='file'>
        <label for='name'>Nom: </label><input type="text" name="nom" bind:value={form.lastname} />
		<label for='prenom'>Prénom: </label><input type="text" name="prenom" bind:value={form.firstname} />
        <label for='parent1'>Parent 1: </label>
        <select bind:value={form.parent1} name="parent1" size="1">
			<option value="0"> --- </option>
			{#each characters as perso}
				<option value={perso.id}>{perso.firstname} {perso.lastname}</option>
            {/each}
		</select>
        <label for='parent1'>Parent 2: </label>
        <select bind:value={form.parent2} name="parent2" size="1">
			<option value="0"> --- </option>
			{#each characters as perso}
                <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
            {/each}
		</select>
		<input type="submit" name="character" value="Submit" />
	</form>
</div>

<center id='treeBody'>
    <!-- Select for active character -->
    <label for='character'>Select a Character</label><select id='character' bind:value={selected} name="Afficher" size="1">
        <option style="display:none"></option>
        {#each characters as perso}
            <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
        {/each}
    </select>

    <!-- Show the tree -->
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