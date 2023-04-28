import { Module } from "@kbotdev/plugin-modules";
import { ApplyOptions } from "@sapphire/decorators";

@ApplyOptions<Module.Options>({
  fullName: "System module",
  description: "Module to manage system category",
})
export class SystemModule extends Module {
  public isEnabled(): boolean {
    return true;
  }
}
