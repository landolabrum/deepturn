from pydantic import BaseModel

class CreateUserAgent(BaseModel):
    user_agent: str | None
    user_agent_data: dict = None
    public_ip: str | None

    class Config:
        orm_mode = True



