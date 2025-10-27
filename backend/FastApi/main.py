from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.car_routes import router as car_router
from routes.user_routes import router as user_router
from routes.dashboard_routes import router as dashboard_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # atau ["*"] untuk development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(car_router)
app.include_router(user_router)
app.include_router(dashboard_router)
