<template>
	<div class="list-component">
		<ul>
			<li v-for="(item, k) in itemList" v-bind:key="k">
				<h2>
					<router-link :to="`/item/${k}`">{{ item.title }}</router-link>
				</h2>
				<p>{{ item.content }}</p>
			</li>
		</ul>
		<hr>
		<div>
			<input placeholder="输入标题" v-model="title">
			<input placeholder="输入内容" v-model="content">
			<button @click="submit">提交</button>
		</div>
	</div>
</template>

<script>
import { mapActions } from "vuex"
export default {
	asyncData({ store, route }) {
		// 触发 action 后，会返回 Promise
		return store.dispatch("fetchItems")
	},
	data() {
		return {
			title: "",
			content: "",
		}
	},
	computed: {
		// 从store的state对象中获取item
		itemList() {
			return this.$store.state.items
		}
	},
	methods: {
		submit() {
            const { title, content } = this
            this.$store.dispatch("addItem", { title, content })
        }
	}
}
</script>

<style>
.list-component {
	padding-left: 50px;
}
</style>

