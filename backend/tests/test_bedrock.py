import sys

sys.path.append(".")

import unittest
from pprint import pprint

from app.bedrock import (
    calculate_query_embedding,
    call_converse_api,
    compose_args_for_converse_api,
)

from app.synthetize_speech import (
    synthetize_speech,
)

from app.repositories.models.conversation import ContentModel, MessageModel
from app.routes.schemas.conversation import type_model_name

MODEL: type_model_name = "claude-v3.5-sonnet"


# class TestBedrockEmbedding(unittest.TestCase):
#     def test_calculate_query_embedding(self):
#         question = "Hello"
#         embeddings = calculate_query_embedding(question)
#         # NOTE: cohere outputs a list of 1024 floats
#         self.assertEqual(len(embeddings), 1024)
#         self.assertEqual(type(embeddings), list)
#         self.assertEqual(type(embeddings[0]), float)


class TestCallConverseApi(unittest.TestCase):
    def test_call_converse_api(self):
        message = MessageModel(
            role="user",
            content=[
                ContentModel(
                    content_type="text",
                    media_type=None,
                    body="Hello, can you help me do a quick 5min exercise?",
                    file_name=None,
                )
            ],
            model=MODEL,
            children=[],
            parent=None,
            create_time=0,
            feedback=None,
            used_chunks=None,
            thinking_log=None,
        )
        arg = compose_args_for_converse_api(
            [message],
            MODEL,
            instruction=None,
            stream=False,
            generation_params=None,
        )

        response = call_converse_api(arg)
        # pprint(response)
        pprint(response["output"]["message"]["content"][0]["text"])


        synthetize_speech(response["output"]["message"]["content"][0]["text"],"TestMessage")


if __name__ == "__main__":
    unittest.main()
