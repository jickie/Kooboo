import { TEXT } from "@/common/lang";
import context from "@/common/context";
import { isBody } from "@/dom/utils";
import { getRepeatComment, changeNameOrId } from "../utils";
import { getWrapDom, getGuidComment } from "@/kooboo/utils";
import { OBJECT_TYPE } from "@/common/constants";
import { newGuid } from "@/kooboo/outsideInterfaces";
import { CopyRepeatUnit } from "@/operation/recordUnits/CopyRepeatUnit";
import { operationRecord } from "@/operation/Record";
import { KoobooComment } from "@/kooboo/KoobooComment";
import BaseMenuItem from "./BaseMenuItem";
import { Menu } from "../menu";
import { kvInfo } from "@/common/kvInfo";

export default class CopyRepeatItem extends BaseMenuItem {
  constructor(parentMenu: Menu) {
    super(parentMenu);

    const { el, setVisiable } = this.createItem(TEXT.COPY_REPEAT);
    this.el = el;
    this.el.addEventListener("click", this.click.bind(this));
    this.setVisiable = setVisiable;
  }

  el: HTMLElement;

  setVisiable: (visiable: boolean) => void;

  update(comments: KoobooComment[]): void {
    this.setVisiable(true);
    let { element } = context.lastSelectedDomEventArgs;
    if (isBody(element)) return this.setVisiable(false);
    if (!this.getRepeatItemId(comments)) return this.setVisiable(false);
  }

  click() {
    let args = context.lastSelectedDomEventArgs;
    this.parentMenu.hidden();

    let comments = KoobooComment.getComments(args.element);
    let { nodes } = getWrapDom(args.element, OBJECT_TYPE.contentrepeater);
    if (!nodes || nodes.length == 0) return;
    let anchor: Node = nodes[nodes.length - 1];
    let parent = anchor.parentNode!;
    let guid = newGuid() + "_name";
    let oldGuid = this.getRepeatItemId(comments)!;

    for (const node of nodes.reverse()) {
      let insertNode = node.cloneNode(true);
      changeNameOrId(insertNode, guid, oldGuid);
      parent.insertBefore(insertNode, anchor.nextSibling);
    }

    let comment = getRepeatComment(comments)!;
    let units = [new CopyRepeatUnit(getGuidComment(guid))];
    let log = [...comment.infos, new kvInfo("old", oldGuid), new kvInfo("new", guid), kvInfo.copy];

    let operation = new operationRecord(units, log, guid);
    context.operationManager.add(operation);
  }

  getRepeatItemId(comments: KoobooComment[]) {
    var repeatComment = comments.find(f => f.source == "repeatitem");
    if (!repeatComment) return;
    for (const commnet of comments) {
      var id = commnet.getValue("id");
      if (id) {
        let fullpathComment = commnet.getValue("fullpath");
        let path = repeatComment.getValue("path");
        if (fullpathComment && path && fullpathComment.startsWith(path)) return id;
      }
    }
  }
}
