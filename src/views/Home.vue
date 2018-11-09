<template>
	<div class="home">
		<h3>首页--这是Home页面级组件</h3>
		<img src="../assets/logo.png">
		<ul>
			<li>
				<router-link to="/list">列表页</router-link>
			</li>
		</ul>
		<router-view></router-view>
		<!-- <HelloWorld msg="Welcome to Your Vue.js App"></HelloWorld> -->
	</div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld"
export default {
	components: {
		HelloWorld
	}
}
</script>

<style>
.home {
	text-align: center;
	color: rgb(86, 99, 158);
}
</style>

