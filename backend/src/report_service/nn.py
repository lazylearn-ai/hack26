from langchain.schema import HumanMessage, SystemMessage
from langchain.chat_models.gigachat import GigaChat
from pyalex import Works
import pyalex
import requests
import PyPDF2
from io import BytesIO
from googlesearch import search
from bs4 import BeautifulSoup

pyalex.config.email = "lazylearn.ai@gmail.com"

from config import GIGACHAT_AUTH

chat = GigaChat(credentials=GIGACHAT_AUTH, verify_ssl_certs=False, scope='GIGACHAT_API_CORP')

messages = [
    SystemMessage(
        content="Ты бот, помогающий в подготовке научных исследований и статей."
    )
]


def parse_list(res):
    arr = []
    start_idx = 0
    for idx, ch in enumerate(res):
        if ch in "0123456789":
            arr.append(res[start_idx+2:idx])
            start_idx = idx 
    arr.append(res[start_idx+2:])
    arr = arr[1:]

    return arr

def get_aims(sphere, theme):
    query = f"""Сгенерируй 5 целей для проекта {theme} в области {sphere}."""
    func_messages = messages.copy()
    func_messages.append(HumanMessage(content=query))
    res = chat(func_messages)
    aims = parse_list(res.content)

    return aims

def get_tasks(sphere, theme, aims):
    aims = "; ".join(aims)

    query = f"""Сгенерируй 5 задач для проекта {theme} в области {sphere}. Учти следующие цели {aims}"""
    func_messages = messages.copy()
    func_messages.append(HumanMessage(content=query))
    res = chat(func_messages)
    tasks = parse_list(res.content)

    return tasks


def get_plan(tasks):
    tasks = "; ".join(tasks)
    query = f"""Сгенерируй план работ по следующим задачам {tasks}. План должен включать задачи и подзадачи. Для каждого пункта 
    укажи примерные сроки выполнения. В конце укажи общий срок выполнения плана."""
    func_messages = messages.copy()
    func_messages.append(HumanMessage(content=query))
    res = chat(func_messages)
    plan = res.content

    return plan

def get_summarized_text(text):
    func_messages = [
        SystemMessage(
            content="""Ты интеллектуальный помощник для быстрой суммаризации текста научных статей. Ты должен из длинной научной статьи
            генерировать короткий текст из нескольких предложений, который описывает эту статью."""
        )]
    user_input = f"Сократи весь следующий текст до нескольких предложений: {text}"
    func_messages.append(HumanMessage(content=user_input))
    res = chat(func_messages)

    if res.response_metadata['finish_reason'] == 'blacklist':
        return None
    else:
        end_text = res.content
        return end_text


def get_sources_google(theme):
    urls = []
    for i in search(theme, tld="co.in", num=10, stop=10, pause=2):
        urls.append(i) 
    
    articles = [] 
    for url in urls:
        try:
            response = requests.head(url)            
            if 'application/pdf' not in response.headers.get('Content-Type'):
                response = requests.get(url)
                if response.status_code == 200:
                    page_content = response.content
                    soup = BeautifulSoup(page_content, 'html.parser')
                    text = " ".join(soup.get_text().split())
                    article_text = get_summarized_text(text)
                    if article_text != None:
                        articles.append((article_text, url))
        except:
            continue
    return articles

def get_sources_alex(theme):
    urls = [work["primary_location"]["pdf_url"] for work in Works().search(theme).get()[:2]]
    articles = []
    for url in urls:
        if url != None:
            try:
                article = requests.get(url).content
                article_text = ""
                with BytesIO(article) as data:
                    read_pdf = PyPDF2.PdfReader(data)
                    for page in range(min(2, len(read_pdf.pages))):
                        article_text = article_text + " " + read_pdf.pages[page].extract_text()
                articles.append((get_summarized_text(article_text), url))
            except:
                continue
    return articles

def get_sources(theme):
    return get_sources_google(theme) #+ get_sources_google(theme)


def get_relevance(theme):
    query = f"""Сгенерируй актуальность для проекта {theme}."""
    func_messages = messages.copy()
    func_messages.append(HumanMessage(content=query))
    res = chat(func_messages).content

    return res


def get_recomendations(plan):
    query = f"""Сформируй краткие общие рекомендации по выполнению плана {plan}."""
    func_messages = messages.copy()
    func_messages.append(HumanMessage(content=query))
    res = chat(func_messages).content

    return res


def get_material(theme):
    query = f"""Сформируй справочный материал по теме по  {theme}."""
    func_messages = messages.copy()
    func_messages.append(HumanMessage(content=query))
    res = chat(func_messages).content

    return res


def get_time(arr):
    return int(sum(arr) / 910)


def get_complexity(len_aims, len_tasks):
    complexity = len_aims + len_tasks 
    return complexity

def get_report(sphere, theme, aims, tasks, sources, plan):
    recomendations =  get_recomendations(plan)
    material = get_material(theme)
    return {
        "title": theme.lower().capitalize(),
        "relevance": get_relevance(theme),
        "sphere": sphere.lower(),
        "aims": aims,
        "tasks": tasks,
        "sources": sources,
        "plan": plan,
        "time": get_time([len(sphere), len(aims) * 200, len(tasks) * 200, len(sources) * 100, len(plan), len(material), len(recomendations)]),
        "material": material,
        "recomendations": recomendations,
        "complexity": get_complexity(len(aims), len(tasks))
    }
