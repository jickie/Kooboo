import { TEXT } from "@/common/lang";
import context from "@/common/context";
import BaseMenuItem from "./BaseMenuItem";
import { Menu } from "../menu";
import { createDataEdtor } from "@/components/dataEditor";
import { getEditableData } from "@/components/dataEditor/utils";
import { InnerHtmlUnit } from "@/operation/recordUnits/InnerHtmlUnit";
import { setGuid, clearKoobooInfo, markDirty } from "@/kooboo/utils";
import { KoobooComment } from "@/kooboo/KoobooComment";
import { getScopeComnent } from "../utils";
import { operationRecord } from "@/operation/Record";
import { kvInfo } from "@/common/kvInfo";

export default class EditDataItem extends BaseMenuItem {
  constructor(parentMenu: Menu) {
    super(parentMenu);

    const { el, setVisiable } = this.createItem(TEXT.EDIT_DATA);
    this.el = el;
    this.el.addEventListener("click", this.click.bind(this));
    this.setVisiable = setVisiable;
  }

  el: HTMLElement;

  setVisiable: (visiable: boolean) => void;

  update(): void {
    this.setVisiable(true);
    let { element } = context.lastSelectedDomEventArgs;
    let editableData = getEditableData(element);
    if (!editableData) return this.setVisiable(false);
    let comments = KoobooComment.getComments(editableData.parent);
    if (!getScopeComnent(comments)) return this.setVisiable(false);
  }

  async click() {
    this.parentMenu.hidden();
    let { element } = context.lastSelectedDomEventArgs;
    let { parent, koobooId, list } = getEditableData(element)!;
    let comments = KoobooComment.getComments(parent);
    let comment = getScopeComnent(comments)!;
    let startContent = parent.innerHTML;
    try {
      await createDataEdtor(list);
      let value = clearKoobooInfo(parent.innerHTML);
      if (value == clearKoobooInfo(startContent)) return;
      let guid = setGuid(parent);
      markDirty(parent);
      let units = [new InnerHtmlUnit(startContent)];
      let log = [...comment.infos, kvInfo.value(value), kvInfo.koobooId(koobooId)];
      let operation = new operationRecord(units, log, guid);
      context.operationManager.add(operation);
    } catch (error) {
      parent.innerHTML = startContent;
    }
  }
}
