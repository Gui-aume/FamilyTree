<script>
	// Form to add a new character to the tree
    export let characters
</script>

<div class="form">
	<h2>Ajouter un personnage</h2>
	
	<form method="post" enctype="multipart/form-data">
		<label for='file'>Fichier: </label><input type='file' name='file' id='file'>
        <label for='lastname'>Nom: </label><input type="text" name='lastname' id='lastname' />
		<label for='firstname'>Prénom: </label><input type="text" name='firstname' id='firstname' />
        <label for='parent1'>Parent 1: </label>
        <select name="parent1" size="1" id='parent1' >
			<option value="0"> --- </option>
			{#each characters as perso}
				<option value={perso.id}>{perso.firstname} {perso.lastname}</option>
            {/each}
		</select>
        <label for='parent2'>Parent 2: </label>
        <select name="parent2" size="1" id='parent2' >
			<option value="0"> --- </option>
			{#each characters as perso}
                <option value={perso.id}>{perso.firstname} {perso.lastname}</option>
            {/each}
		</select>
		<input type="submit" value="Submit" />
	</form>
</div>

<style>
.form {
	margin:5px;
	padding:5px;
	border:1px solid #a5a5a5;
	background-color:#e3e3e3;
	display: flex;
	flex-direction: column;
	align-items: center;
}

label {
	cursor: pointer;
}
</style>