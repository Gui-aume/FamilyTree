<script>
    // populated with data from the endpoint
    /*
        [
            {id, firstname,lastname,parent1,parent2}
        ]
    */
    // export let tree
    export let characters

    let selected
    
    let currentChar
    let parent1
    let parent2
    let siblings
    let childs

    let files = []
    let form = {
        firstname:'', lastname:'', parent1:0, parent2:0
    }

    const getSiblings = char => characters.filter(c => c.id !== char.id && c.parent1 === char.parent1 && c.parent2 === char.parent2)

    const getChilds = id => characters.filter(c => c.parent1 === id || c.parent2 === id)

    const displayChar = char => `<h3><img src='/static/default.jpg'><br />${char.firstname} ${char.lastname}</h3>`

    const displayBothChar = (char1, char2) => `<h3><img src='/static/default.jpg'> <img src='/static/default.jpg'><br /><br />
        ${char1.firstname} ${char1.lastname} & ${char2.firstname} ${char2.lastname}</h3>`

    const onSelect = () => {
        currentChar = characters.find(c => c.id === selected)
        parent1 = currentChar && characters.find(c => c.id === currentChar.parent1)
        parent2 = currentChar && characters.find(c => c.id === currentChar.parent2)
        siblings = characters.filter(c => c.id !== currentChar.id && c.parent1 === currentChar.parent1 && c.parent2 === currentChar.parent2)
        childs = child_tree(currentChar.id)
    }


    const child_tree = id => {
        let tree_list = ''

        const childList = getChilds(id)

        if(childList.length > 0) {
            tree_list = '<ul>'
            childList.forEach(c => {
                tree_list += `<li>${displayChar(c)}</li>`
                tree_list += child_tree(c.id)
            })
            tree_list += '</ul>'
        }
        return tree_list
    }


    const validateForm = e => {
        e.preventDefault()

        if(!form.firstname && !form.lastname) return
        
        // console.log(files)
        // if(files[0]?.size >= 4000000) {
        //     console.log('file too big')
        //     return
        // }

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

<div id='tree'>
    <h1>TREE</h1>
    <select bind:value={selected} on:change={onSelect} name="Afficher" size="1">
        <option style="display:none"></option>
        {#each characters as perso}
            <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
        {/each}
    </select>
    {#if currentChar}
        <center><h2>{currentChar.firstname} {currentChar.lastname}</h2></center>

        <div class='tree'>
        <!-- Get parents -->
        {#if currentChar?.parent1 > 0 || currentChar?.parent2 > 0}
            <ul><li>
            {#if currentChar?.parent1 > 0 && currentChar?.parent2 > 0}
                {@html displayBothChar(parent1, parent2)}
            {:else}
                {@html displayChar(currentChar?.parent1 > 0 ? parent1 : parent2)}
            {/if}

            {#if siblings?.length > 0}
                <ul>
                {#each siblings as sibling}
                    <li>{@html displayChar(sibling)}</li>
                    {@html child_tree(sibling.id)}
                {/each}
                <li>{@html displayChar(currentChar)}
                    {#if childs?.length > 0}
                        {@html childs}
                    {/if}
                </li>
                </ul>
            {:else}
                <ul><li>{@html displayChar(currentChar)}
                    {#if childs?.length > 0}
                        {@html childs}
                    {/if}
                </li></ul>
            {/if}
            
            </li></ul>
        {:else}
            <ul><li>{@html displayChar(currentChar)}
                {#if childs?.length > 0}
                    {@html childs}
                {/if}
            </li></ul>
        {/if}
        </div>
    {/if}
</div>


<!--
parents = <h3>Avatar<br />Nom Prénom</h3>
both_parents = <h3>Avatar Avatar<br /><br />Nom Prénom et Nom Prénom</h3>
arbre_childs=<ul><li><h3>Avatar<br />Nom Prénom</h3><ul>Childs</ul></li></ul>
arbre_fratrie=<ul><li><h3>Avatar<br />Nom Prénom<ul>Childs</ul></li>


si parents:
    si fratrie:
        arbre_fratrie.="<li>".$name.$arbre_childs."</li></ul>"
    sinon:
        <ul><li>".$name.$arbre_childs."</li></ul>
sinon:
    <div class='tree'><ul><li>".$name.$arbre_childs."</li></ul>    
-->