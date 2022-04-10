<script>
    // The page always has access to props from `get`...
    export let items;
    // ...plus props from `post` when the page is rendered
    // in response to a POST request, for example after
    // submitting the form below
    export let errors;
  </script>
  
  {#each items as item}
    <p>{item}<p/>
  {/each}
  
  <form method="post" enctype="multipart/form-data">
    <input type='text' name="title" />
    <input type='text' name='bob' />
    <input type='file' name='file' />
  
    {#if errors?.title}
      <p class="error">{errors.title}</p>
    {/if}
  
    <input type="submit" value='Create' />
  </form>