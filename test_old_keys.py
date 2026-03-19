import tweepy
import os

# 先ほどチャット欄に貼り付けられた古いキー（すでに無効化されているはずのもの）
old_consumer_key = "COWtpTTImgOdkjAHtJwb3TYry"
old_consumer_secret = "V2tbAtjh8WifIODliVDdeMJfHfkcW2IhAXfsulOzlLwsCJBvLM"
old_access_token = "2034449402597879808-q2MovB7ldksicsxx2NTnXnyLyEnVJo"
old_access_token_secret = "nEn458tCFrLYZQQGApR2COlIJNGMn3IRroChjRD7NG3S3"

def verify_old_keys():
    print("Testing old keys (expected to fail)...")
    try:
        client = tweepy.Client(
            consumer_key=old_consumer_key, consumer_secret=old_consumer_secret,
            access_token=old_access_token, access_token_secret=old_access_token_secret
        )
        # 自分のユーザー情報を取得しようとしてみる
        # API v2 get_me()
        response = client.get_me()
        if response.data:
            print(f"FAILED: Old keys are STILL VALID. User: {response.data.username}")
        else:
            print("SUCCESS: Old keys returned no data (possibly invalid).")
    except Exception as e:
        print(f"SUCCESS: Old keys are INVALID. Error: {e}")

if __name__ == "__main__":
    verify_old_keys()
