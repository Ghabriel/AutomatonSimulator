/// <reference path="jQuery.d.ts" />

import {Renderer} from "./Renderer"
import {utils} from "./Utils"

export class Menu extends Renderer {
	constructor(title: string) {
		super();
		this.title = title;
		this.children = [];
	}

	add(elem: Element): void {
		this.children.push(elem);
	}

	clear(): void {
		this.children = [];
	}

	onRender(): void {
		let node = this.node;
		let wrapper = utils.create("div");
		wrapper.classList.add("menu");

		let title = utils.create("div");
		title.classList.add("title");
		title.innerHTML = this.title;
		wrapper.appendChild(title);

		let content = utils.create("div");
		content.classList.add("content");
		for (let child of this.children) {
			content.appendChild(child);
		}
		wrapper.appendChild(content);
		node.appendChild(wrapper);

		title.addEventListener("click", function() {
			$(content).slideToggle(300);
		});
	}

	private title: string;
	private children: Element[];
}
