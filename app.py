from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import json

app = FastAPI()

@app.get("/api/data")
def data():
    with open("data.json") as f:
        return JSONResponse(json.load(f))

# Mount static files - use absolute path
# app.mount("/", StaticFiles(directory="/unrivaled-scrape-drop", html=True), name="static")
# Change this line:
app.mount("/", StaticFiles(directory=".", html=True), name="static")