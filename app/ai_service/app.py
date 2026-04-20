from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.chat_models import ChatOllama
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os

BASE_DIR = os.path.dirname(__file__)
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev ใช้ * ได้
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
emb = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
db = FAISS.load_local(
    os.path.join(BASE_DIR, "menu_index"),
    emb,
    allow_dangerous_deserialization=True
)

llm = ChatOllama(model="llama3", temperature=0.3)

class Req(BaseModel):
    question: str

@app.post("/ask")
def ask(req: Req):
    docs = db.similarity_search(req.question, k=3)
    context = "\n".join([d.page_content for d in docs])

    prompt = f"""
คุณคือผู้ช่วยร้านอาหาร
ตอบจากข้อมูลนี้เท่านั้น:

{context}

คำถาม: {req.question}
"""

    ans = llm.invoke(prompt)
    return {"answer": ans.content}
