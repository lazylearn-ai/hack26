from pydantic.dataclasses import dataclass
from typing import List


@dataclass
class AimFormInfo:
    sphere: str
    theme: str


@dataclass
class TaskFormInfo:
    sphere: str
    theme: str
    aims: List[str] = None


@dataclass
class PlanFormInfo:
    tasks: List[str] = None


@dataclass
class SourceFormInfo:
    theme: str


@dataclass
class ReportFormInfo:
    sphere: str
    theme: str
    plan: str
    aims: List[str] = None
    tasks: List[str] = None
    sources: List[str] = None
