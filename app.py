# app.py
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
import json

app = FastAPI()

@app.get("/")
def index():
    return FileResponse("index.html")

@app.get("/data")
def data():
    with open("data.json") as f:
        return JSONResponse(json.load(f))
