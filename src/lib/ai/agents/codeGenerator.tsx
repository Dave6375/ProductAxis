import { createStreamableUI, createStreamableValue} from "ai/rsc";
import { CoreMessage, streamText} from "ai";
import {getModel} from "@/lib/utils/registry";
import {LLMSelection} from "@/lib/types";
import {BotMessage} from "@/components/chat-message";