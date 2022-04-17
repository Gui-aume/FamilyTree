<script>
    export let characters
</script>

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