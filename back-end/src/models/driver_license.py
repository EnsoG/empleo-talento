from sqlmodel import SQLModel, Field, Relationship

class DriverLicense(SQLModel, table=True):
    __tablename__="licencia_conducir"
    license_id: int | None = Field(default=None, primary_key=True, sa_column_kwargs={"name": "id_licencia"})
    license: int = Field(sa_column_kwargs={"name": "licencia"})
    # Candidate Relationship
    candidates: list["Candidate"] = Relationship(back_populates="driver_license")