<template>
	<div class="item-component">
		<div>{{ item.title }}</div>
		<p>{{ item.content }}</p>
	</div>
</template>

<script>
// import { mapActions } from "vuex"
export default {
	asyncData({ store, route }) {
		// 触发 action 后，会返回 Promise
		return store.dispatch("fetchItem", route.params.id)
	},
	// data() {
	// 	this.$options.asyncData({
	// 		store: this.$store,
	// 		route: this.$route
	// 	})
	// 	return {}
	// },
	computed: {
		// 从 store 的 state 对象中获取 item
		item() {
			return this.$store.state.items[this.$route.params.id]
		}
	}
}
</script>
