import { TEXT } from "@/common/lang";
import context from "@/common/context";
import { isDynamicContent, isDirty } from "@/kooboo/utils";
import { isLink } from "@/dom/utils";
import {
  getViewComment,
  getUrlComment,
  updateDomLink,
  updateUrlLink,
  updateAttributeLink,
  getAttributeComment,
  getRepeatComment,
  getScopeComnent
} from "../utils";
import { KoobooComment } from "@/kooboo/KoobooComment";
import BaseMenuItem from "./BaseMenuItem";
import { Menu } from "../menu";

export default class EditLinkItem extends BaseMenuItem {
  constructor(parentMenu: Menu) {
    super(parentMenu);

    const { el, setVisiable } = this.createItem(TEXT.EDIT_LINK);
    this.el = el;
    this.el.addEventListener("click", this.click.bind(this));
    this.setVisiable = setVisiable;
  }

  el: HTMLElement;

  setVisiable: (visiable: boolean) => void;

  update(comments: KoobooComment[]): void {
    this.setVisiable(true);
    let { element } = context.lastSelectedDomEventArgs;
    let aroundComments = KoobooComment.getAroundComments(element);
    if (!isLink(element)) return this.setVisiable(false);
    if (!getScopeComnent(comments)) return this.setVisiable(false);
    if (aroundComments.find(f => f.getValue("attribute") == "href")) return this.setVisiable(false);
  }

  click() {
    let { element } = context.lastSelectedDomEventArgs;
    this.parentMenu.hidden();
    updateDomLink(element);
  }
}
