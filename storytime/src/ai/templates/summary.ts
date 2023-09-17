import endent from "endent";
import { BaseTemplate } from "./base";

export default class SummaryTemplate extends BaseTemplate {
  constructor(sheet: string) {
    super();
    this.template = endent`
        SUMMARY_TEMPLATE = """
        Create a medium form summary in paragraph form of the following character sheet include all relevant details but remove the field preceding the actual description. Be sure to include all details.

        ${sheet}`;
  }
}
