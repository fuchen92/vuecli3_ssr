import Vue from "vue"
import Router from "vue-router"

import Home from "@/views/Home"

Vue.use(Router)

export function createRouter() {
	return new Router({
		mode: "history",
		scrollBehavior: () => ({ y: 0 }),
		routes: [
			{
				path: "/",
				component: Home,
				children: [
					{
						path: "",
						component: () => import("@/views/List")
					}
				]
			},
			{
				path: "/about",
				name: "about",
				component: () => import(/* webpackChunkName: "about" */"@/views/About")
			},
			{
				path: "/list",
				component: () => import(/* webpackChunkName: "list" */"@/views/List")
			},
			{
				path: "/item/:id",
				component: () => import("@/views/Item")
			}
		]
	})
}
