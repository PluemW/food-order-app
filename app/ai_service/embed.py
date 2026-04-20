from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import json
import os

BASE_DIR = os.path.dirname(__file__)

# โหลด menu
with open(os.path.join(BASE_DIR, "menu.json"), "r", encoding="utf-8") as f:
    menu = json.load(f)

texts = [f"{m['name']} {m['description']} ราคา {m['price']}" for m in menu]
emb = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

db = FAISS.from_texts(texts, emb)
db.save_local(os.path.join(BASE_DIR, "menu_index"))

print("✅ embed done")