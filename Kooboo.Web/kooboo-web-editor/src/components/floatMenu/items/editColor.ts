import { TEXT } from "@/common/lang";
import context from "@/common/context";
import BaseMenuItem from "./BaseMenuItem";
import { Menu } from "../menu";
import { KoobooComment } from "@/kooboo/KoobooComment";
import { getScopeComnent } from "../utils";
import { createColorEditor } from "@/components/colorEditor";
import { isDirty } from "@/kooboo/utils";

export default class EditColorItem extends BaseMenuItem {
  constructor(parentMenu: Menu) {
    super(parentMenu);

    const { el, setVisiable, setReadonly } = this.createItem(TEXT.EDIT_COLOR);
    this.el = el;
    this.el.addEventListener("click", this.click.bind(this));
    this.setVisiable = setVisiable;
    this.setReadonly = setReadonly;
  }

  el: HTMLElement;

  setVisiable: (visiable: boolean) => void;

  setReadonly: (readonly: boolean) => void;

  update(comments: KoobooComment[]): void {
    this.setVisiable(true);
    let { element, koobooId } = context.lastSelectedDomEventArgs;
    this.setReadonly(isDirty(element));
    if (!getScopeComnent(comments)) return this.setVisiable(false);
    if (!koobooId) return this.setVisiable(false);
  }

  async click() {
    let args = context.lastSelectedDomEventArgs;
    let comments = KoobooComment.getComments(args.element);
    createColorEditor(args.element, getScopeComnent(comments)!, args.koobooId!);
    this.parentMenu.hidden();
  }
}
