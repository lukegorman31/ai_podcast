from tavily import TavilyClient
import os
from dotenv import load_dotenv

load_dotenv(
    dotenv_path=".env")  

tavily_client_key= os.getenv("TAVILY_API_KEY")

tavily_client = TavilyClient(tavily_client_key)

#Create a function for the mian.py file 

def tavily_search(topic):

    summaries = tavily_client.get_search_context(topic= 'news', query=topic)

    return summaries

