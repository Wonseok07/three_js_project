<script>
	import { onMount,onDestroy } from 'svelte';
	import { dice,roll } from '$lib/utils/dice';

	onMount(() => {
		dice();
	});
	function roll_dice() {
		roll()
	}
</script>

<!-- <section>
	<form name="form2" method="post" action="form_app.js" class="list">
		<h1 class="title">list</h1>
		1 : <input type="text" name="list" value=""> <br>
		2 : <input type="text" name="list" value=""> <br>
		3 : <input type="text" name="list" value=""> <br>
		4 : <input type="text" name="list" value=""> <br>
		5 : <input type="text" name="list" value=""> <br>
		6 : <input type="text" name="list" value=""> <br>
		<input type="submit" value="addition" class="choice1">
		<input type="reset" value="reset" class="choice2">
	</form>
</section> -->

<div id="container"></div>
<div id="blocker"></div>		
<div class="roll" on:click={roll_dice}>Roll the dice</div>
<h3 class="source">Dice Model Source: SHARK FIN</h3>

<style>
	.roll{
		font-size: 40px;
		border-radius: 5px;
		padding-top:2.5%;
		bottom:5%;
		height: 6.5%;
		text-align: center;
		width:20%;
		color:white;
		background-color: black;
		position:absolute;
		margin-left: 40%;
	}
	.roll:hover{
		cursor: pointer;
	}
    h6{
        margin: 0;
    }
	#container {
		/* background-image: url('$lib/imgs/main_pic.png'); */
		background-repeat: no-repeat;
		width: 100%;
		background-size: cover;
	}
	.source{
		position: fixed;
		font-size: 20px;
		right: 1%;
		bottom: 1%;
	}
	/* .list{
		font-size: 20px;
		position: fixed;
		top: 0.5%;
		left: 0.2%;
		width: 13%;
	}
	.choice1{
		width: 60px;
		height: 20px;
		position: fixed;
		left: 8.3%;
		top: 29%;
	}
	.choice2{
		width: 60px;
		height: 20px;
		position: fixed;
		left: 4.5%;
		top: 29%;
	} */
</style>


