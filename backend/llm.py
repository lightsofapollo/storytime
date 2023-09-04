from constants import DEFAULT_TEMPATURE
from langchain.chat_models import ChatOpenAI
from langchain.llms import Replicate
from langchain.llms.base import BaseLLM
from langchain.callbacks import StreamingStdOutCallbackHandler


def analysis_llm() -> BaseLLM:
    return ChatOpenAI(model="gpt-3.5-turbo", streaming=True, 
                    #   callbacks=[StreamingStdOutCallbackHandler()], 
        temperature=DEFAULT_TEMPATURE)


def story_llm() -> BaseLLM:
    return Replicate(
        streaming=True,
        callbacks=[StreamingStdOutCallbackHandler()],
        model="a16z-infra/llama-2-13b-chat:9dff94b1bed5af738655d4a7cbcdcde2bd503aa85c94334fe1f42af7f3dd5ee3",
        input={"temperature": DEFAULT_TEMPATURE, "max_new_tokens": 2000, "top_p": 1})
