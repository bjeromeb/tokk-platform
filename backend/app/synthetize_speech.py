import boto3
import os
from contextlib import closing
from boto3.dynamodb.conditions import Key, Attr
from botocore.exceptions import ClientError
import logging


MESSAGE_BUCKET = os.environ.get("LARGE_MESSAGE_BUCKET")

logging.basicConfig(level=logging.INFO, format="%(levelname)s:%(name)s - %(message)s")
logger = logging.getLogger(__name__)


def synthetize_speech(textToSpeak,messageId):
    text = textToSpeak
    voice = "Ruth"
    rest = text
    # Because single invocation of the polly synthesize_speech api can
    # transform text with about 3000 characters, we are dividing the
    # post into blocks of approximately 2500 characters.
    logger.warning("Synthetizing "+ textToSpeak)


    textBlocks = []
    while (len(rest) > 2600):
        begin = 0
        end = rest.find(".", 2500)
        if (end == -1):
            end = rest.find(" ", 2500)
        textBlock = rest[begin:end]
        rest = rest[end:]
        textBlocks.append(textBlock)
    textBlocks.append(rest)
   
    s3 = boto3.client('s3')

    s3.put_object(
        Bucket=MESSAGE_BUCKET,
        Key=messageId + ".txt",
        Body=textToSpeak,
    )
    # output = os.path.join("/tmp/", messageId+"test")
    # with open(output, "w") as file:
    #     file.write(textToSpeak)

    # response = s3.upload_file('/tmp/' + messageId+"test",
    #         MESSAGE_BUCKET,
    #         messageId + "test.txt")


    try:
        # For each block, invoke Polly API, which transforms text into audio
        polly = boto3.client('polly')
        pollyResponse = polly.synthesize_speech(
            OutputFormat='mp3',
            Text = textToSpeak,
            VoiceId = voice,
            Engine="generative"
        )
        if "AudioStream" in pollyResponse:
            with closing(pollyResponse["AudioStream"]) as stream:
                # output = os.path.join("/tmp/", messageId)
                # with open(output, "wb") as file:
                #     file.write(stream.read())
                logger.info("******* stream: ")
                content = stream.read();
                logger.info(content)
                response = s3.put_object(
                        Bucket=MESSAGE_BUCKET,
                        Key=messageId + ".mp3",
                        Body=content,
                    )
                logger.info("******** s3 action: ", response)

        # if 'AudioStream' in pollyResponse:
        #     output = os.path.join("/tmp/", messageId)
        #     with open(output, "wb") as file:
        #     #with open('/tmp/speech.mp3', 'wb') as file:
        #         file.write(pollyResponse['AudioStream'].read())
    except ClientError as e:
        logger.error("Mp3 output couldn't be saved: ", e)
    except:
        logger.error("Mp3 Polly Synthetize Speech error")

    # for textBlock in textBlocks:
    #     response = polly.synthesize_speech(
    #         OutputFormat='mp3',
    #         Text = textBlock,
    #         VoiceId = voice,
    #         Engine="generative"
    #     )
    #     # Save the audio stream returned by Amazon Polly on Lambda's temp
    #     # directory. If there are multiple text blocks, the audio stream
    #     # is combined into a single file.
    #     if "AudioStream" in response:
    #         with closing(response["AudioStream"]) as stream:
    #             output = os.path.join("/tmp/", messageId)
    #             with open(output, "wb") as file:
    #                 file.write(stream.read())

    # Upload mp3 to S3 bucket

    # try:
    #     response = s3.upload_file('/tmp/' + messageId,
    #         MESSAGE_BUCKET,
    #         messageId + ".mp3")

    # except ClientError as e:
    #     logger.error("Mp3 output couldn't be saved: ", e)
    
    # s3.put_object_acl(ACL='public-read',
    #   Bucket=MESSAGE_BUCKET,
    #   Key= messageId + ".mp3")
    
    location = s3.get_bucket_location(Bucket=MESSAGE_BUCKET)
    region = os.environ.get("REGION")
    if region is None:
        url_beginning = "https://s3.amazonaws.com/"
    else:
        url_beginning = "https://s3-" + str(region) + ".amazonaws.com/"
    url = url_beginning \
            + str(MESSAGE_BUCKET) \
            + "/" \
            + str(messageId) \
            + ".mp3"
    
    logger.warning("Mp3 file saved to "+ url)

    # Updating the item in DynamoDB
    # response = table.update_item(
    #     Key={'id':messageId},
    #       UpdateExpression=
    #         "SET #statusAtt = :statusValue, #urlAtt = :urlValue",
    #       ExpressionAttributeValues=
    #         {':statusValue': 'UPDATED', ':urlValue': url},
    #     ExpressionAttributeNames=
    #       {'#statusAtt': 'status', '#urlAtt': 'url'},
    # )
    return