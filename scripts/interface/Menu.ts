/// <reference path="../defs/jQuery.d.ts" />

import {Renderer} from "./Renderer"
import {Settings} from "../Settings"
import {utils} from "../Utils"

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

		let arrow = utils.create("div");
		arrow.classList.add("menu_arrow");

		let title = utils.create("div");
		title.classList.add("title");
		title.appendChild(arrow);
		title.innerHTML += this.title;
		wrapper.appendChild(title);

		let content = utils.create("div");
		content.classList.add("content");
		for (let child of this.children) {
			content.appendChild(child);
		}
		wrapper.appendChild(content);
		node.appendChild(wrapper);

		let self = this;
		title.addEventListener("click", function() {
			if (!$(content).is(":animated")) {
				$(content).slideToggle(Settings.menuSlideInterval, function() {
					self.updateArrow();
				});
			}
		});

		this.body = <HTMLDivElement> wrapper;

		if (this.toggled) {
			this.internalToggle();
		}

		this.updateArrow();
	}

	toggle(): void {
		this.toggled = !this.toggled;
		if (this.body) {
			this.internalToggle();
		}
	}

	html(): HTMLDivElement {
		return this.body;
	}

	private updateArrow(): void {
		let arrow = this.body.querySelector(".menu_arrow");
		if ($(this.content()).css("display") == "none") {
			arrow.innerHTML = "&#x25BA;";
		} else {
			arrow.innerHTML = "&#x25BC;";
		}
	}

	private content(): Element {
		return this.body.querySelector(".content");
	}

	private internalToggle(): void {
		$(this.content()).toggle();
	}

	private body: HTMLDivElement = null;
	private title: string;
	private children: Element[];
	private toggled: boolean = false;
}
