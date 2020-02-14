import { TEXT } from "@/common/lang";
import context from "@/common/context";
import { getRepeatComment, hasOperation, getRepeatItemId } from "../utils";
import { reload } from "@/dom/utils";
import { editRepeat } from "@/kooboo/outsideInterfaces";
import { KoobooComment } from "@/kooboo/KoobooComment";
import BaseMenuItem from "./BaseMenuItem";
import { Menu } from "../menu";

export default class EditRepeatItem extends BaseMenuItem {
  constructor(parentMenu: Menu) {
    super(parentMenu);

    const { el, setVisiable, setReadonly } = this.createItem(TEXT.EDIT_REPEAT);
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
    if (!getRepeatItemId(comments)) return this.setVisiable(false);
    this.setReadonly(hasOperation(context.operationManager));
  }

  async click() {
    let { element } = context.lastSelectedDomEventArgs;
    this.parentMenu.hidden();

    let comments = KoobooComment.getComments(element);
    let id = getRepeatItemId(comments)!;
    await editRepeat(id, "");
    reload();
  }
}
