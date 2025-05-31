import type { PromptRole } from "./role.type";
import type { PromptStyle } from "./style.type";
import type { TokenMode } from "./token.type";

type PromptPanelProps = {
  promptPanelOpen: boolean;
  setPromptPanelOpen: (open: boolean) => void;
  promptRole: PromptRole;
  setPromptRole: (role: PromptRole) => void;
  promptStyle: PromptStyle;
  setPromptStyle: (style: PromptStyle) => void;
  tokenMode: TokenMode;
  setTokenMode: (mode: TokenMode) => void;
};

export type { PromptPanelProps };
