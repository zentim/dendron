import { DLogger } from "@dendronhq/common-server";
import _ from "lodash";
import { window } from "vscode";
import { Logger } from "../logger";

export abstract class BaseCommand<TOpts, TOut = any, TInput = any> {
  public L: DLogger;

  constructor(_name?: string) {
    this.L = Logger;
  }

  static showInput = window.showInputBox;

  async gatherInputs(): Promise<TInput|undefined> {
    return {} as any;
  }

  async abstract enrichInputs(inputs: TInput): Promise<TOpts>;

  abstract async execute(opts: TOpts): Promise<TOut>;

  async showResponse(_resp: TOut) {
    return;
  }

  async sanityCheck(): Promise<undefined|string> {
    return;
  }

  async run(): Promise<TOut|undefined> {
    const out = await this.sanityCheck();
    if (!_.isUndefined(out)) {
      window.showErrorMessage(out);
      return;
    }
    
    const inputs = await this.gatherInputs();
    if (!_.isUndefined(inputs)) {
      const opts: TOpts = await this.enrichInputs(inputs);
      const resp = await this.execute(opts);
      this.showResponse(resp);
      return resp;
    }
    return;
  }
}

export abstract class BasicCommand<TOpts, TOut = any> extends BaseCommand<TOpts, TOut, TOpts|undefined> {
  async enrichInputs(inputs: TOpts): Promise<TOpts> {
    return inputs;
  }
}